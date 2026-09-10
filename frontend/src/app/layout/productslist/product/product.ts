import { Component, Input } from '@angular/core';
import { IProduct } from '../../../core/models/product.model';
import { environment } from '../../../../enviroments/env';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  imports: [RouterLink, DecimalPipe, TranslatePipe],
  selector: 'app-product',
  styleUrl: './product.css',
  templateUrl: './product.html',
})
export class Product {
  @Input() myProduct!: IProduct;
  staticURL = environment.staticURL;

  firstImage(product: IProduct) {
    return product.images && product.images.length
      ? this.staticURL + product.images[0]
      : '';
  }
}
