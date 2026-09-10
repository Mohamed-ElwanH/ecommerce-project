import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report-service';
import { ISalesReport } from '../../core/models/report.model';
import { OrderService } from '../../core/services/order-service';
import { IOrder } from '../../core/models/order.model';

@Component({
  imports: [DecimalPipe, DatePipe, RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  constructor(
    private _reportService: ReportService,
    private _orderService: OrderService,
  ) {}
  report: ISalesReport | null = null;
  recentOrders: IOrder[] = [];

  ngOnInit(): void {
    this._reportService.getSalesReport().subscribe({
      next: (res) => (this.report = res.data),
      error: (err) => console.log(err),
    });
    this._orderService.getAllOrdersHistory().subscribe({
      next: (res) => (this.recentOrders = res.data.slice(-5).reverse()),
      error: (err) => console.log(err),
    });
  }

  get stats() {
    return this.report?.overallStats?.[0];
  }
}
