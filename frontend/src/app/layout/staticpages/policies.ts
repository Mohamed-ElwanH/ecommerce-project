import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-policies',
  styleUrl: './staticpage.css',
  template: `
    <h1>Policies</h1>
    <div class="static-page">
      <h3>Orders</h3>
      <p>
        An order can be cancelled by the user while it is still
        <em>pending</em> or <em>in progress</em>. Once an order is shipped it
        can no longer be cancelled, but the store administration can update its
        status (including <em>rejected</em> or <em>refunded</em>).
      </p>
      <h3>Accounts</h3>
      <p>
        Accounts are identified by a username and password - no email is
        required. An account that is blocked by the store administration can no
        longer place orders.
      </p>
      <h3>Prices and stock</h3>
      <p>
        If a product's price changes after you added it to the cart, the item is
        held out of checkout until you confirm the new price. Stock is reserved
        at the moment your order is placed.
      </p>
      <h3>Testimonials</h3>
      <p>
        Testimonials appear publicly only after approval by the store
        administration, and can be hidden or removed at any time.
      </p>
    </div>
  `,
})
export class Policies {}
