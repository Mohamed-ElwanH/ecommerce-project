import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../core/services/product-service';
import { CategoryService } from '../../core/services/category-service';
import { IProduct } from '../../core/models/product.model';
import { ICategory } from '../../core/models/category.model';
import { environment } from '../../../enviroments/env';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-productadminlist',
  styleUrl: './productadminlist.css',
  templateUrl: './productadminlist.html',
})
export class Productadminlist implements OnInit {
  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
  ) {}
  products: IProduct[] = [];
  categories: ICategory[] = [];
  errorMessage = '';
  successMessage = '';
  staticURL = environment.staticURL;

  ngOnInit(): void {
    this.load();
    this._categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: (err) => console.log(err),
    });
  }

  load() {
    this._productService.getAllProducts().subscribe({
      next: (res) => (this.products = res.data),
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  categoryName(categoryId: string) {
    const category = this.categories.find((c) => c._id === categoryId);
    return category ? category.name : categoryId;
  }

  firstImage(product: IProduct) {
    return product.images && product.images.length
      ? this.staticURL + product.images[0]
      : '';
  }

  deleteProduct(product: IProduct) {
    this.errorMessage = '';
    this.successMessage = '';
    if (!confirm(`Delete product "${product.name}"? (soft delete)`)) return;
    this._productService.deleteProduct(product._id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.load();
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }
}
