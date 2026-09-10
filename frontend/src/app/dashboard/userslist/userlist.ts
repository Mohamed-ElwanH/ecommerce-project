import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { IUser } from '../../core/models/user.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-userlist',
  styleUrl: './userlist.css',
  templateUrl: './userlist.html',
})
export class Userlist implements OnInit {
  constructor(private _userService: UserService) {}
  users: IUser[] = [];
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this._userService.getAllUsers().subscribe({
      next: (res) => (this.users = res.data),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }

  //ban/unban - blocked users cannot place orders
  toggleBlock(user: IUser) {
    this.errorMessage = '';
    this.successMessage = '';
    const blocking = !user.isBlocked;
    if (
      !confirm(
        blocking
          ? `Block "${user.name}" from placing orders?`
          : `Unblock "${user.name}"?`,
      )
    ) {
      return;
    }
    this._userService.setUserBlocked(user._id, blocking).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        user.isBlocked = res.data.isBlocked;
      },
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }
}
