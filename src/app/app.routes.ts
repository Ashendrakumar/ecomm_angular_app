import { Routes } from '@angular/router';
import { ProductDetail } from './features/pdp/product-detail/product-detail';
import { Cart } from './features/cart/cart';
import { ProductListing } from './features/plp/product-listing/product-listing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
    title: 'Products | E-Commerce',
  },
  {
    path: 'products',
    component: ProductListing,
    title: 'Products | E-Commerce',
  },
  {
    path: 'products/:id',
    component: ProductDetail,
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
