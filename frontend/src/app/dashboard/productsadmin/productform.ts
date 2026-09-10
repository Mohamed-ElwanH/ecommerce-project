import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product-service';
import { CategoryService } from '../../core/services/category-service';
import { SubCategoryService } from '../../core/services/subCategory-service';
import { ICategory } from '../../core/models/category.model';
import { ISubCategory } from '../../core/models/subCategory.model';
import { IProduct } from '../../core/models/product.model';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-productform',
  styleUrl: './productform.css',
  templateUrl: './productform.html',
})
export class Productform implements OnInit {
  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _subCategoryService: SubCategoryService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
  ) {}
  @ViewChild('imagesInput') imagesInput!: ElementRef<HTMLInputElement>;

  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  editingId: string | null = null;
  errorMessage = '';

  form = {
    name: '',
    desc: '',
    price: 0,
    stock: 0,
    category: '',
    slug: '',
    isActive: true,
    isDeleted: false,
    isTopSale: false,
    isNewArrival: false,
  };
  selectedSubCategories: string[] = [];

  ngOnInit(): void {
    this._categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: (err) => console.log(err),
    });
    this._subCategoryService.getAllSubCategories().subscribe({
      next: (res) => (this.subCategories = res.data),
      error: (err) => console.log(err),
    });

    //edit mode: /dashboard/products/:id/edit (the backend has no GET by id,
    //so find the product inside the full list)
    const id = this._activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = id;
      this._productService.getAllProducts().subscribe({
        next: (res) => {
          const product = res.data.find((p) => p._id === id);
          if (product) this.fillFrom(product);
          else this.errorMessage = 'Product not found';
        },
        error: (err) => (this.errorMessage = err.error?.error),
      });
    }
  }

  fillFrom(product: IProduct) {
    this.form = {
      name: product.name,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      category: product.category,
      slug: product.slug,
      isActive: product.isActive,
      isDeleted: product.isDeleted,
      isTopSale: product.isTopSale,
      isNewArrival: product.isNewArrival,
    };
    this.selectedSubCategories = product.subCategory || [];
  }

  toggleSub(subId: string, checked: boolean) {
    if (checked && !this.selectedSubCategories.includes(subId)) {
      this.selectedSubCategories = [...this.selectedSubCategories, subId];
    } else if (!checked) {
      this.selectedSubCategories = this.selectedSubCategories.filter(
        (id) => id !== subId,
      );
    }
  }

  get subCategoriesOfSelectedCategory() {
    if (!this.form.category) return [];
    return this.subCategories.filter((s) => s.category === this.form.category);
  }

  //keep the slug in sync with the name unless the user typed one
  onNameChange() {
    if (!this.editingId) {
      this.form.slug = this.form.name.toLowerCase().replaceAll(' ', '-');
    }
  }

  submit() {
    this.errorMessage = '';
    if (this.editingId) {
      //PUT /product/:id is JSON only (no upload middleware on that route)
      this._productService
        .updateProduct(this.editingId, {
          ...this.form,
          subCategory: this.selectedSubCategories,
        })
        .subscribe({
          next: () => this._router.navigate(['/dashboard/products']),
          error: (err) => (this.errorMessage = err.error?.error),
        });
    } else {
      //POST /product is multipart/form-data with an "images" file array
      const formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('desc', this.form.desc);
      formData.append('price', String(this.form.price));
      formData.append('stock', String(this.form.stock));
      formData.append('category', this.form.category);
      formData.append('slug', this.form.slug);
      for (const subId of this.selectedSubCategories) {
        formData.append('subCategory', subId);
      }
      const files = this.imagesInput.nativeElement.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
      }
      this._productService.createProduct(formData).subscribe({
        next: () => this._router.navigate(['/dashboard/products']),
        error: (err) => (this.errorMessage = err.error?.error),
      });
    }
  }
}
