import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { ProductService } from './core/services/product.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },

  /*
   * Product Listing Page (dynamic filters, pagination)
   */
  {
    path: 'products',
    renderMode: RenderMode.Server,
  },

  /*
   * Product Detail Page (SEO + static generation)
   */
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const productService = inject(ProductService);
      const ids = await productService.getAllProductIds();
      return ids.map((id) => ({ id }));
    },
  },

  /*
   * Cart should stay client-side (localStorage usage)
   */
  {
    path: 'cart',
    renderMode: RenderMode.Client,
  },

  /*
   * Fallback
   */
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
