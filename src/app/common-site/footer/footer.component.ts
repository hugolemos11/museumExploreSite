import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(public authService: AuthService) { }
  ngOnInit(): void {
    console.log(this.authService.isLoggedIn)

  }
}
