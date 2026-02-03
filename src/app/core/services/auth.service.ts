import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User, AuthState } from '../models/user.model';

/**
 * Service for authentication management
 * In production, this would integrate with a real auth system
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user = signal<User | null>(null);
  private readonly API_DELAY = 300;

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
      // In production, handle errors
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    this._user.set(null);
    return of(void 0).pipe(delay(100));
  }

  /**
   * Get current user (for testing - simulates logged-in state)
   */
  setUser(user: User | null): void {
    this._user.set(user);
  }
}
