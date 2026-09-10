import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import {
  IProductsResponse,
  IProductResponse,
  IProductPayload,
} from '../models/product.model';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http: HttpClient) {} //dependency injection
  private apiURL = environment.apiURL + 'product';

  getAllProducts() {
    return this._http.get<IProductsResponse>(this.apiURL);
  }
  getProductBySlug(slug: string) {
    return this._http.get<IProductResponse>(this.apiURL + `/${slug}`);
  }
  //create: multer expects a multipart form with an "images" file array field
  createProduct(formData: FormData) {
    return this._http.post<IProductResponse>(this.apiURL, formData);
  }
  //update is a plain JSON PUT (the backend route has no upload middleware)
  updateProduct(id: string, payload: Partial<IProductPayload>) {
    return this._http.put<IProductResponse>(
      this.apiURL + `/${id}`,
      payload,
    );
  }
  deleteProduct(id: string) {
    return this._http.delete<IProductResponse>(this.apiURL + `/${id}`);
  }
}
