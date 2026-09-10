import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order-service';
import {
  IOrder,
  TOrderStatus,
  ORDER_STATUSES,
  orderProductName,
} from '../../core/models/order.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DatePipe, DecimalPipe, ReactiveFormsModule],
  selector: 'app-allorders',
  styleUrl: './allorders.css',
  templateUrl: './allorders.html',
})
export class Allorders implements OnInit {
  constructor(private _orderService: OrderService) {}
  orders: IOrder[] = [];
  statuses: TOrderStatus[] = ORDER_STATUSES;
  filterCtrl = new FormControl('');
  statusFilter = '';
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.filterCtrl.valueChanges.subscribe((v) => (this.statusFilter = v || ''));
    this.load();
  }

  load() {
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

  onStatusChange(order: IOrder, e: any) {
    order.status = e.target.value;
    this.errorMessage = '';
    this.successMessage = '';
    this._orderService.updateOrderStatus(order._id, order.status).subscribe({
      next: (res) => {
        this.successMessage = res.message;
      },
      error: (err) => {
        this.errorMessage = getApiError(err);
        this.load(); //restore the real status
      },
    });
  }
}
