import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Product, ProductFilters, ProductSortOption } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { NoDataFound } from '../../../shared/components/no-data-found/no-data-found';

@Component({
  selector: 'app-product-listing',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductCard,
    SkeletonLoaderComponent,
    NoDataFound,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-listing.html',
  styleUrl: './product-listing.scss',
})
export class ProductListing implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject = new Subject<string>();
  /** Emits when a load is requested; switchMap cancels in-flight requests on rapid filter/sort changes */
  private readonly loadRequest$ = new Subject<{
    page: number;
    filters: ProductFilters;
    sort: ProductSortOption;
  }>();

  // State signals
  private readonly _products = signal<Product[]>([]);
  private readonly _totalProducts = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _currentPage = signal<number>(1);
  private readonly _hasMore = signal<boolean>(false);
  private readonly _filters = signal<ProductFilters>({});
  private readonly _currentSort = signal<ProductSortOption>('newest');
  private readonly _searchInput = signal<string>('');
  private readonly _showFilters = signal<boolean>(false);

  // Public readonly signals
  readonly products = this._products.asReadonly();
  readonly totalProducts = this._totalProducts.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly currentSort = this._currentSort.asReadonly();
  readonly searchInput = this._searchInput.asReadonly();
  readonly showFilters = this._showFilters.asReadonly();

  // Computed signal for applied filters count
  readonly appliedFiltersCount = computed(() => {
    const currentFilters = this._filters();
    let count = 0;

    if (currentFilters.minPrice !== undefined && currentFilters.minPrice !== null) count++;
    if (currentFilters.maxPrice !== undefined && currentFilters.maxPrice !== null) count++;
    if (currentFilters.brands && currentFilters.brands.length > 0) count++;
    if (currentFilters.inStockOnly) count++;
    if (currentFilters.search && currentFilters.search.trim().length > 0) count++;

    return count;
  });

  // Available brands (loaded from service)
  readonly availableBrands = signal<string[]>([]);

  @ViewChild('scrollTrigger', { static: false }) scrollTrigger?: ElementRef<HTMLElement>;

  // Intersection Observer for infinite scroll
  private observer?: IntersectionObserver;
  private lastObservedTrigger?: HTMLElement;

  ngOnInit(): void {
    // Load brands
    this.productService.getBrands().subscribe((brands) => {
      this.availableBrands.set(brands);
    });

    // Single stream for product loads: cancels previous request when filter/sort/page changes rapidly
    this.loadRequest$
      .pipe(
        switchMap(({ page, filters, sort }) => {
          return this.productService.getProducts(page, 12, filters, sort);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (response) => {
          if (response.page === 1) {
            this._products.set(response.products);
            this.updateUrl();
          } else {
            this._products.update((products) => [...products, ...response.products]);
          }
          this._totalProducts.set(response.total);
          this._hasMore.set(response.hasMore);
          this._isLoading.set(false);
          if (response.hasMore) {
            this.observeScrollTriggerSoon();
          }
        },
        error: () => {
          this._isLoading.set(false);
        },
      });

    // Initialize from URL query params
    this.initializeFromQueryParams();

    // Watch for query param changes (e.g. browser back). Skip when params match our
    // current state so that updateUrl() doesn't cause a reset and scroll jump.
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (this.queryParamsEqualCurrentState(params)) return;
      this.updateFromQueryParams(params);
    });

    // Setup debounced search
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    // Setup infinite scroll after view init
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Initialize component state from URL query params
   */
  private initializeFromQueryParams(): void {
    const params = this.route.snapshot.queryParams;
    this.updateFromQueryParams(params);
  }

  /**
   * Update state from query params and load products
   */
  private updateFromQueryParams(params: Record<string, any>): void {
    const filters: ProductFilters = {};

    if (params['minPrice']) {
      filters.minPrice = Number(params['minPrice']);
    }
    if (params['maxPrice']) {
      filters.maxPrice = Number(params['maxPrice']);
    }
    if (params['brands']) {
      filters.brands = Array.isArray(params['brands']) ? params['brands'] : [params['brands']];
    }
    if (params['inStockOnly'] === 'true') {
      filters.inStockOnly = true;
    }
    if (params['search']) {
      filters.search = params['search'];
      this._searchInput.set(params['search']);
    }

    const sort = (params['sort'] as ProductSortOption) || 'newest';
    const isFilterActive = params['isFilterActive'] === 'true';

    this._filters.set(filters);
    this._currentSort.set(sort);
    this._showFilters.set(isFilterActive);
    this._currentPage.set(1);
    this._products.set([]);

    this.loadProducts();
  }

  /**
   * Setup debounced search
   */
  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) => {
          const filters = { ...this._filters(), search: search || undefined };
          this._filters.set(filters);
          this._currentPage.set(1);
          this._products.set([]);
          return this.productService.getProducts(1, 12, filters, this._currentSort());
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((response) => {
        this._products.set(response.products);
        this._totalProducts.set(response.total);
        this._hasMore.set(response.hasMore);
        this._isLoading.set(false);
        this.updateUrl();
      });
  }

  /**
   * Setup infinite scroll using IntersectionObserver
   */
  private setupInfiniteScroll(): void {
    if (!this.isBrowser) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && this._hasMore() && !this._isLoading()) {
          this.loadMore();
        }
      },
      {
        threshold: 0,
        // 🔥 Trigger only after 50% of viewport height is crossed
        rootMargin: '-50% 0px 0px 0px',
      },
    );

    this.observeScrollTrigger();
  }

  /**
   * Observe (or re-observe) the infinite scroll trigger.
   * Needed because the trigger element is conditionally rendered (`@if (hasMore())`),
   * so it may not exist yet during the first ngAfterViewInit, and it changes as we append items.
   */
  private observeScrollTriggerSoon(): void {
    if (!this.isBrowser) return;
    setTimeout(() => this.observeScrollTrigger(), 0);
  }

  private observeScrollTrigger(): void {
    if (!this.observer) return;
    const el = this.scrollTrigger?.nativeElement;
    if (!el) return;

    // If the trigger node changed (re-render), update the observer
    if (this.lastObservedTrigger && this.lastObservedTrigger !== el) {
      try {
        this.observer.unobserve(this.lastObservedTrigger);
      } catch {
        /* no-op */
      }
    }

    this.lastObservedTrigger = el;
    this.observer.observe(el);
  }

  /**
   * Load products with current filters and sort.
   * Uses loadRequest$ + switchMap so rapid filter/sort changes cancel in-flight API calls.
   */
  private loadProducts(): void {
    this._isLoading.set(true);
    this.loadRequest$.next({
      page: this._currentPage(),
      filters: this._filters(),
      sort: this._currentSort(),
    });
  }

  /**
   * Load more products (pagination)
   */
  private loadMore(): void {
    if (this._isLoading() || !this._hasMore()) {
      return;
    }

    this._currentPage.update((page) => page + 1);
    this.loadProducts();
  }

  /**
   * Build query params from current state (same shape as updateUrl).
   */
  private getCurrentQueryParams(): Record<string, string | number | string[] | undefined> {
    const f = this._filters();
    const params: Record<string, string | number | string[] | undefined> = {};
    if (f.minPrice != null) params['minPrice'] = f.minPrice;
    if (f.maxPrice != null) params['maxPrice'] = f.maxPrice;
    if (f.brands?.length) params['brands'] = f.brands;
    if (f.inStockOnly) params['inStockOnly'] = 'true';
    if (f.search) params['search'] = f.search;
    if (this._currentSort() !== 'newest') params['sort'] = this._currentSort();
    params['isFilterActive'] = this._showFilters() ? 'true' : 'false';
    return params;
  }

  private static paramEqual(a: unknown, b: unknown): boolean {
    if (Array.isArray(a) && !Array.isArray(b)) return a.length === 1 && a[0] === b;
    if (!Array.isArray(a) && Array.isArray(b)) return b.length === 1 && b[0] === a;
    if (Array.isArray(a) && Array.isArray(b))
      return a.length === b.length && a.every((v, i) => v === b[i]);
    const sa = a === undefined || a === null ? '' : String(a);
    const sb = b === undefined || b === null ? '' : String(b);
    return sa === sb;
  }

  /**
   * Return true if the given route params match current state (so we can skip
   * updateFromQueryParams and avoid resetting list / scroll when we caused the navigation).
   */
  private queryParamsEqualCurrentState(params: Record<string, any>): boolean {
    const current = this.getCurrentQueryParams();
    const keys = new Set([...Object.keys(current), ...Object.keys(params)]);
    for (const k of keys) {
      if (!ProductListing.paramEqual(current[k], params[k])) return false;
    }
    return true;
  }

  /**
   * Update URL query params to reflect current state
   */
  private updateUrl(): void {
    const queryParams = this.getCurrentQueryParams();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true, // Don't create new history entry
    });
  }

  // Event handlers
  onPriceMinChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const minPrice = value ? Number(value) : undefined;
    this._filters.update((f) => ({ ...f, minPrice }));
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  onPriceMaxChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const maxPrice = value ? Number(value) : undefined;
    this._filters.update((f) => ({ ...f, maxPrice }));
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  onBrandToggle(brand: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentBrands = this._filters().brands || [];
    const brands = checked ? [...currentBrands, brand] : currentBrands.filter((b) => b !== brand);

    this._filters.update((f) => ({ ...f, brands: brands.length > 0 ? brands : undefined }));
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  onInStockToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._filters.update((f) => ({ ...f, inStockOnly: checked || undefined }));
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._searchInput.set(value);
    this._isLoading.set(true);
    this.searchSubject.next(value);
  }

  onSortChange(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value as ProductSortOption;
    this._currentSort.set(sort);
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  clearFilters(): void {
    if (this.appliedFiltersCount() === 0) return; // No-op if no filters applied
    this._filters.set({});
    this._currentSort.set('newest');
    this._searchInput.set('');
    this._currentPage.set(1);
    this._products.set([]);
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    this.loadProducts();
  }

  /**
   * Toggle filters panel visibility and sync isFilterActive to URL
   */
  toggleFilters(): void {
    this._showFilters.update((value) => !value);
    this.updateUrl();
  }
}
