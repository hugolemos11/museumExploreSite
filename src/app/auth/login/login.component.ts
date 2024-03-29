import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide = true;
  showClearButton = false;

  loginForm: FormGroup;

  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  errorMessage = '';

  constructor(private service: AuthService,
    private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      // makes the error dissapear
      this.errorMessage = '';
      this.service.SignIn(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
        .catch((error) => {
          this.errorMessage = error;
        });
    } else {
      this.loginForm.markAllAsTouched();
      console.error('Form is invalid!');
    }
  }
}
