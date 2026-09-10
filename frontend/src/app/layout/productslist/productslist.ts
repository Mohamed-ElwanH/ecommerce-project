import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/models/product.model';
import { Product } from './product/product';
import { CategoryService } from '../../core/services/category-service';
import { SubCategoryService } from '../../core/services/subCategory-service';
import { ICategory } from '../../core/models/category.model';
import { ISubCategory } from '../../core/models/subCategory.model';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  imports: [Product, FormsModule, TranslatePipe],
  selector: 'app-productslist',
  styleUrl: './productslist.css',
  templateUrl: './productslist.html',
})
export class Productslist implements OnInit {
  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _subCategoryService: SubCategoryService,
    private _activeRoute: ActivatedRoute,
  ) {}
  myProducts: IProduct[] = [];
  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  selectedCategory = '';
  selectedSubCategory = '';

  ngOnInit(): void {
    //arriving from the navbar/categories page passes ?category=&subCategory=;
    //subscribe (not snapshot) so switching categories in the navbar while
    //already on this page re-filters
    this._activeRoute.queryParamMap.subscribe((params) => {
      this.selectedCategory = params.get('category') || '';
      this.selectedSubCategory = params.get('subCategory') || '';
    });
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        //the list endpoint returns everything, so hide soft-deleted/hidden ones
        this.myProducts = res.data.filter((p) => p.isActive && !p.isDeleted);
      },
      error: (err) => console.log(err),
    });
    this._categoryService.getAllCategories().subscribe({
      next: (res) =>
        (this.categories = res.data.filter(
          (c) => c.isActive && !c.isDeleted,
        )),
      error: (err) => console.log(err),
    });
    this._subCategoryService.getAllSubCategories().subscribe({
      next: (res) =>
        (this.subCategories = res.data.filter(
          (s) => s.isActive && !s.isDeleted,
        )),
      error: (err) => console.log(err),
    });
  }

  subCategoriesOfSelectedCategory() {
    if (!this.selectedCategory) return [];
    return this.subCategories.filter(
      (s) => s.category === this.selectedCategory,
    );
  }

  onCategoryChange() {
    //a subcategory of another category may no longer apply
    if (
      this.selectedSubCategory &&
      !this.subCategoriesOfSelectedCategory().some(
        (s) => s._id === this.selectedSubCategory,
      )
    ) {
      this.selectedSubCategory = '';
    }
  }

  get filteredProducts(): IProduct[] {
    let products = this.myProducts;
    if (this.selectedCategory) {
      products = products.filter(
        (p) => p.category === this.selectedCategory,
      );
    }
    if (this.selectedSubCategory) {
      products = products.filter((p) =>
        (p.subCategory || []).includes(this.selectedSubCategory),
      );
    }
    return products;
  }
}
