import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart-service';
import { UserService } from '../../core/services/user-service';
import { OrderService } from '../../core/services/order-service';
import { IAddress } from '../../core/models/address.model';
import { ICart, ICartItem } from '../../core/models/cart.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule],
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
  addressForm = new FormGroup({
    addressId: new FormControl(''),
  });
  placing = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this._cartService.getCart().subscribe({
      next: (res) => (this.cart = res.data),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
    this._userService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data;
        const preferred =
          this.addresses.find((a) => a.isDefault) || this.addresses[0];
        if (preferred) {
          this.addressForm.setValue({ addressId: preferred._id });
        }
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
    const addressId = this.addressForm.value.addressId;
    if (!addressId) {
      this.errorMessage = 'Select a delivery address first';
      return;
    }
    if (this.unconfirmedItems.length) {
      this.errorMessage =
        'Some items had a price change - confirm their new price in the cart first';
      return;
    }
    this.placing = true;
    this._orderService.createOrder(addressId).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.placing = false;
        this._cartService.refreshCount();
        this._router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.placing = false;
        this.errorMessage = getApiError(err);
      },
    });
  }
}
