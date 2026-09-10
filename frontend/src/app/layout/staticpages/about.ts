import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-about',
  styleUrl: './staticpage.css',
  template: `
    <h1>About us</h1>
    <div class="static-page">
      <p>
        Mystore is a small demo storefront built with Angular on the front end
        and Express + MongoDB on the back end. It exists as a learning project:
        a complete e-commerce flow from browsing categories to placing orders.
      </p>
      <p>
        What you can do here: browse products by category and subcategory, keep
        a cart as a guest or logged-in user, manage your saved addresses, place
        orders and follow their status, and leave a testimonial for other
        shoppers.
      </p>
      <p>
        The store is a project, not a real business - no payments are taken and
        no data leaves this machine.
      </p>
    </div>
  `,
})
export class About {}
