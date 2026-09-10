import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import {
  ICartResponse,
  ICartMessageResponse,
  IGuestCartItem,
} from '../models/cart.model';
import { IProduct } from '../models/product.model';
import { AuthService } from './auth-service';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiURL = environment.apiURL + 'cart';
  private guestCartKey = 'guestCart';
  private cartCount = new BehaviorSubject<number>(0);

  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
  ) {
    this._authService.returnUserData().subscribe({
      next: (name) => {
        if (name && this._authService.returnToken()) {
          //logged in: keep the badge in sync with the server cart
          this.getCart().subscribe({
            next: (res) => this.cartCount.next(res.data.items.length),
            error: () => {},
          });
        } else {
          this.cartCount.next(this.getGuestCart().length);
        }
      },
    });
  }

  returnCartCount() {
    return this.cartCount.asObservable();
  }

  //re-sync the badge from the server (e.g. after placing an order)
  refreshCount() {
    if (this.isLoggedIn()) {
      this.getCart().subscribe({
        next: (res) => this.cartCount.next(res.data.items.length),
        error: () => {},
      });
    } else {
      this.cartCount.next(this.getGuestCart().length);
    }
  }

  //checkIfLoginWithRole validates expiry too - a merely-present but
  //expired token would 401 on the server and bounce the user to /login
  private isLoggedIn() {
    return this._authService.checkIfLoginWithRole() !== '';
  }

  //server cart (populate: items.product)
  getCart() {
    return this._http.get<ICartResponse>(this.apiURL);
  }

  addItem(
    product: IProduct,
    quantity: number,
  ): Observable<ICartResponse | null> {
    if (this.isLoggedIn()) {
      return this._http
        .put<ICartResponse>(this.apiURL + '/item', {
          productId: product._id,
          quantity,
        })
        .pipe(
          tap((res) => this.cartCount.next(res.data.items.length)),
        );
    }
    this.addToGuestCart(product, quantity);
    return of(null);
  }

  updateItemQuantity(productId: string, quantity: number) {
    if (this.isLoggedIn()) {
      //this endpoint answers with a message only, so reload the cart after it
      return this._http.put<ICartMessageResponse>(
        this.apiURL + '/item/quantity',
        { productId, quantity },
      );
    }
    const guestCart = this.getGuestCart();
    const item = guestCart.find((i) => i.productId === productId);
    if (item) item.quantity = quantity;
    this.writeGuestCart(guestCart);
    return of({ message: 'Item quantity updated' } as ICartMessageResponse);
  }

  removeItem(productId: string): Observable<ICartResponse | null> {
    if (this.isLoggedIn()) {
      return this._http
        .delete<ICartResponse>(this.apiURL, { body: { productId } })
        .pipe(
          tap((res) => this.cartCount.next(res.data.items.length)),
        );
    }
    this.writeGuestCart(
      this.getGuestCart().filter((i) => i.productId !== productId),
    );
    this.cartCount.next(this.getGuestCart().length);
    return of(null);
  }

  confirmPriceChange(productId: string) {
    return this._http.put<ICartResponse>(
      this.apiURL + `/item/confirm-price/${productId}`,
      {},
    );
  }

  //called right after login: pushes the localStorage cart to the server
  mergeGuestCart(): Observable<ICartResponse | null> {
    const guestCart = this.getGuestCart();
    if (!this.isLoggedIn() || guestCart.length === 0) return of(null);
    const items = guestCart.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      price: i.price,
    }));
    return this._http
      .post<ICartResponse>(this.apiURL + '/merge', { items })
      .pipe(
        tap((res) => {
          localStorage.removeItem(this.guestCartKey);
          this.cartCount.next(res.data.items.length);
        }),
      );
  }

  //guest cart helpers
  getGuestCart(): IGuestCartItem[] {
    const raw = localStorage.getItem(this.guestCartKey);
    return raw ? (JSON.parse(raw) as IGuestCartItem[]) : [];
  }
  private addToGuestCart(product: IProduct, quantity: number) {
    const guestCart = this.getGuestCart();
    const existing = guestCart.find((i) => i.productId === product._id);
    if (existing) {
      existing.quantity += quantity;
      existing.price = product.price;
    } else {
      guestCart.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images && product.images.length ? product.images[0] : '',
        price: product.price,
        quantity,
      });
    }
    this.writeGuestCart(guestCart);
    this.cartCount.next(guestCart.length);
  }
  private writeGuestCart(cart: IGuestCartItem[]) {
    localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
  }
}
