import { Product, VariantOption } from './product.model';

/**
 * Cart item representing a product in the cart with selected variants
 */
export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants: SelectedVariant[];
  price: number; // Final price including variant modifiers
}

/**
 * Selected variant option for a cart item
 */
export interface SelectedVariant {
  variantId: string;
  variantName: string;
  optionId: string;
  optionValue: string;
}

/**
 * Cart state
 */
export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * Cart update request
 */
export interface CartUpdateRequest {
  itemId: string;
  quantity: number;
}
