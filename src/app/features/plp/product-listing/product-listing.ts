import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from 'express';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Product, ProductFilters, ProductSortOption } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductCard } from "../../../shared/components/product-card/product-card";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-listing',
  imports: [CommonModule, FormsModule, RouterModule, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-listing.html',
  styleUrl: './product-listing.scss',
})
export class ProductListing implements OnInit, AfterViewInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject = new Subject<string>();

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
    this.productService.getBrands().subscribe(brands => {
      this.availableBrands.set(brands);
    });

    // Initialize from URL query params
    this.initializeFromQueryParams();

    // Watch for query param changes
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
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

    this._filters.set(filters);
    this._currentSort.set(sort);
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
        switchMap(search => {
          const filters = { ...this._filters(), search: search || undefined };
          this._filters.set(filters);
          this._currentPage.set(1);
          this._products.set([]);
          return this.productService.getProducts(1, 12, filters, this._currentSort());
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
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
    if (typeof window === 'undefined') {
      return; // SSR guard
    }

    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && this._hasMore() && !this._isLoading()) {
          this.loadMore();
        }
      },
      {
        threshold: 0.1,
        // start fetching a bit earlier so it feels instant
        rootMargin: '300px 0px 300px 0px'
      }
    );

    this.observeScrollTriggerSoon();
  }

  /**
   * Observe (or re-observe) the infinite scroll trigger.
   * Needed because the trigger element is conditionally rendered (`@if (hasMore())`),
   * so it may not exist yet during the first ngAfterViewInit, and it changes as we append items.
   */
  private observeScrollTriggerSoon(): void {
    if (typeof window === 'undefined') return;
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
      } catch { /* no-op */ }
    }

    this.lastObservedTrigger = el;
    this.observer.observe(el);
  }

  /**
   * Load products with current filters and sort
   */
  private loadProducts(): void {
    this._isLoading.set(true);

    this.productService
      .getProducts(this._currentPage(), 12, this._filters(), this._currentSort())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (this._currentPage() === 1) {
            this._products.set(response.products);
          } else {
            this._products.update(products => [...products, ...response.products]);
          }
          this._totalProducts.set(response.total);
          this._hasMore.set(response.hasMore);
          this._isLoading.set(false);
          this.updateUrl();
          if (response.hasMore) {
            this.observeScrollTriggerSoon();
          }
        },
        error: () => {
          this._isLoading.set(false);
        }
      });
  }

  /**
   * Load more products (pagination)
   */
  private loadMore(): void {
    if (this._isLoading() || !this._hasMore()) {
      return;
    }

    this._currentPage.update(page => page + 1);
    this.loadProducts();
  }

  /**
   * Update URL query params to reflect current state
   */
  private updateUrl(): void {
    const queryParams: Record<string, any> = {};

    if (this._filters().minPrice) {
      queryParams['minPrice'] = this._filters().minPrice;
    }
    if (this._filters().maxPrice) {
      queryParams['maxPrice'] = this._filters().maxPrice;
    }
    if (this._filters().brands && this._filters().brands!.length > 0) {
      queryParams['brands'] = this._filters().brands;
    }
    if (this._filters().inStockOnly) {
      queryParams['inStockOnly'] = 'true';
    }
    if (this._filters().search) {
      queryParams['search'] = this._filters().search;
    }
    if (this._currentSort() !== 'newest') {
      queryParams['sort'] = this._currentSort();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true // Don't create new history entry
    });
  }

  // Event handlers
  onPriceMinChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const minPrice = value ? Number(value) : undefined;
    this._filters.update(f => ({ ...f, minPrice }));
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  onPriceMaxChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const maxPrice = value ? Number(value) : undefined;
    this._filters.update(f => ({ ...f, maxPrice }));
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  onBrandToggle(brand: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentBrands = this._filters().brands || [];
    const brands = checked
      ? [...currentBrands, brand]
      : currentBrands.filter(b => b !== brand);

    this._filters.update(f => ({ ...f, brands: brands.length > 0 ? brands : undefined }));
    this._currentPage.set(1);
    this._products.set([]);
    this.loadProducts();
  }

  onInStockToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._filters.update(f => ({ ...f, inStockOnly: checked || undefined }));
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
    this._filters.set({});
    this._currentSort.set('newest');
    this._searchInput.set('');
    this._currentPage.set(1);
    this._products.set([]);
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  /**
   * Toggle filters panel visibility
   */
  toggleFilters(): void {
    this._showFilters.update(value => !value);
  }
}