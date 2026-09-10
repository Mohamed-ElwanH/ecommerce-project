import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/models/product.model';
import { Product } from '../productslist/product/product';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial } from '../../core/models/testimonial.model';

@Component({
  imports: [Product, RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  constructor(
    private _productService: ProductService,
    private _testimonialService: TestimonialService,
  ) {}
  topSales: IProduct[] = [];
  newArrivals: IProduct[] = [];
  testimonials: ITestimonial[] = [];

  ngOnInit(): void {
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        const visible = res.data.filter((p) => p.isActive && !p.isDeleted);
        this.topSales = visible.filter((p) => p.isTopSale).slice(0, 4);
        this.newArrivals = visible.filter((p) => p.isNewArrival).slice(0, 4);
      },
      error: (err) => console.log(err),
    });
    this._testimonialService.getApprovedTestimonials().subscribe({
      next: (res) => (this.testimonials = res.data.slice(0, 3)),
      error: (err) => console.log(err),
    });
  }
}
