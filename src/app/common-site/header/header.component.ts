import { Component, OnInit } from '@angular/core';
import { User } from '../../auth/user';
import { EventService } from '../../event.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    console.log(this.authService.isLoggedIn)

  }

  /*get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }*/

  /*currentUser: User = { email: '', password: '', username: '' }
  isLoggedIn: boolean = false;

  constructor(private eventService: EventService) {
    localStorage.setItem('userEmail', this.currentUser.email);
    localStorage.setItem('username', this.currentUser.username == null ? '' : this.currentUser.username);
  }

  ngOnInit(): void {
    this.eventService.myEvent.subscribe((data) => {
      console.log(`Teste ${data}`)
      if (data) {
        this.isLoggedIn = true;
        console.log(`LoggenIn ${this.isLoggedIn}`)
        this.currentUser.email = '' + localStorage.getItem('username');
      }
      else {
        this.isLoggedIn = false;
        localStorage.setItem('userEmail', '');
        this.currentUser.email = '';
      }
    });
  }*/
}
