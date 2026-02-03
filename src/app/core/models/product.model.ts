/**
 * Product model representing a single product in the e-commerce system
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For showing discounts
  brand: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  category: string;
  createdAt: string;
  variants?: ProductVariant[];
}

/**
 * Product variant for size, color, etc.
 */
export interface ProductVariant {
  id: string;
  name: string; // e.g., "Color", "Size"
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  value: string; // e.g., "Red", "Large"
  priceModifier?: number; // Additional price for this variant
  inStock: boolean;
  stockQuantity: number;
  image?: string; // Variant-specific image
}

/**
 * Product listing filters
 */
export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  inStockOnly?: boolean;
  search?: string;
}

/**
 * Product sort options
 */
export type ProductSortOption = 'price-asc' | 'price-desc' | 'newest';

/**
 * Paginated product response
 */
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
