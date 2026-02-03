import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { Observable, of, delay, throwError, finalize } from 'rxjs';
import { CartItem, Cart, CartUpdateRequest } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service for cart management
 * Handles both guest cart (localStorage) and logged-in cart (API)
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly CART_STORAGE_KEY = 'guest_cart';
  /** Delay for add-to-cart so loader is visible when using JSON/mock API */
  private readonly API_DELAY = 500;

  // Cart state signals
  private readonly _cartItems = signal<CartItem[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _lastError = signal<string | null>(null);

  // Public readonly signals
  readonly cartItems = this._cartItems.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly lastError = this._lastError.asReadonly();

  // Computed signals
  readonly cartTotal = computed(() => {
    return this._cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  readonly cartItemCount = computed(() => {
    return this._cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly cart = computed<Cart>(() => ({
    items: this._cartItems(),
    total: this.cartTotal(),
    itemCount: this.cartItemCount(),
  }));

  constructor() {
    // Initialize cart from storage or API based on auth state
    if (isPlatformBrowser(this.platformId)) {
      if (this.authService.isAuthenticated()) {
        this.loadBackendCart();
      } else {
        this.loadGuestCart();
      }
    }

    // Effect to sync cart when auth state changes
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.mergeGuestCartToBackend();
      } else {
        this.loadGuestCart();
      }
    });

    // Effect to save guest cart whenever it changes
    effect(() => {
      if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
        this.saveGuestCart();
      }
      // Access cartItems to create dependency
      this._cartItems();
    });
  }

  /**
   * Add item to cart
   * @param finalPrice Optional price including variant modifiers (e.g. from PDP currentPrice)
   */
  addToCart(
    product: Product,
    quantity: number = 1,
    selectedVariants: CartItem['selectedVariants'] = [],
    finalPrice?: number,
  ): Observable<CartItem> {
    this._isLoading.set(true);
    this._lastError.set(null);

    let price = finalPrice ?? product.price;
    if (product.variants && selectedVariants.length > 0 && finalPrice == null) {
      // Resolve variant price modifiers from product when finalPrice not provided
      const optionIds = new Set(selectedVariants.map((v) => v.optionId));
      for (const v of product.variants) {
        const opt = v.options.find((o) => optionIds.has(o.id));
        if (opt?.priceModifier) price += opt.priceModifier;
      }
    }
    const finalPriceResolved = price;

    const cartItem: CartItem = {
      id: this.generateCartItemId(),
      productId: product.id,
      product,
      quantity,
      selectedVariants,
      price: finalPriceResolved,
    };

    // Optimistic update
    const currentItems = this._cartItems();
    const existingItemIndex = currentItems.findIndex(
      (item) =>
        item.productId === product.id &&
        this.variantsMatch(item.selectedVariants, selectedVariants),
    );

    let updatedItems: CartItem[];
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
    } else {
      // Add new item
      updatedItems = [...currentItems, cartItem];
    }

    this._cartItems.set(updatedItems);

    // Simulate API call
    return of(cartItem).pipe(
      delay(this.API_DELAY),
      finalize(() => this._isLoading.set(false)),
      // In production, handle errors and rollback
    );
  }

  /**
   * Update cart item quantity
   */
  updateQuantity(itemId: string, quantity: number): Observable<CartItem> {
    if (quantity <= 0) {
      // Don't allow zero or negative quantities - caller should use removeItem instead
      return throwError(
        () => new Error('Quantity must be greater than 0. Use removeItem to remove items.'),
      );
    }

    this._isLoading.set(true);
    this._lastError.set(null);

    // Optimistic update
    const currentItems = this._cartItems();
    const itemIndex = currentItems.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      this._isLoading.set(false);
      return throwError(() => new Error('Item not found in cart'));
    }

    const item = currentItems[itemIndex];
    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = { ...item, quantity };

    this._cartItems.set(updatedItems);

    // Simulate API call with potential stock check
    return of(updatedItems[itemIndex]).pipe(
      delay(this.API_DELAY),
      finalize(() => this._isLoading.set(false)),
      // In production, check stock and rollback if needed
    ) as Observable<CartItem>;
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): Observable<void> {
    this._isLoading.set(true);
    this._lastError.set(null);

    // Optimistic update
    const updatedItems = this._cartItems().filter((item) => item.id !== itemId);
    this._cartItems.set(updatedItems);

    // Simulate API call
    return of(void 0).pipe(
      delay(this.API_DELAY),
      finalize(() => this._isLoading.set(false)),
    );
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this._cartItems.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CART_STORAGE_KEY);
    }
  }

  /**
   * Load guest cart from localStorage
   */
  private loadGuestCart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        this._cartItems.set(items);
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      this._lastError.set('Failed to load cart');
    }
  }

  /**
   * Save guest cart to localStorage
   */
  private saveGuestCart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this._cartItems()));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }

  /**
   * Load cart from backend API (for logged-in users)
   */
  private loadBackendCart(): Observable<CartItem[]> {
    this._isLoading.set(true);
    // In production, make HTTP call to backend
    // For now, return empty cart
    return of([]).pipe(
      delay(this.API_DELAY),
      finalize(() => this._isLoading.set(false)),
    );
  }

  /**
   * Merge guest cart into backend cart on login
   */
  private mergeGuestCartToBackend(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const guestItems = this._cartItems();
    if (guestItems.length === 0) {
      this.loadBackendCart().subscribe((items) => {
        this._cartItems.set(items);
        this._isLoading.set(false);
      });
      return;
    }

    // Simulate API merge
    this._isLoading.set(true);
    // In production, send guest items to backend for merging
    // Backend will merge and return the combined cart
    of(guestItems)
      .pipe(delay(this.API_DELAY))
      .subscribe((mergedItems) => {
        this._cartItems.set(mergedItems);
        // Clear guest cart after successful merge
        localStorage.removeItem(this.CART_STORAGE_KEY);
        this._isLoading.set(false);
      });
  }

  /**
   * Check if two variant arrays match
   */
  private variantsMatch(
    variants1: CartItem['selectedVariants'],
    variants2: CartItem['selectedVariants'],
  ): boolean {
    if (variants1.length !== variants2.length) {
      return false;
    }
    return variants1.every((v1) =>
      variants2.some((v2) => v1.variantId === v2.variantId && v1.optionId === v2.optionId),
    );
  }

  /**
   * Generate unique cart item ID
   */
  private generateCartItemId(): string {
    return `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
