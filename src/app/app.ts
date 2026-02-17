import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { filter } from 'rxjs';
import { AuthLayoutComponent } from './layouts/auth/auth-layout/auth-layout.component';
import { FeaturesLayoutComponent } from './layouts/features/features-layout/features-layout.component';
import { isAuthRoute, RoutesEnum } from './core/consts/routes.enum';

@Component({
  selector: 'app-root',
  imports: [LoadingSpinnerComponent, AuthLayoutComponent, FeaturesLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  router = inject(Router);
  isAuthPages = signal(false);

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const currentUrl = this.router.url.split('/')[1];
      this.isAuthPages.set(isAuthRoute(currentUrl as RoutesEnum));
    });
  }
}
