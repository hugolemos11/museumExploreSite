import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { EventService } from '../../event.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide = true;
  showClearButton = false;

  loginForm: FormGroup;
  user: User

  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor(private service: AuthService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
    this.user = {
      email: '',
      password: ''
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      console.log(this.user.email);

      this.user = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      }

      try {
        this.service.login(this.user.email, this.user.password);
        localStorage.setItem('userEmail', this.user.email);

        this.eventService.myEvent.emit(true);

        this.router.navigate(['/dashboard']);
      }
      catch (error) {
        console.error(error);
      }
    } else {
      this.loginForm.markAllAsTouched();
      console.error('Form is invalid!');
    }
  }
}
