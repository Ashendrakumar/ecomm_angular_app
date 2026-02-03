import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  getPriceFormatted(): string {
    return this.product.price.toFixed(2);
  }

  getOriginalPriceFormatted(): string {
    return this.product.originalPrice ? this.product.originalPrice.toFixed(2) : '';
  }
}
