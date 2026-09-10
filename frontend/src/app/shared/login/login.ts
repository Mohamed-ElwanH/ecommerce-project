import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ILoginData } from '../../core/models/auth.model';
import { CartService } from '../../core/services/cart-service';
import { getApiError } from '../../core/utils/get-api-error';

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
    private _router: Router,
  ) {}

  errorMessage = '';

  loginForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl(''),
  });
  login() {
    this.errorMessage = '';
    this._authService.login(this.loginForm.value as ILoginData).subscribe({
      next: () => {
        //wait for the guest cart to reach the server before moving on,
        //so the cart page never shows a pre-merge snapshot
        this._cartService.mergeGuestCart().subscribe({
          next: () => this.afterLogin(),
          error: () => this.afterLogin(),
        });
      },
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }
  private afterLogin() {
    if (this._authService.checkIfLoginWithRole() === 'admin') {
      this._router.navigate(['/dashboard']);
    } else {
      this._router.navigate(['/']);
    }
  }
}
