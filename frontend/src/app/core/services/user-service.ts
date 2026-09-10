import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import {
  ICreateUserData,
  IUsersResponse,
  IUserResponse,
} from '../models/user.model';
import {
  IAddress,
  IAddressesResponse,
  IAddressResponse,
} from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  private apiURL = environment.apiURL + 'user';

  getAllUsers() {
    return this._http.get<IUsersResponse>(this.apiURL);
  }

  createUser(data: ICreateUserData) {
    return this._http.post<IUserResponse>(this.apiURL, data);
  }

  createAdmin(data: ICreateUserData) {
    return this._http.post<IUserResponse>(this.apiURL + '/admin', data);
  }

  //saved addresses of the logged-in user (GET /user/me/addresses)
  getMyAddresses() {
    return this._http.get<IAddressesResponse>(
      this.apiURL + '/me/addresses',
    );
  }
  addAddress(data: IAddress) {
    return this._http.post<IAddressesResponse>(
      this.apiURL + '/me/addresses',
      data,
    );
  }
  updateAddress(addressId: string, data: Partial<IAddress>) {
    return this._http.put<IAddressResponse>(
      this.apiURL + `/me/addresses/${addressId}`,
      data,
    );
  }
  deleteAddress(addressId: string) {
    return this._http.delete<IAddressesResponse>(
      this.apiURL + `/me/addresses/${addressId}`,
    );
  }
  setDefaultAddress(addressId: string) {
    return this._http.put<IAddressesResponse>(
      this.apiURL + `/me/addresses/${addressId}/default`,
      {},
    );
  }

  //admin block/unblock (a blocked user cannot place orders)
  setUserBlocked(userId: string, isBlocked: boolean) {
    return this._http.put<IUserResponse>(
      this.apiURL + `/${userId}/block`,
      { isBlocked },
    );
  }
}
