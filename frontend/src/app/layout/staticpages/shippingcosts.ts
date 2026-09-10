import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-shippingcosts',
  styleUrl: './staticpage.css',
  template: `
    <h1>Shipping costs</h1>
    <div class="static-page">
      <p>Shipping is calculated per order at a flat rate by area:</p>
      <table>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Cost</th>
            <th>Estimated time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cairo &amp; Giza</td>
            <td>50 EGP</td>
            <td>1 - 2 days</td>
          </tr>
          <tr>
            <td>Other governorates</td>
            <td>75 EGP</td>
            <td>2 - 5 days</td>
          </tr>
          <tr>
            <td>Remote areas</td>
            <td>100 EGP</td>
            <td>3 - 7 days</td>
          </tr>
        </tbody>
      </table>
      <p>
        Orders over 5000 EGP ship free. Shipping is added on the invoice, not in
        the cart total shown at checkout.
      </p>
    </div>
  `,
})
export class Shippingcosts {}
