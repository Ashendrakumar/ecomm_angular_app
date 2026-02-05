import { Routes } from '@angular/router';
import { Cart } from './features/cart/cart';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
    title: 'Products | E-Commerce',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/plp/product-listing/product-listing').then((c) => c.ProductListing),
    title: 'Products | E-Commerce',
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/pdp/product-detail/product-detail').then((c) => c.ProductDetail),
    title: 'Product Detail | E-Commerce',
  },
  {
    path: 'cart',
    component: Cart,
    title: 'Cart | E-Commerce',
  },
  {
    path: '**',
    redirectTo: '/products',
    title: 'Products | E-Commerce',
  },
];
