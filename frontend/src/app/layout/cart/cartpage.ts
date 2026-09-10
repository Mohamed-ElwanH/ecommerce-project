import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart-service';
import { AuthService } from '../../core/services/auth-service';
import { ICartItem, IGuestCartItem } from '../../core/models/cart.model';
import { environment } from '../../../enviroments/env';

@Component({
  imports: [RouterLink, DecimalPipe, FormsModule],
  selector: 'app-cartpage',
  styleUrl: './cartpage.css',
  templateUrl: './cartpage.html',
})
export class Cartpage implements OnInit {
  constructor(
    private _cartService: CartService,
    private _authService: AuthService,
  ) {}
  isLoggedIn = false;
  items: ICartItem[] = []; //server cart rows (product populated)
  guestItems: IGuestCartItem[] = []; //localStorage cart rows
  staticURL = environment.staticURL;
  errorMessage = '';

  ngOnInit(): void {
    //validates expiry - an expired token must not hit the server cart
    this.isLoggedIn = this._authService.checkIfLoginWithRole() !== '';
    if (this.isLoggedIn) {
      this.loadCart();
    } else {
      this.guestItems = this._cartService.getGuestCart();
    }
  }

  loadCart() {
    this._cartService.getCart().subscribe({
      next: (res) => (this.items = res.data.items || []),
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  //items whose price is unchanged: these proceed to checkout automatically
  get readyItems(): ICartItem[] {
    return this.items.filter((i) => !i.isPriceChanged);
  }

  //items whose price changed since they were added: held back until confirmed
  get priceChangedItems(): ICartItem[] {
    return this.items.filter((i) => i.isPriceChanged);
  }

  readyTotal(): number {
    return this.readyItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  guestTotal(): number {
    return this.guestItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  productImage(item: ICartItem) {
    const images = item.product?.images;
    return images && images.length ? this.staticURL + images[0] : '';
  }

  changeQuantity(item: ICartItem) {
    if (item.quantity < 1) item.quantity = 1;
    this._cartService
      .updateItemQuantity(item.product._id, item.quantity)
      .subscribe({
        next: () => this.loadCart(),
        error: (err: any) => (this.errorMessage = err.error?.error),
      });
  }

  changeGuestQuantity(item: IGuestCartItem) {
    if (item.quantity < 1) item.quantity = 1;
    this._cartService.updateItemQuantity(item.productId, item.quantity);
    this.guestItems = this._cartService.getGuestCart();
  }

  remove(item: ICartItem) {
    this._cartService.removeItem(item.product._id).subscribe({
      next: () => this.loadCart(),
      error: (err: any) => (this.errorMessage = err.error?.error),
    });
  }

  removeGuest(item: IGuestCartItem) {
    this._cartService.removeItem(item.productId);
    this.guestItems = this._cartService.getGuestCart();
  }

  //the server kept the old price after an admin changed it;
  //confirming accepts the new price for that item
  confirmPrice(item: ICartItem) {
    this._cartService.confirmPriceChange(item.product._id).subscribe({
      next: () => this.loadCart(),
      error: (err: any) => (this.errorMessage = err.error?.error),
    });
  }
}
