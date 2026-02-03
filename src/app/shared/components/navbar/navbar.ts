import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink],
  host: { class: 'sticky-top' },
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly cartService = inject(CartService);

  // Computed signal for cart item count
  protected readonly cartItemCount = computed(() => {
    return this.cartService.cartItemCount();
  });
}
