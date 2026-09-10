import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart-service';
import { UserService } from '../../core/services/user-service';
import { OrderService } from '../../core/services/order-service';
import { IAddress } from '../../core/models/address.model';
import { ICart, ICartItem } from '../../core/models/cart.model';

@Component({
  imports: [RouterLink, DecimalPipe, FormsModule],
  selector: 'app-checkoutpage',
  styleUrl: './checkoutpage.css',
  templateUrl: './checkoutpage.html',
})
export class Checkoutpage implements OnInit {
  constructor(
    private _cartService: CartService,
    private _userService: UserService,
    private _orderService: OrderService,
    private _router: Router,
  ) {}
  cart: ICart | null = null;
  addresses: IAddress[] = [];
  selectedAddressId = '';
  placing = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this._cartService.getCart().subscribe({
      next: (res) => (this.cart = res.data),
      error: (err) => (this.errorMessage = err.error?.error),
    });
    this._userService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data;
        const preferred =
          this.addresses.find((a) => a.isDefault) || this.addresses[0];
        if (preferred) this.selectedAddressId = preferred._id;
      },
      error: (err) => console.log(err),
    });
  }

  //only items whose price the user confirmed may proceed to an order
  get confirmedItems(): ICartItem[] {
    return (this.cart?.items || []).filter((i) => !i.isPriceChanged);
  }

  get unconfirmedItems(): ICartItem[] {
    return (this.cart?.items || []).filter((i) => i.isPriceChanged);
  }

  total(): number {
    return this.confirmedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  placeOrder() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.selectedAddressId) {
      this.errorMessage = 'Select a delivery address first';
      return;
    }
    if (this.unconfirmedItems.length) {
      this.errorMessage =
        'Some items had a price change - confirm their new price in the cart first';
      return;
    }
    this.placing = true;
    this._orderService.createOrder(this.selectedAddressId).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.placing = false;
        this._cartService.refreshCount();
        this._router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.placing = false;
        this.errorMessage =
          typeof err.error === 'string' ? err.error : err.error?.error;
      },
    });
  }
}
