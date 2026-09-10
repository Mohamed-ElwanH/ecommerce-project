import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order-service';
import {
  IOrder,
  TOrderStatus,
  ORDER_STATUSES,
  orderProductName,
} from '../../core/models/order.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DatePipe, DecimalPipe, FormsModule],
  selector: 'app-allorders',
  styleUrl: './allorders.css',
  templateUrl: './allorders.html',
})
export class Allorders implements OnInit {
  constructor(private _orderService: OrderService) {}
  orders: IOrder[] = [];
  statuses: TOrderStatus[] = ORDER_STATUSES;
  statusFilter = '';
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this._orderService.getAllOrdersHistory().subscribe({
      next: (res) => (this.orders = res.data),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }

  productName = orderProductName;

  get filteredOrders(): IOrder[] {
    if (!this.statusFilter) return this.orders;
    return this.orders.filter((o) => o.status === this.statusFilter);
  }

  onStatusChange(order: IOrder) {
    this.errorMessage = '';
    this.successMessage = '';
    this._orderService.updateOrderStatus(order._id, order.status).subscribe({
      next: (res) => {
        this.successMessage = res.message;
      },
      error: (err) => {
        this.errorMessage = getApiError(err);
        this.ngOnInit(); //restore the real status
      },
    });
  }
}
