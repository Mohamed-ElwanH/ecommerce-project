import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import {
  ICategoriesResponse,
  ICategoryResponse,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiURL = environment.apiURL + 'category';
  constructor(private _http: HttpClient) {}

  getAllCategories() {
    return this._http.get<ICategoriesResponse>(this.apiURL);
  }
  getCategoryBySlug(slug: string) {
    return this._http.get<ICategoryResponse>(this.apiURL + `/${slug}`);
  }
  createCategory(data: { name: string; slug: string }) {
    return this._http.post<ICategoryResponse>(this.apiURL, data);
  }
  updateCategory(id: string, updates: { name?: string; slug?: string }) {
    return this._http.put<ICategoryResponse>(this.apiURL + `/${id}`, updates);
  }
  deleteCategory(id: string) {
    return this._http.delete<ICategoryResponse>(this.apiURL + `/${id}`);
  }
}
