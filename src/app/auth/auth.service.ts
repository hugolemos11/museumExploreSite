import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from './user';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { MuseumService } from '../museums/museum.service';
import { switchMap, EMPTY } from 'rxjs';
import { error } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: User = { uid: '', email: '' }
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private museumService: MuseumService,
    public router: Router,
    //public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log(user.uid)
        // Create a reference to the Firestore document for the current user.
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
        // Retrieve a snapshot of the user document from Firestore.
        userRef.get().subscribe((docSnapshot) => {
          if (docSnapshot.exists) {
            console.log(docSnapshot.data())
            // Extract user data from the snapshot and assign it to userData.
            //this.userData = docSnapshot.data() as User;
            this.userData.uid = user.uid;
            this.userData.email = user.email!!;
            this.userData.admin = docSnapshot.data()?.admin;
            this.userData.museumId = docSnapshot.data()?.museumId;
            this.userData.username = docSnapshot.data()?.username;
            // Update the user data in localStorage.
            localStorage.setItem('user', JSON.stringify(this.userData));
            JSON.parse(localStorage.getItem('user')!);
          } else {
            console.error('User document does not exist in Firestore')
          }
        });
      } else {
        // If user is not authenticated, set user data in localStorage to 'null'.
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string): Promise<String> {
    return new Promise<string>((_, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((_) => {
          this.afAuth.authState.subscribe(async (user) => {
            if (user) {

              // Use a while loop to wait until this.userData.uid is empty
              while (this.userData.uid == '') {
                // Wait for a short duration before checking again
                await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the delay as needed
              }

              console.log(this.userData)
              if (this.userData?.admin == true) {
                this.router.navigate(['dashboard']);
              }
              reject("Não é um administrador!");
            }
          });
        })
        .catch((_) => {
          reject("Autenticação inválida!");
        });
    });
  }

  // Sign up with email/password
  SignUp(email: string, password: string, username: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(email, result.user!.uid, username);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SetUserData(email: string, uid: string, username: string) {
    this.museumService.getMuseumIdByMuseumName(username).pipe(
      switchMap((recievedMuseumId) => {
        if (recievedMuseumId != null) {
          var firestoreUser: any = {
            'admin': true,
            'museumId': recievedMuseumId,
            'username': username,
          };
          return this.afs.collection<User>('users').doc(uid).set(firestoreUser);
        } else {
          // Handle the case where museumId is null
          throw error
        }
      })
    ).subscribe(
      (result) => {
        console.log('User data set successfully:', result);
      },
      (error) => {
        console.error('Error setting user data:', error);
      }
    );
  }
  /*// Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }*/

  // Reset Forgot password
  /*ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }*/

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']);
    });
  }

  updateUser(user: User): Promise<void> {
    var firestoreUser: any = {
      'username': user.username,
    };
    return this.afs.collection<User>('users').doc(user.uid).update(firestoreUser);
  }

  updateMuseumName(museumId: string, museumName: string): Promise<void> {
    var firestoreMuseum: any = {
      'name': museumName,
    };
    return this.afs.collection('museums').doc(museumId).update(firestoreMuseum);
  }

  async updatePassword(email: string, newPassword: string, oldPassword: string): Promise<void> {
    try {
      // Reauthenticate the user before updating the password (required by Firebase)
      await this.afAuth.signInWithEmailAndPassword(email, oldPassword);

      // Get the currently authenticated user
      const user = await this.afAuth.currentUser;

      if (user) {
        // Update the password
        await user.updatePassword(newPassword);

        console.log('Password updated successfully.');
      } else {
        console.error('User not authenticated.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}
