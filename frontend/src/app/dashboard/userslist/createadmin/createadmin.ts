import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { ICreateUserData } from '../../../core/models/user.model';

@Component({
  imports: [FormsModule],
  selector: 'app-createadmin',
  styleUrl: './createadmin.css',
  templateUrl: './createadmin.html',
})
export class Createadmin {
  constructor(private _userService: UserService) {}
  form = {
    name: '',
    password: '',
    gender: 'male' as 'male' | 'female',
  };
  successMessage = '';
  errorMessage = '';

  submit() {
    this.successMessage = '';
    this.errorMessage = '';
    //POST /user/admin (createUser would create a plain 'user' role account)
    this._userService.createAdmin(this.form as ICreateUserData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.form = { name: '', password: '', gender: 'male' };
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }
}
