import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category-service';
import { ICategory } from '../../core/models/category.model';

@Component({
  imports: [FormsModule],
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
  form = { name: '', slug: '', isActive: true };

  ngOnInit(): void {
    this.load();
  }

  load() {
    this._categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.editingId) {
      this._categoryService.updateCategory(this.editingId, this.form).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.cancelEdit();
          this.load();
        },
        error: (err) => (this.errorMessage = err.error?.error),
      });
    } else {
      this._categoryService.createCategory(this.form).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.form = { name: '', slug: '', isActive: true };
          this.load();
        },
        error: (err) => (this.errorMessage = err.error?.error),
      });
    }
  }

  startEdit(category: ICategory) {
    this.editingId = category._id;
    this.form = {
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { name: '', slug: '', isActive: true };
  }

  deleteCategory(category: ICategory) {
    this.errorMessage = '';
    if (!confirm(`Delete category "${category.name}"? (soft delete)`)) return;
    this._categoryService.deleteCategory(category._id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.load();
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }
}
