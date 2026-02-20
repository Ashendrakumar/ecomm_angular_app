import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { LoadingSectionService } from '../services/loading-section.service';

/**
 * HTTP interceptor to manage global loading state
 * Automatically shows/hides loading indicator for HTTP requests
 */
export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingService = inject(LoadingService);
  const busyService = inject(LoadingSectionService);

  loadingService.start();

  const url = new URL(request.url, window.location.origin);
  const segments = url.pathname.split('/').filter(Boolean);

  const isDynamic = (segment: string) =>
    /^\d+$/.test(segment) ||                     // numeric
    /^[0-9a-fA-F-]{36}$/.test(segment);          // uuid (optional)

  let endPoint = '';

  if (!segments.length) {
    endPoint = 'unknown';
  } else {
    const last = segments.at(-1)!;

    endPoint = isDynamic(last)
      ? segments[0]                 // dynamic → first segment
      : last;                       // static → last segment
  }

  busyService.start(endPoint);

  return next(request).pipe(
    finalize(() => {
      busyService.stop(endPoint);
      loadingService.stop();
    })
  );
};