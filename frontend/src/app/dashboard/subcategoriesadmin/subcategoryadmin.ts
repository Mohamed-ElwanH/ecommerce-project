import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubCategoryService } from '../../core/services/subCategory-service';
import { CategoryService } from '../../core/services/category-service';
import { ISubCategory } from '../../core/models/subCategory.model';
import { ICategory } from '../../core/models/category.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-subcategoryadmin',
  styleUrl: './subcategoryadmin.css',
  templateUrl: './subcategoryadmin.html',
})
export class Subcategoryadmin implements OnInit {
  constructor(
    private _subCategoryService: SubCategoryService,
    private _categoryService: CategoryService,
  ) {}
  subCategories: ISubCategory[] = [];
  categories: ICategory[] = [];
  errorMessage = '';
  successMessage = '';
  editingId: string | null = null;
  form = new FormGroup({
    name: new FormControl(''),
    slug: new FormControl(''),
    category: new FormControl(''),
    isActive: new FormControl(true),
  });

  ngOnInit(): void {
    this.load();
    this._categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: (err) => console.log(err),
    });
  }

  load() {
    this._subCategoryService.getAllSubCategories().subscribe({
      next: (res) => (this.subCategories = res.data),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }

  categoryName(categoryId: string) {
    const category = this.categories.find((c) => c._id === categoryId);
    return category ? category.name : categoryId;
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';
    const v: any = this.form.value;
    if (this.editingId) {
      this._subCategoryService.updateSubCategory(this.editingId, v).subscribe({
          next: (res) => {
            this.successMessage = res.message;
            this.cancelEdit();
            this.load();
          },
          error: (err) => (this.errorMessage = getApiError(err)),
        });
    } else {
      this._subCategoryService.createSubCategory(v).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.form.setValue({
            name: '',
            slug: '',
            category: '',
            isActive: true,
          });
          this.load();
        },
        error: (err) => (this.errorMessage = getApiError(err)),
      });
    }
  }

  startEdit(subCategory: ISubCategory) {
    this.editingId = subCategory._id;
    this.form.setValue({
      name: subCategory.name,
      slug: subCategory.slug,
      category: subCategory.category,
      isActive: subCategory.isActive,
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.setValue({ name: '', slug: '', category: '', isActive: true });
  }

  deleteSubCategory(subCategory: ISubCategory) {
    this.errorMessage = '';
    if (!confirm(`Delete subcategory "${subCategory.name}"? (soft delete)`)) return;
    this._subCategoryService.deleteSubCategory(subCategory._id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.load();
      },
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }
}
