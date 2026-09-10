import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category-service';
import { ICategory } from '../../core/models/category.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-categoryadmin',
  styleUrl: './categoryadmin.css',
  templateUrl: './categoryadmin.html',
})
export class Categoryadmin implements OnInit {
  constructor(private _categoryService: CategoryService) {}
  categories: ICategory[] = [];
  errorMessage = '';
  successMessage = '';
  editingId: string | null = null;
  form = new FormGroup({
    name: new FormControl(''),
    slug: new FormControl(''),
    isActive: new FormControl(true),
  });

  ngOnInit(): void {
    this.load();
  }

  load() {
    this._categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';
    const v: any = this.form.value;
    if (this.editingId) {
      this._categoryService.updateCategory(this.editingId, v).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.cancelEdit();
          this.load();
        },
        error: (err) => (this.errorMessage = getApiError(err)),
      });
    } else {
      this._categoryService.createCategory(v).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.form.setValue({ name: '', slug: '', isActive: true });
          this.load();
        },
        error: (err) => (this.errorMessage = getApiError(err)),
      });
    }
  }

  startEdit(category: ICategory) {
    this.editingId = category._id;
    this.form.setValue({
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.setValue({ name: '', slug: '', isActive: true });
  }

  deleteCategory(category: ICategory) {
    this.errorMessage = '';
    if (!confirm(`Delete category "${category.name}"? (soft delete)`)) return;
    this._categoryService.deleteCategory(category._id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.load();
      },
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }
}
