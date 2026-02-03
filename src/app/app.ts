import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly cartService = inject(CartService);
  
  // Computed signal for cart item count
  protected readonly cartItemCount = computed(() => {
    return this.cartService.cartItemCount();
  });
}
