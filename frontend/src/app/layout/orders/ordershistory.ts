import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order-service';
import { IOrder, orderProductName } from '../../core/models/order.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DatePipe, DecimalPipe, RouterLink],
  selector: 'app-ordershistory',
  styleUrl: './ordershistory.css',
  templateUrl: './ordershistory.html',
})
export class Ordershistory implements OnInit {
  constructor(private _orderService: OrderService) {}
  orders: IOrder[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this._orderService.getUserOrdersHistory().subscribe({
      next: (res) => (this.orders = res.data),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }

  productName = orderProductName;

  canCancel(order: IOrder) {
    return order.status === 'pending' || order.status === 'in progress';
  }

  cancelOrder(order: IOrder) {
    this.errorMessage = '';
    if (!confirm('Cancel this order?')) return;
    this._orderService.cancelOrder(order._id).subscribe({
      next: (res) => (order.status = res.data.status),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }
}
