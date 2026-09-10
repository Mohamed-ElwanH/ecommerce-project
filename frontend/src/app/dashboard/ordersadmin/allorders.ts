import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order-service';
import { ProductService } from '../../core/services/product-service';
import { IOrder, TOrderStatus, ORDER_STATUSES } from '../../core/models/order.model';

@Component({
  imports: [DatePipe, DecimalPipe, FormsModule],
  selector: 'app-allorders',
  styleUrl: './allorders.css',
  templateUrl: './allorders.html',
})
export class Allorders implements OnInit {
  constructor(
    private _orderService: OrderService,
    private _productService: ProductService,
  ) {}
  orders: IOrder[] = [];
  productNames: Record<string, string> = {};
  statuses: TOrderStatus[] = ORDER_STATUSES;
  statusFilter = '';
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.load();
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        for (const product of res.data) {
          this.productNames[product._id] = product.name;
        }
      },
      error: (err) => console.log(err),
    });
  }

  load() {
    this._orderService.getAllOrdersHistory().subscribe({
      next: (res) => (this.orders = res.data),
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  get filteredOrders(): IOrder[] {
    if (!this.statusFilter) return this.orders;
    return this.orders.filter((o) => o.status === this.statusFilter);
  }

  productName(productId: string) {
    return this.productNames[productId] || productId;
  }

  onStatusChange(order: IOrder) {
    this.errorMessage = '';
    this.successMessage = '';
    this._orderService.updateOrderStatus(order._id, order.status).subscribe({
      next: (res) => {
        this.successMessage = res.message;
      },
      error: (err) => {
        this.errorMessage = err.error?.error;
        this.load(); //restore the real status
      },
    });
  }
}
