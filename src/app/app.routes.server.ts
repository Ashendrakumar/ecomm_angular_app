import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ProductService } from './core/services/product.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(ProductService);
      const ids = await dataService.getAllProjectIds();
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
