import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product-service';
import { CategoryService } from '../../core/services/category-service';
import { SubCategoryService } from '../../core/services/subCategory-service';
import { ICategory } from '../../core/models/category.model';
import { ISubCategory } from '../../core/models/subCategory.model';
import { IProduct } from '../../core/models/product.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
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

  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  editingId: string | null = null;
  errorMessage = '';
  selectedImages: File[] = [];

  productForm = new FormGroup({
    name: new FormControl(''),
    desc: new FormControl(''),
    price: new FormControl(0),
    stock: new FormControl(0),
    category: new FormControl(''),
    slug: new FormControl(''),
    isActive: new FormControl(true),
    isDeleted: new FormControl(false),
    isTopSale: new FormControl(false),
    isNewArrival: new FormControl(false),
  });
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

    //edit mode: /dashboard/products/:id/edit
    const id = this._activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = id;
      this._productService.getProductById(id).subscribe({
        next: (res) => {
          if (res.data) this.fillFrom(res.data);
          else this.errorMessage = 'Product not found';
        },
        error: (err) => (this.errorMessage = getApiError(err)),
      });
    }
  }

  fillFrom(product: IProduct) {
    this.productForm.setValue({
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
    });
    this.selectedSubCategories = product.subCategory || [];
  }

  onImagesChange(e: any) {
    this.selectedImages = [];
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedImages.push(files[i]);
      }
    }
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
    const category = this.productForm.value.category;
    if (!category) return [];
    return this.subCategories.filter((s) => s.category === category);
  }

  //keep the slug in sync with the name unless the user typed one
  onNameChange() {
    if (!this.editingId) {
      const name = this.productForm.value.name || '';
      this.productForm.patchValue({
        slug: name.toLowerCase().replaceAll(' ', '-'),
      });
    }
  }

  submit() {
    this.errorMessage = '';
    const v: any = this.productForm.value;
    if (this.editingId) {
      //PUT /product/:id is JSON only (no upload middleware on that route)
      this._productService
        .updateProduct(this.editingId, {
          ...v,
          subCategory: this.selectedSubCategories,
        })
        .subscribe({
          next: () => this._router.navigate(['/dashboard/products']),
          error: (err) => (this.errorMessage = getApiError(err)),
        });
    } else {
      //POST /product is multipart/form-data with an "images" file array
      const formData = new FormData();
      formData.append('name', v.name || '');
      formData.append('desc', v.desc || '');
      formData.append('price', String(v.price));
      formData.append('stock', String(v.stock));
      formData.append('category', v.category || '');
      formData.append('slug', v.slug || '');
      for (const subId of this.selectedSubCategories) {
        formData.append('subCategory', subId);
      }
      for (const file of this.selectedImages) {
        formData.append('images', file);
      }
      this._productService.createProduct(formData).subscribe({
        next: () => this._router.navigate(['/dashboard/products']),
        error: (err) => (this.errorMessage = getApiError(err)),
      });
    }
  }
}
