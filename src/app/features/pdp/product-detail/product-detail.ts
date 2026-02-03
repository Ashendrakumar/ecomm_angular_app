import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { Product, VariantOption } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly platformId = inject(PLATFORM_ID);

  // State signals
  private readonly _product = signal<Product | null>(null);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isAddingToCart = signal<boolean>(false);
  private readonly _selectedImage = signal<string | null>(null);
  private readonly _selectedVariants = signal<Map<string, VariantOption>>(new Map());
  private readonly _quantity = signal<number>(1);

  // Public readonly signals
  readonly product = this._product.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAddingToCart = this._isAddingToCart.asReadonly();
  readonly selectedImage = this._selectedImage.asReadonly();
  readonly quantity = this._quantity.asReadonly();

  // Computed signals
  readonly currentPrice = computed(() => {
    const product = this._product();
    if (!product) return 0;

    let price = product.price;
    const selectedVariants = this._selectedVariants();

    // Add variant price modifiers
    selectedVariants.forEach((option) => {
      if (option.priceModifier) {
        price += option.priceModifier;
      }
    });

    return price || 0;
  });

  readonly discountPercentage = computed(() => {
    const product = this._product();
    if (!product || !product.originalPrice) return 0;
    return Math.round(
      ((product.originalPrice - this.currentPrice()) / product.originalPrice) * 100,
    );
  });

  readonly currentStockQuantity = computed(() => {
    const product = this._product();
    if (!product) return 0;

    const selectedVariants = this._selectedVariants();

    // If variants are selected, get stock from selected variant option
    if (selectedVariants.size > 0) {
      let minStock = Infinity;
      selectedVariants.forEach((option) => {
        if (option.stockQuantity < minStock) {
          minStock = option.stockQuantity;
        }
      });
      return minStock === Infinity ? product.stockQuantity : minStock;
    }

    return product.stockQuantity;
  });

  readonly isVariantInStock = computed(() => {
    return this.currentStockQuantity() > 0;
  });

  readonly canAddToCart = computed(() => {
    const product = this._product();
    if (!product) return false;

    // Check if all required variants are selected
    if (product.variants && product.variants.length > 0) {
      const selectedVariants = this._selectedVariants();
      const allVariantsSelected = product.variants.every((variant) =>
        selectedVariants.has(variant.id),
      );
      if (!allVariantsSelected) return false;
    }

    return this.isVariantInStock() && !this._isAddingToCart();
  });

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  /**
   * Load product by ID
   */
  private loadProduct(id: string): void {
    this._isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this._product.set(product);
        this._isLoading.set(false);

        // Set default image
        if (product && product.images.length > 0) {
          this._selectedImage.set(product.images[0]);
        }

        // Auto-select first available variant options
        if (product && product.variants) {
          const defaultVariants = new Map<string, VariantOption>();
          product.variants.forEach((variant) => {
            const firstAvailable = variant.options.find((opt) => opt.inStock);
            if (firstAvailable) {
              defaultVariants.set(variant.id, firstAvailable);
              // Update image if variant has specific image
              if (firstAvailable.image) {
                this._selectedImage.set(firstAvailable.image);
              }
            }
          });
          this._selectedVariants.set(defaultVariants);
        }
      },
      error: () => {
        this._isLoading.set(false);
      },
    });
  }

  /**
   * Select an image
   */
  selectImage(image: string): void {
    this._selectedImage.set(image);
  }

  /**
   * Select a variant option
   */
  selectVariant(variantId: string, option: VariantOption): void {
    if (!option.inStock) return;

    const selectedVariants = new Map(this._selectedVariants());
    selectedVariants.set(variantId, option);
    this._selectedVariants.set(selectedVariants);

    // Update image if variant has specific image
    if (option.image) {
      this._selectedImage.set(option.image);
    }

    // Reset quantity if it exceeds new stock
    if (this._quantity() > this.currentStockQuantity()) {
      this._quantity.set(Math.max(1, this.currentStockQuantity()));
    }
  }

  /**
   * Check if a variant option is selected
   */
  isVariantSelected(variantId: string, optionId: string): boolean {
    const selected = this._selectedVariants().get(variantId);
    return selected?.id === optionId;
  }

  /**
   * Increase quantity
   */
  increaseQuantity(): void {
    const max = this.currentStockQuantity();
    if (this._quantity() < max) {
      this._quantity.update((q) => q + 1);
    }
  }

  /**
   * Decrease quantity
   */
  decreaseQuantity(): void {
    if (this._quantity() > 1) {
      this._quantity.update((q) => q - 1);
    }
  }

  /**
   * Handle quantity input change
   */
  onQuantityChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    const max = this.currentStockQuantity();
    const quantity = Math.max(1, Math.min(max, value || 1));
    this._quantity.set(quantity);
  }

  /**
   * Get formatted current price
   */
  getCurrentPriceFormatted(): string {
    return this.currentPrice().toFixed(2);
  }

  /**
   * Get formatted original price
   */
  getOriginalPriceFormatted(): string {
    const product = this._product();
    return product?.originalPrice ? product.originalPrice.toFixed(2) : '0.00';
  }

  /**
   * Add product to cart
   */
  addToCart(): void {
    const product = this._product();
    if (!product || !this.canAddToCart()) return;

    this._isAddingToCart.set(true);

    // Convert selected variants to cart format
    const selectedVariants = Array.from(this._selectedVariants().entries()).map(
      ([variantId, option]) => ({
        variantId,
        variantName: product.variants?.find((v) => v.id === variantId)?.name || '',
        optionId: option.id,
        optionValue: option.value,
      }),
    );

    this.cartService.addToCart(product, this._quantity(), selectedVariants).subscribe({
      next: () => {
        this._isAddingToCart.set(false);
        // Optionally show success message or navigate to cart
        // this.router.navigate(['/cart']);
      },
      error: () => {
        this._isAddingToCart.set(false);
        // Handle error (show message, rollback, etc.)
      },
    });
  }

  /**
   * Go back preserving the previous PLP URL (query params, scroll position, etc.).
   * If user landed directly on PDP (no history), fallback to Products list.
   */
  goBack(): void {
    if (isPlatformBrowser(this.platformId) && window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/products']);
  }
}
