import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/env';
import { jwtDecode } from 'jwt-decode';
import { ILoginData, ILoginResponse, ITokenPayload } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = environment.apiURL + 'auth';
  private userData = new BehaviorSubject<string | null>(null);
  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) {}
  returnUserData() {
    return this.userData.asObservable();
  }
  checkIfLogin() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decode = this.decodeToken(token);
      if (decode) {
        {
          this.userData.next(decode.name);
        }
      }
    }
  }
  checkIfLoginWithRole() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decode = this.decodeToken(token);
      if (decode) {
        {
          return decode.role;
        }
      }
    }
    return '';
  }
  returnUserId() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decode = this.decodeToken(token);
      if (decode) {
        return decode.id;
      }
    }
    return '';
  }
  login(data: ILoginData) {
    return this._http.post<ILoginResponse>(this.apiURL + '/login', data).pipe(
      tap((data) => {
        const decode = this.decodeToken(data.token);
        if (decode) {
          this.userData.next(decode.name);
          this.storeToken(data.token);
        }
      }),
    );
  }
  private tokenKey = 'token';

  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  private deleteToken() {
    localStorage.removeItem(this.tokenKey);
  }
  logout() {
    this.deleteToken();
    this.userData.next(null);
    this._router.navigate(['/']); //can keep the user on the page they were already on thats the proper way
  }
  private decodeToken(token: string): ITokenPayload | null {
    try {
      const decode = jwtDecode<ITokenPayload>(token);
      if (decode) {
        const expDate = decode.exp * 1000;
        if (expDate > Date.now()) {
          return decode;
        }
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  returnToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
