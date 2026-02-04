import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-user-item',
  imports: [CommonModule],
  templateUrl: './navbar-user-item.html',
  styleUrl: './navbar-user-item.scss',
})
export class NavbarUserItem {
  private readonly authService = inject(AuthService);
  // Computed signals for authentication
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly user = this.authService.user;

  // Computed signal for display name
  protected readonly displayName = computed(() => {
    const currentUser = this.user();
    return currentUser ? currentUser.name : 'Guest';
  });
  // Dropdown state
  protected readonly isDropdownOpen = signal(false);

  /**
   * Toggle dropdown visibility
   */
  protected toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen.update((value) => !value);
  }

  /**
   * Close dropdown when clicking outside
   */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    this.isDropdownOpen.set(false);
  }

  /**
   * Handle logout action
   */
  protected onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe();
    this.isDropdownOpen.set(false);
  }

  /**
   * Handle login action (placeholder - will navigate to login page when route exists)
   */
  protected onLogin(event: Event): void {
    console.log('Login clicked - route not yet implemented');
    this.authService.login('ashendrapal@gmail.com', 'password').subscribe({
      next: (user) => {
        this.isDropdownOpen.set(false);
      },
      error: (error) => console.error(error),
    });
  }

  /**
   * Handle register action (placeholder - will navigate to register page when route exists)
   */
  protected onRegister(event: Event): void {
    event.preventDefault();
    // TODO: Navigate to register page when route is created
    console.log('Register clicked - route not yet implemented');
    this.isDropdownOpen.set(false);
  }
}
