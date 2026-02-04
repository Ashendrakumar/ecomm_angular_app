import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { NoDataFound } from '../../shared/components/no-data-found/no-data-found';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterModule, NoDataFound, SkeletonLoaderComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  readonly cartService = inject(CartService);
  // State for tracking individual item updates
  private readonly _updatingItems = signal<Set<string>>(new Set());
  private readonly _removingItems = signal<Set<string>>(new Set());

  // Public readonly signals
  readonly cartItems = this.cartService.cartItems;
  readonly updatingItems = this._updatingItems.asReadonly();
  readonly removingItems = this._removingItems.asReadonly();

  /**
   * Check if an item is being updated
   */
  isUpdating(itemId: string): boolean {
    return this._updatingItems().has(itemId);
  }

  /**
   * Check if an item is being removed
   */
  isRemoving(itemId: string): boolean {
    return this._removingItems().has(itemId);
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this._updatingItems.update((items) => new Set(items).add(itemId));

    this.cartService.updateQuantity(itemId, quantity).subscribe({
      next: () => {
        this._updatingItems.update((items) => {
          const newSet = new Set(items);
          newSet.delete(itemId);
          return newSet;
        });
      },
      error: () => {
        // Rollback on error - the service handles optimistic updates
        this._updatingItems.update((items) => {
          const newSet = new Set(items);
          newSet.delete(itemId);
          return newSet;
        });
      },
    });
  }

  /**
   * Handle quantity input (for future direct input support)
   */
  onQuantityInput(itemId: string, event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (value > 0) {
      this.updateQuantity(itemId, value);
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): void {
    this._removingItems.update((items) => new Set(items).add(itemId));

    this.cartService.removeItem(itemId).subscribe({
      next: () => {
        this._removingItems.update((items) => {
          const newSet = new Set(items);
          newSet.delete(itemId);
          return newSet;
        });
      },
      error: () => {
        this._removingItems.update((items) => {
          const newSet = new Set(items);
          newSet.delete(itemId);
          return newSet;
        });
      },
    });
  }

  /**
   * Get formatted item total price
   */
  getItemTotalFormatted(item: CartItem): string {
    return (item.price * item.quantity).toFixed(2);
  }

  /**
   * Get formatted item price
   */
  getItemPriceFormatted(item: CartItem): string {
    return item.price.toFixed(2);
  }

  /**
   * Get formatted cart total
   */
  getCartTotalFormatted(): string {
    return this.cartService.cartTotal().toFixed(2);
  }

  /**
   * Dismiss the last error message
   */
  dismissError(): void {
    this.cartService.dismissError();
  }

  /**
   * Proceed to checkout
   */
  checkout(): void {
    // In production, navigate to checkout page
    alert('Checkout functionality would be implemented here');
  }
}
