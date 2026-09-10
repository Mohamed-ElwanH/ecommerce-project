import { inject } from '@angular/core';
import {  CanMatchFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const userGuard: CanMatchFn = (route, state) => {
  const _authService = inject(AuthService); //as you can't use the constructor to do dependency injection here
  const _router = inject(Router);
  if (_authService.checkIfLoginWithRole() === 'user') {
    return true;
  } else {
    _router.navigate(['/login']);
    return false;
  }
};

//same rule as userGuard but as a CanActivateFn, for routes that must
//redirect to login when already compiled (canMatch would just skip them)
export const userActivateGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  if (_authService.checkIfLoginWithRole() === 'user') {
    return true;
  } else {
    _router.navigate(['/login']);
    return false;
  }
};
