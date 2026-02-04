import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { User, AuthState } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service for authentication management
 * In production, this would integrate with a real auth system
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_DELAY = 300;
  private readonly STORAGE_KEY = 'logged-in-user';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = computed(() => isPlatformBrowser(this.platformId));
  // Private signals - Initialize from localStorage if available
  private readonly _user = signal<User | null>(this.getStoredUser());

  // Public readonly signals
  readonly user = this._user.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this._user() !== null);

  readonly authState = computed<AuthState>(() => ({
    user: this._user(),
    isAuthenticated: this.isAuthenticated(),
  }));

  /**
   * Login user
   */
  login(email: string, password: string): Observable<User> {
    // Simulate API call
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };

    return of(user).pipe(
      delay(this.API_DELAY),
      tap((user) => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.setUser(user);
      }),
      // In production, handle errors
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.setUser(null);
    return of(void 0).pipe(delay(100));
  }

  /**
   * Get stored user from localStorage
   */
  private getStoredUser(): User | null {
    if (!this.isBrowser()) {
      return null;
    }
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  /**
   * Get current user (for testing - simulates logged-in state)
   */
  private setUser(user: User | null): void {
    this._user.set(user);
  }
}
