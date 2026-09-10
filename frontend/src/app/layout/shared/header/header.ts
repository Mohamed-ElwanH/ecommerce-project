import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';
import { CategoryService } from '../../../core/services/category-service';
import { SubCategoryService } from '../../../core/services/subCategory-service';
import { TranslationService } from '../../../core/services/translation-service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { ICategory } from '../../../core/models/category.model';
import { ISubCategory } from '../../../core/models/subCategory.model';

@Component({
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header implements OnInit {
  constructor(
    private _authService: AuthService,
    private _cartService: CartService,
    private _categoryService: CategoryService,
    private _subCategoryService: SubCategoryService,
    protected translation: TranslationService,
  ) {}
  name = ''; //if name exists then there's someonelogged in and if not then not
  isAdmin = false;
  cartCount = 0;
  //the navbar is generated from the active categories/subcategories
  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];

  ngOnInit(): void {
    this._authService.returnUserData().subscribe({
      next: (data) => {
        if (data) {
          this.name = data;
          this.isAdmin = this._authService.checkIfLoginWithRole() === 'admin';
        } else {
          this.name = '';
          this.isAdmin = false;
        }
      },
    });
    this._cartService.returnCartCount().subscribe({
      next: (count: number) => (this.cartCount = count),
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

  subCategoriesOf(categoryId: string) {
    return this.subCategories.filter((s) => s.category === categoryId);
  }

  logout() {
    this._authService.logout();
  }
}
