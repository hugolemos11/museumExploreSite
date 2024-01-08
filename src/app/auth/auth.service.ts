import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  /*register(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('Registration Successful: ', userCredential)
      })
      .catch((error) => {
        console.error('Registration Error: ', error)
      })
  }*/

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('Login Successful: ', userCredential)
      })
      .catch((error) => {
        console.error('Login Error: ', error)
      })
  }

  logout() {
    this.auth.signOut()
      .then(() => {
        console.log('Logged out');
      })
      .catch((error) => {
        console.error('Logout Error: ', error);
      })
  }
}
