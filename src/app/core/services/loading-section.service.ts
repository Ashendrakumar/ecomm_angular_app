import { Injectable, Signal, signal } from '@angular/core';
import { BusyState } from '../models/busy.model';

@Injectable({
  providedIn: 'root',
})
export class LoadingSectionService {
  private loadingEndpoints = new Set<string>();

  private busySignal = signal<BusyState>({
    isLoading: false,
    endpoints: []
  });

  public readonly busy: Signal<BusyState> = this.busySignal.asReadonly();

  start(url: string): void {
    this.loadingEndpoints.add(url);
    console.log('URLS', this.loadingEndpoints);
    this.emit();
  }

  stop(url: string): void {
    this.loadingEndpoints.delete(url);
    this.emit();
  }

  /** Global loading */
  isLoading(): boolean {
    return this.loadingEndpoints.size > 0;
  }

  /** Section loading */
  isEndpointLoading(endpoint: string): boolean {
    return [...this.loadingEndpoints].some(url => url.includes(endpoint));
  }


  private emit(): void {
    this.busySignal.set({
      isLoading: this.isLoading(),
      endpoints: [...this.loadingEndpoints]
    });
  }
}
