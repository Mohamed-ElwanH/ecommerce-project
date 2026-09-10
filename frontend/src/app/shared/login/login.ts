import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ILoginData } from '../../core/models/auth.model';
import { CartService } from '../../core/services/cart-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  constructor(
    private _authService: AuthService,
    private _cartService: CartService,
  ) {}

  errorMessage = '';

  loginForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl(''),
  });
  login() {
    this.errorMessage = '';
    this._authService.login(this.loginForm.value as ILoginData).subscribe({
      next: (res) => {
        //if something was collected in the guest cart, push it to the server now
        this._cartService.mergeGuestCart().subscribe({
          complete: () => console.log(res.message),
        });
      },
      error: (err) => {
        //the backend answers 404 with a plain string and 403/500 with {error}
        this.errorMessage =
          typeof err.error === 'string' ? err.error : err.error?.error;
      },
    });
  }
}
