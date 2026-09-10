import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import {
  ISubCategoriesResponse,
  ISubCategoryResponse,
} from '../models/subCategory.model';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private apiURL = environment.apiURL + 'subCategory';
  constructor(private _http: HttpClient) {}

  getAllSubCategories() {
    return this._http.get<ISubCategoriesResponse>(this.apiURL);
  }
  getSubCategoryBySlug(slug: string) {
    return this._http.get<ISubCategoryResponse>(this.apiURL + `/${slug}`);
  }
  createSubCategory(data: { name: string; slug: string; category: string }) {
    return this._http.post<ISubCategoryResponse>(this.apiURL, data);
  }
  updateSubCategory(
    id: string,
    updates: { name?: string; slug?: string; category?: string },
  ) {
    return this._http.put<ISubCategoryResponse>(
      this.apiURL + `/${id}`,
      updates,
    );
  }
  deleteSubCategory(id: string) {
    return this._http.delete<ISubCategoryResponse>(this.apiURL + `/${id}`);
  }
}
