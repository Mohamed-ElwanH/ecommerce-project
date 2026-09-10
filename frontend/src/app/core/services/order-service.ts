import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import {
  IOrdersResponse,
  IOrderResponse,
  IOrderStatusResponse,
  TOrderStatus,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiURL = environment.apiURL + 'order';
  constructor(private _http: HttpClient) {}

  createOrder(addressId: string) {
    return this._http.post<IOrderResponse>(this.apiURL, { addressId });
  }
  cancelOrder(orderId: string) {
    return this._http.put<IOrderResponse>(this.apiURL + '/cancel', {
      id: orderId,
    });
  }
  updateOrderStatus(orderId: string, status: TOrderStatus) {
    return this._http.put<IOrderStatusResponse>(
      this.apiURL + `/status/${orderId}`,
      { status },
    );
  }
  getUserOrdersHistory() {
    return this._http.get<IOrdersResponse>(this.apiURL + '/user-orders');
  }
  getAllOrdersHistory() {
    return this._http.get<IOrdersResponse>(this.apiURL + '/all-orders');
  }
}
