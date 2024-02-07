import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UpdateUserComponent } from '../../auth/update-user/update-user.component';
import { User } from '../../auth/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isMobileLayout?: boolean;
  user: User;

  @ViewChild(UpdateUserComponent) updateComponent!: UpdateUserComponent;

  constructor(public authService: AuthService) {
    this.user = {
      uid: '',
      email: '',
    }
    this.isMobileLayout = window.innerWidth > 770;
  }
  ngOnInit(): void {
    // Retrieve data from localStorage
    const userDataString = localStorage.getItem('user');

    // Check if data exists in localStorage
    if (userDataString) {
      // Parse the JSON string to get the object
      this.user = JSON.parse(userDataString);
    } else {
      // Handle the case when no data is found in localStorage
      console.log('No user data found in localStorage');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobileLayout = window.innerWidth > 770;
  }

  setUser(event: any) {
    if (this.user !== undefined) {
      console.log(this.user)
      this.updateComponent.loadUser(this.user);
    } else {
      console.log("erro");
    }
  }
}
