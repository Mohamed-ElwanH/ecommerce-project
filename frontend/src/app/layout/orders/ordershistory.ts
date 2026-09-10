import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { OrderService } from '../../core/services/order-service';
import { ProductService } from '../../core/services/product-service';
import { IOrder } from '../../core/models/order.model';

@Component({
  imports: [DatePipe, DecimalPipe],
  selector: 'app-ordershistory',
  styleUrl: './ordershistory.css',
  templateUrl: './ordershistory.html',
})
export class Ordershistory implements OnInit {
  constructor(
    private _orderService: OrderService,
    private _productService: ProductService,
  ) {}
  orders: IOrder[] = [];
  productNames: Record<string, string> = {};
  errorMessage = '';

  ngOnInit(): void {
    this._orderService.getUserOrdersHistory().subscribe({
      next: (res) => (this.orders = res.data),
      error: (err) => (this.errorMessage = err.error?.error),
    });
    //order products are not populated by the backend, so map ids to names
    //from the public products list
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        for (const product of res.data) {
          this.productNames[product._id] = product.name;
        }
      },
      error: (err) => console.log(err),
    });
  }

  productName(productId: string) {
    return this.productNames[productId] || productId;
  }

  canCancel(order: IOrder) {
    return order.status === 'pending' || order.status === 'in progress';
  }

  cancelOrder(order: IOrder) {
    this.errorMessage = '';
    if (!confirm('Cancel this order?')) return;
    this._orderService.cancelOrder(order._id).subscribe({
      next: (res) => (order.status = res.data.status),
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }
}
