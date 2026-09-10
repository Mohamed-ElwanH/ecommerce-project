import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICanComponentDeactivate } from '../../core/models/canComponentDeactivate.model';
import { UserService } from '../../core/services/user-service';
import { ICreateUserData } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { getApiError } from '../../core/utils/get-api-error';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  imports: [ReactiveFormsModule, TranslatePipe],
  selector: 'app-signup',
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup implements ICanComponentDeactivate {
  constructor(
    private _userService: UserService,
    private _router: Router,
  ) {}
  canDeactivate(): boolean | Promise<boolean> {
    if (this.myForm.dirty) {
      return confirm('Are you sure you you want to leave without saving');
    }
    return true;
  }
  myForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl(''),
    gender: new FormControl<'male' | 'female'>('male'),
  });
  successMessage = '';
  errorMessage = '';
  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    this._userService
      .createUser(this.myForm.value as ICreateUserData)
      .subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.myForm.markAsPristine();
        },
        error: (err) => (this.errorMessage = getApiError(err)),
      });
  }
  goToLogin() {
    this._router.navigate(['/login']);
  }
}
