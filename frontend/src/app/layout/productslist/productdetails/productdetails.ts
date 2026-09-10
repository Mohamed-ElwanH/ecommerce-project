import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { IProduct } from '../../../core/models/product.model';
import { environment } from '../../../../enviroments/env';
import { CartService } from '../../../core/services/cart-service';
import { DecimalPipe } from '@angular/common';
import { Product } from '../product/product';
import { getApiError } from '../../../core/utils/get-api-error';

@Component({
  imports: [RouterLink, DecimalPipe, Product],
  selector: 'app-productdetails',
  styleUrl: './productdetails.css',
  templateUrl: './productdetails.html',
})
export class Productdetails implements OnInit {
  constructor(
    private _activeRoute: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService,
  ) {}
  myProduct: IProduct | null = null;
  relatedProducts: IProduct[] = [];
  staticURL = environment.staticURL;
  quantity = 1;
  cartMessage = '';
  added = false;
  loadingRelated = false;
  firstParamEmission = true;

  ngOnInit(): void {
    this.myProduct = this._activeRoute.snapshot.data['myProductResponse'].data;
    this.loadRelated();
    //route params reuse the component, so refetch on slug change
    this._activeRoute.paramMap.subscribe((params) => {
      if (this.firstParamEmission) {
        this.firstParamEmission = false;
        return;
      }
      const slug = params.get('slug');
      if (!slug) return;
      this.quantity = 1;
      this.added = false;
      this.cartMessage = '';
      this._productService.getProductBySlug(slug).subscribe({
        next: (res) => {
          this.myProduct = res.data;
          this.loadRelated();
        },
        error: (err) => console.log(err),
      });
    });
  }

  onQuantityChange(e: any) {
    this.quantity = Number(e.target.value);
  }

  firstImage(product: IProduct) {
    return product.images && product.images.length
      ? this.staticURL + product.images[0]
      : '';
  }

  //related: same category, excluding the shown product
  private loadRelated() {
    const current = this.myProduct;
    if (!current) return;
    this.loadingRelated = true;
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        this.relatedProducts = res.data
          .filter(
            (p) =>
              p._id !== current._id &&
              p.category === current.category &&
              p.isActive &&
              !p.isDeleted,
          )
          .slice(0, 4);
        this.loadingRelated = false;
      },
      error: () => (this.loadingRelated = false),
    });
  }

  addToCart() {
    if (!this.myProduct) return;
    this.added = false;
    this._cartService.addItem(this.myProduct, this.quantity).subscribe({
      next: () => (this.added = true),
      error: (err) => (this.cartMessage = getApiError(err)),
    });
  }
}
