import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { User } from '../user';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  @Input() user: User;
  updateUserForm: FormGroup;

  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.updateUserForm = this.formBuilder.group({
      museumName: [this.authService.userData?.username || '', [Validators.required]],
      oldPassword: [''],
      newPassword: [''],
      repeatPassword: [''],
    });
    this.user = {
      uid: '',
      email: '',
      admin: true,
      username: '',
      museumId: '',
    }
  }

  updateUser() {
    if (this.updateUserForm.valid) {
      if (!this.isPasswordHaveValue() && !this.isNewPasswordHaveSameValueAsOld() && !this.isNewPasswordHaveSameValueAsRePassword()) {
        if (this.updateUserForm.get('museumName')?.value != this.authService.userData?.username) {
          try {
            this.authService.updateUser(this.user).then(() => {
              this.authService.updateMuseumName(this.user.museumId!!, this.user.username!!).then(() => {
                localStorage.setItem('user', JSON.stringify(this.user));
                if (this.updateUserForm.get('newPassword')?.value != '') {
                  this.authService.updatePassword(this.user.email, this.updateUserForm.get('newPassword')?.value, this.updateUserForm.get('oldPassword')?.value)
                }
                this.closeUpdateModal.nativeElement.click();
              })
            });
          } catch (error) {
            console.error(error);
          }
        } else {
          if (this.updateUserForm.get('newPassword')?.value != '') {
            this.authService.updatePassword(this.user.email, this.updateUserForm.get('newPassword')?.value, this.updateUserForm.get('oldPassword')?.value)
          }
          this.closeUpdateModal.nativeElement.click();
        }
      } else {
        this.updateUserForm.markAllAsTouched();
      }
    } else {
      // Handle invalid form
      this.updateUserForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }

  isPasswordHaveValue() {
    let isValid: boolean = true
    if (this.updateUserForm.get('newPassword')?.value == '' || (this.updateUserForm.get("oldPassword")?.value != '' && this.updateUserForm.get('newPassword')?.value != '')) {
      isValid = false
    }
    return isValid
  }

  isNewPasswordHaveSameValueAsOld() {
    let isValid: boolean = true
    if (this.updateUserForm.get('oldPassword')?.value != this.updateUserForm.get('newPassword')?.value || this.updateUserForm.get('newPassword')?.value == '') {
      isValid = false
    }
    return isValid
  }

  isNewPasswordHaveSameValueAsRePassword() {
    let isValid: boolean = true
    if (this.updateUserForm.get('newPassword')?.value == this.updateUserForm.get('repeatPassword')?.value) {
      isValid = false
    }
    return isValid
  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.updateUserForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.updateUserForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  loadUser(user: User) {
    if (user != null) {
      this.user = user
      console.log(this.user)
    } else {
      console.log('User ID is undefined. Error.');
    }
  }
}
