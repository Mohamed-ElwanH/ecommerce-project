import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { UserService } from '../../core/services/user-service';
import { IAddress } from '../../core/models/address.model';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account implements OnInit {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}
  userName = '';
  userEmail = '';
  userRole = '';
  addresses: IAddress[] = [];
  errorMessage = '';
  successMessage = '';

  addForm = {
    title: '',
    street: '',
    city: '',
    area: '',
    building: '',
    floor: '',
    apartment: '',
    notes: '',
    isDefault: false,
  };
  editingId: string | null = null;
  editForm: Partial<IAddress> = {};

  ngOnInit(): void {
    const token = this._authService.returnToken();
    if (!token || !this._authService.returnUserId()) return;
    this._authService.returnUserData().subscribe((name) => {
      this.userName = name || '';
    });
    this.userEmail = this.readEmailFromToken(token);
    this.userRole = this._authService.checkIfLoginWithRole();
    this.loadAddresses();
  }

  loadAddresses() {
    this._userService.getMyAddresses().subscribe({
      next: (res) => (this.addresses = res.data),
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  private readEmailFromToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || '';
    } catch {
      return '';
    }
  }

  addAddress() {
    this.errorMessage = '';
    this.successMessage = '';
    this._userService.addAddress(this.addForm as IAddress).subscribe({
      next: (res) => {
        this.addresses = res.data;
        this.successMessage = res.message;
        this.addForm = {
          title: '',
          street: '',
          city: '',
          area: '',
          building: '',
          floor: '',
          apartment: '',
          notes: '',
          isDefault: false,
        };
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  startEdit(address: IAddress) {
    this.editingId = address._id;
    this.editForm = { ...address };
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm = {};
  }

  saveEdit() {
    if (!this.editingId) return;
    this.errorMessage = '';
    this._userService.updateAddress(this.editingId, this.editForm).subscribe({
      next: (res) => {
        //update returns the single address - patch it into the list
        this.addresses = this.addresses.map((a) =>
          a._id === this.editingId ? res.data : a,
        );
        this.successMessage = res.message;
        this.cancelEdit();
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  deleteAddress(address: IAddress) {
    this.errorMessage = '';
    if (!confirm(`Delete address "${address.title}"?`)) return;
    this._userService.deleteAddress(address._id).subscribe({
      next: (res) => {
        this.addresses = res.data;
        this.successMessage = res.message;
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  setDefault(address: IAddress) {
    this.errorMessage = '';
    this._userService.setDefaultAddress(address._id).subscribe({
      next: (res) => {
        this.addresses = res.data;
        this.successMessage = res.message;
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }
}
