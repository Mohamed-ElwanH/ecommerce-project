import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { IUser } from '../../core/models/user.model';

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
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  //ban/unban a user - a blocked user is refused by the backend
  //when trying to place an order
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
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }
}
