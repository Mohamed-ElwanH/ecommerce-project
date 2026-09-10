import { IProduct } from './product.model';

// GET /cart populates items.product with the full product document
export interface ICartItem {
  _id: string;
  product: IProduct;
  quantity: number;
  price: number; // price captured when the item was added
  isPriceChanged?: boolean;
}

export interface ICart {
  _id?: string;
  user?: string;
  items: ICartItem[];
}

export interface ICartResponse {
  message: string;
  data: ICart;
}

// PUT /cart/item/quantity only returns a message, no data
export interface ICartMessageResponse {
  message: string;
}

// Guest cart line kept in localStorage until login/merge
export interface IGuestCartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}
