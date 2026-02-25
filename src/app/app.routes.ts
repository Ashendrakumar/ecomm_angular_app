import { Routes } from '@angular/router';
import { Cart } from './features/cart/cart';
import { AuthRoutesEnum, FeatureRoutesEnum } from './core/consts/routes.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: FeatureRoutesEnum.Products,
    pathMatch: 'full',
    title: 'Products | E-Commerce',
  },
  {
    path: AuthRoutesEnum.Login,
    title: 'Login | E-Commerce',
    loadComponent: () =>
      import('./auth/login-user/login-user.component').then((c) => c.LoginUserComponent),
  },
  {
    path: AuthRoutesEnum.Register,
    title: 'Register | E-Commerce',
    loadComponent: () =>
      import('./auth/register-user/register-user.component').then((c) => c.RegisterUserComponent),
  },
  // FEATURE ROUTES
  {
    path: FeatureRoutesEnum.Products,
    loadComponent: () =>
      import('./features/plp/product-listing/product-listing').then((c) => c.ProductListing),
    title: 'Products | E-Commerce',
  },
  {
    path: FeatureRoutesEnum.ProductDetail,
    loadComponent: () =>
      import('./features/pdp/product-detail/product-detail').then((c) => c.ProductDetail),
    title: 'Product Detail | E-Commerce',
  },
  {
    path: FeatureRoutesEnum.Cart,
    component: Cart,
    title: 'Cart | E-Commerce',
  },
  {
    path: FeatureRoutesEnum.Checkout,
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((c) => c.CheckoutComponent),
    title: 'Checkout | E-Commerce',
  },
  {
    path: '**',
    redirectTo: FeatureRoutesEnum.Products,
    title: 'Products | E-Commerce',
  },
];
