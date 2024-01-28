import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isMobileLayout?: boolean;

  constructor(public authService: AuthService) {
    this.isMobileLayout = window.innerWidth > 770;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobileLayout = window.innerWidth > 770;
  }
}
