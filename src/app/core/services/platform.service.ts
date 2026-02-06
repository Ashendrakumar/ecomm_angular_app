import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = computed(() => isPlatformBrowser(this.platformId));
  readonly isServer = computed(() => !this.isBrowser());
}
