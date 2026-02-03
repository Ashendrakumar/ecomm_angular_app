import { Injectable, signal } from '@angular/core';

/**
 * Service to manage global loading state
 * Used by the loading interceptor to show/hide loaders
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _isLoading = signal<boolean>(false);
  private readonly _loadingCount = signal<number>(0);

  /**
   * Signal indicating if any HTTP request is in progress
   */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Start loading - increments the loading counter
   */
  start(): void {
    this._loadingCount.update(count => count + 1);
    this._isLoading.set(true);
  }

  /**
   * Stop loading - decrements the loading counter
   * Only sets isLoading to false when counter reaches 0
   */
  stop(): void {
    this._loadingCount.update(count => {
      const newCount = Math.max(0, count - 1);
      if (newCount === 0) {
        this._isLoading.set(false);
      }
      return newCount;
    });
  }

  /**
   * Reset loading state (useful for error scenarios)
   */
  reset(): void {
    this._loadingCount.set(0);
    this._isLoading.set(false);
  }
}
