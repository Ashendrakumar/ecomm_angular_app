import { Routes } from '@angular/router';
import { ProductDetail } from './features/pdp/product-detail/product-detail';
import { Cart } from './features/cart/cart';
import { ProductListingComponent } from './features/plp/product-listing.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductListingComponent
  },
  {
    path: 'products/:id',
    component: ProductDetail
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
