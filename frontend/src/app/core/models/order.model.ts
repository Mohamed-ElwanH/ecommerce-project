import { IAddress } from './address.model';

export interface IOrderProductRef {
  _id: string;
  name?: string;
  slug?: string;
}

export interface IOrderProduct {
  productId: IOrderProductRef | string; // populated with name/slug on read endpoints
  quantity: number;
  priceAtOrderTime: number;
}

export function orderProductName(product: IOrderProduct['productId']): string {
  return typeof product === 'object' && product
    ? product.name || product._id
    : product;
}

export type TOrderStatus =
  | 'pending'
  | 'in progress'
  | 'shipped'
  | 'received'
  | 'canceled by user'
  | 'canceled by admin'
  | 'rejected'
  | 'refunded';

export const ORDER_STATUSES: TOrderStatus[] = [
  'pending',
  'in progress',
  'shipped',
  'received',
  'canceled by user',
  'canceled by admin',
  'rejected',
  'refunded',
];

export interface IOrder {
  _id: string;
  user: any; // populated with the user object on read endpoints
  products: IOrderProduct[];
  address: IAddress;
  totalPrice: number;
  status: TOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IOrdersResponse {
  message: string;
  data: IOrder[];
}

export interface IOrderResponse {
  message: string;
  data: IOrder;
}

// PUT /order/status/:id returns data as the plain status string
export interface IOrderStatusResponse {
  message: string;
  data: TOrderStatus;
}
