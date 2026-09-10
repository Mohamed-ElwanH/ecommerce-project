import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { ICreateUserData } from '../../../core/models/user.model';
import { getApiError } from '../../../core/utils/get-api-error';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-createadmin',
  styleUrl: './createadmin.css',
  templateUrl: './createadmin.html',
})
export class Createadmin {
  constructor(private _userService: UserService) {}
  adminForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl(''),
    gender: new FormControl('male'),
  });
  successMessage = '';
  errorMessage = '';

  submit() {
    this.successMessage = '';
    this.errorMessage = '';
    //POST /user/admin (createUser would create a plain 'user' role account)
    this._userService
      .createAdmin(this.adminForm.value as ICreateUserData)
      .subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.adminForm.setValue({ name: '', password: '', gender: 'male' });
        },
        error: (err) => (this.errorMessage = getApiError(err)),
      });
  }
}
