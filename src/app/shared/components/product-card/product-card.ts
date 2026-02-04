import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  private readonly cartService = inject(CartService);

  readonly isAdding = signal(false);

  getPriceFormatted(): string {
    return this.product.price.toFixed(2);
  }

  getOriginalPriceFormatted(): string {
    return this.product.originalPrice ? this.product.originalPrice.toFixed(2) : '';
  }

  get discountPercentage(): number {
    if (!this.product.originalPrice || this.product.originalPrice <= this.product.price) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.isAdding() || !this.product.inStock) return;

    this.isAdding.set(true);
    this.cartService.addToCart(this.product).subscribe({
      next: () => this.isAdding.set(false),
      error: () => this.isAdding.set(false)
    });
  }
}
