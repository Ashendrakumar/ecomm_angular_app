import {
  Component,
  computed,
  inject,
  signal,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarUserItem } from '../navbar-user-item/navbar-user-item';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink, CommonModule, NavbarUserItem],
  host: { class: 'sticky-top' },
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Navbar {
  private readonly cartService = inject(CartService);

  // Computed signal for cart item count
  protected readonly cartItemCount = computed(() => {
    return this.cartService.cartItemCount();
  });
}
