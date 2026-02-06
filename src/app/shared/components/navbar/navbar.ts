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
import { ThemeService } from '../../../core/services/theme.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarUserItem } from '../navbar-user-item/navbar-user-item';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink, CommonModule, NavbarUserItem, FormsModule],
  host: { class: 'sticky-top' },
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Navbar {
  readonly productHeaderImage = 'assets/images/product_header.png';
  private readonly cartService = inject(CartService);
  protected readonly themeService = inject(ThemeService);

  // Computed signal for cart item count
  protected readonly cartItemCount = computed(() => {
    return this.cartService.cartItemCount();
  });

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.themeService.setAccentColor(color);
  }
}
