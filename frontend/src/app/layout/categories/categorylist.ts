import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category-service';
import { SubCategoryService } from '../../core/services/subCategory-service';
import { ICategory } from '../../core/models/category.model';
import { ISubCategory } from '../../core/models/subCategory.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [RouterLink],
  selector: 'app-categorylist',
  styleUrl: './categorylist.css',
  templateUrl: './categorylist.html',
})
export class Categorylist implements OnInit {
  constructor(
    private _categoryService: CategoryService,
    private _subCategoryService: SubCategoryService,
  ) {}
  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this._categoryService.getAllCategories().subscribe({
      next: (res) =>
        (this.categories = res.data.filter(
          (c) => c.isActive && !c.isDeleted,
        )),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
    this._subCategoryService.getAllSubCategories().subscribe({
      next: (res) =>
        (this.subCategories = res.data.filter(
          (s) => s.isActive && !s.isDeleted,
        )),
      error: (err) => console.log(err),
    });
  }

  subCategoriesOf(categoryId: string) {
    return this.subCategories.filter((s) => s.category === categoryId);
  }
}
