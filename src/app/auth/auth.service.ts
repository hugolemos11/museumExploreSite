import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from './user';
import { uid } from 'chart.js/dist/helpers/helpers.core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: User // Save logged in user data
    | undefined // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    //public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // Create a reference to the Firestore document for the current user.
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

        // Retrieve a snapshot of the user document from Firestore.
        userRef.get().subscribe((docSnapshot) => {
          if (docSnapshot.exists) {
            // Extract user data from the snapshot and assign it to userData.
            this.userData = docSnapshot.data() as User;
            console.log(this.userData)
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

    /*this.afAuth.onAuthStateChanged(async user => {
      if (user) {
        this.userData = await this.afs.doc<any>(`users/${user.uid}`).snapshotChanges().pipe(
          map(actions => {
            const id = actions.payload.id;
            const data = actions.payload.data();
            return { id, ...data }
          })
        );
      } else {
        this.userData = null;
      }
    })*/
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((_) => {
        //this.SetUserData(result.user);
        console.log(this.userData)
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign up with email/password
  /*SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        Call the SendVerificaitonMail() function when new user sign 
        up and returns promise 
        //this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }*/
  /*// Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }*/
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  /*SetUserData(user: any) {
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

      userRef.get().subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          this.userData = docSnapshot.data() as User;
          console.log(this.userData)

          return /*userRef.set(userData, { merge: true }).then(() => {
            console.log('User data updated successfully');
          }).catch((error) => {
            console.error('Error updating user data:', error);
          });
        } else {
          console.error('User document does not exist in Firestore');
          return false
        }
      });
    } catch (e) {
      console.error(e);
    }
    return false;
  }*/
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']);
    });
  }
}
