import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import {
  Product,
  ProductListResponse,
  ProductFilters,
  ProductSortOption,
} from '../models/product.model';
import { MOCK_PRODUCTS } from '../data/mock-products';

/**
 * Service for product-related operations
 * In production, this would make real HTTP calls
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly API_DELAY = 100; // Simulate network delay

  /**
   * Get all product IDs
   * In production, this would make real HTTP call
   */
  async getAllProjectIds(): Promise<string[]> {
    return MOCK_PRODUCTS.map((p) => String(p.id));
  }

  /**
   * Get products with filters, sorting, and pagination
   */
  getProducts(
    page: number = 1,
    pageSize: number = 12,
    filters?: ProductFilters,
    sort?: ProductSortOption,
  ): Observable<ProductListResponse> {
    // Simulate API call with delay
    return of(this.filterAndSortProducts(MOCK_PRODUCTS, filters, sort, page, pageSize)).pipe(
      delay(this.API_DELAY),
    );
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: string): Observable<Product | null> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return of(product || null).pipe(delay(this.API_DELAY));
  }

  /**
   * Get all unique brands from products
   */
  getBrands(): Observable<string[]> {
    const brands = [...new Set(MOCK_PRODUCTS.map((p) => p.brand))].sort();
    return of(brands).pipe(delay(this.API_DELAY));
  }

  /**
   * Filter and sort products (mocked implementation)
   */
  private filterAndSortProducts(
    products: Product[],
    filters?: ProductFilters,
    sort?: ProductSortOption,
    page: number = 1,
    pageSize: number = 12,
  ): ProductListResponse {
    let filtered = [...products];

    // Apply filters
    if (filters) {
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.brands && filters.brands.length > 0) {
        filtered = filtered.filter((p) => filters.brands!.includes(p.brand));
      }
      if (filters.inStockOnly) {
        filtered = filtered.filter((p) => p.inStock);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.brand.toLowerCase().includes(searchLower),
        );
      }
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
      }
    }

    // Pagination
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total,
      page,
      pageSize,
      hasMore: endIndex < total,
    };
  }
}
