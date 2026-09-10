import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user-service';
import { IAddress } from '../../core/models/address.model';
import { getApiError } from '../../core/utils/get-api-error';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  imports: [RouterLink, FormsModule, TranslatePipe],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account implements OnInit {
  constructor(private _userService: UserService) {}
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
    this._userService.getMe().subscribe({
      next: (res) => {
        this.userName = res.data.name;
        this.userEmail = res.data.email || '';
        this.userRole = res.data.role;
        this.addresses = res.data.addresses || [];
      },
      error: (err) => (this.errorMessage = getApiError(err)),
    });
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
      error: (err) => (this.errorMessage = getApiError(err)),
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
      error: (err) => (this.errorMessage = getApiError(err)),
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
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }

  setDefault(address: IAddress) {
    this.errorMessage = '';
    this._userService.setDefaultAddress(address._id).subscribe({
      next: (res) => {
        this.addresses = res.data;
        this.successMessage = res.message;
      },
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }
}
