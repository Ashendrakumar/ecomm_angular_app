import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * HTTP interceptor to manage global loading state
 * Automatically shows/hides loading indicator for HTTP requests
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Start loading
  loadingService.start();

  // Stop loading when request completes (success or error)
  return next(req).pipe(
    finalize(() => {
      loadingService.stop();
    })
  );
};
