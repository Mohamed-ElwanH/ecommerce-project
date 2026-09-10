import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const _router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        //missing/invalid token: back to login
        _router.navigate(['/login']);
      } else if (error.status === 403 && !error.url?.includes('/login')) {
        //role denial or blocked account (but not a failed login itself)
        _router.navigate(['/login']);
      }
      //other errors (404 "Invalid email or password", 400 "Cart is empty", ...)
      //are rethrown so the calling component can show them inline
      return throwError(() => error);
    }),
  );
};
