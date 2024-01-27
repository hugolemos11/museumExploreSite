import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isMobileLayout?: boolean;

  constructor(public authService: AuthService) {
    this.isMobileLayout = window.innerWidth > 770;
  }

  ngOnInit(): void {
    window.onresize = () => this.isMobileLayout = window.innerWidth > 770;
  }
}
