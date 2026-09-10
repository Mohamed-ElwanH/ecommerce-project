import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home as layoutHome } from './layout/home/home';
import { Productslist } from './layout/productslist/productslist';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './dashboard/home/home';
import { Userlist } from './dashboard/userslist/userlist';
import { Login } from './shared/login/login';
import { Notfound } from './shared/notfound/notfound';
import { Productdetails } from './layout/productslist/productdetails/productdetails';
import { Account } from './layout/account/account';
import { adminGuard } from './core/guards/admin-guard';
import { userGuard, userActivateGuard } from './core/guards/user-guard';
import { Signup } from './layout/signup/signup';
import { canDeactivateGuard } from './core/guards/can-deactivate-guard';
import { Parent } from './layout/parent/parent';
import { Child } from './layout/child/child';
import { ProductResolver } from './core/resolver/product-resolver';
import { Mysignal } from './layout/mysignal/mysignal';
import { Pipes } from './layout/pipes/pipes';
import { Cartpage } from './layout/cart/cartpage';
import { Checkoutpage } from './layout/checkout/checkoutpage';
import { Ordershistory } from './layout/orders/ordershistory';
import { Testimoniallist } from './layout/testimonials/testimoniallist';
import { Categorylist } from './layout/categories/categorylist';
import { Createadmin } from './dashboard/userslist/createadmin/createadmin';
import { Productadminlist } from './dashboard/productsadmin/productadminlist';
import { Productform } from './dashboard/productsadmin/productform';
import { Categoryadmin } from './dashboard/categoriesadmin/categoryadmin';
import { Subcategoryadmin } from './dashboard/subcategoriesadmin/subcategoryadmin';
import { Allorders } from './dashboard/ordersadmin/allorders';
import { Testimonialmoderation } from './dashboard/testimonialsadmin/testimonialmoderation';
import { Salesreport } from './dashboard/salesreport/salesreport';
import { About } from './layout/staticpages/about';
import { Policies } from './layout/staticpages/policies';
import { Shippingcosts } from './layout/staticpages/shippingcosts';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: layoutHome },
      {
        path: 'products-list',
        component: Productslist,

      },
      {
        path: 'products-list/:slug',
        component: Productdetails,
        resolve: { myProductResponse: ProductResolver }, //resolve takes key and value
      },
      { path: 'categories', component: Categorylist },
      { path: 'testimonials', component: Testimoniallist },
      { path: 'cart', component: Cartpage },
      { path: 'checkout', component: Checkoutpage, canActivate: [userActivateGuard] },
      { path: 'my-orders', component: Ordershistory, canActivate: [userActivateGuard] },
      { path: 'account', component: Account, canActivate: [userActivateGuard] },
      { path: 'about', component: About },
      { path: 'policies', component: Policies },
      { path: 'shipping-costs', component: Shippingcosts },
      { path: 'signup', component: Signup, canDeactivate: [canDeactivateGuard] },
      { path: 'parent', component: Parent },
      { path: 'child', component: Child },
      { path: 'my-signals', component: Mysignal },
      {path:'pipes',component:Pipes}
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'users-list', component: Userlist },
      { path: 'users-list/create-admin', component: Createadmin },
      { path: 'products', component: Productadminlist },
      { path: 'products/new', component: Productform },
      { path: 'products/:id/edit', component: Productform },
      { path: 'categories', component: Categoryadmin },
      { path: 'subcategories', component: Subcategoryadmin },
      { path: 'orders', component: Allorders },
      { path: 'testimonials', component: Testimonialmoderation },
      { path: 'sales-report', component: Salesreport },
      {
        path: 'account',
        loadComponent: () => import('./layout/account/account').then((c) => c.Account),
        canMatch: [userGuard],
      }, //lazy loading a component
    ],
  },
  { path: '**', component: Notfound },
];
