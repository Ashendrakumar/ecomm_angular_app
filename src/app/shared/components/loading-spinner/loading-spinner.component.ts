import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

/**
 * Global loading spinner component
 * Displays when any HTTP request is in progress
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <div class="spinner-border text-gold" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  readonly loadingService = inject(LoadingService);
}
