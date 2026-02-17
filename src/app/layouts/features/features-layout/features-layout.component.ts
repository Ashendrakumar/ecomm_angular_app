import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-features-layout',
  imports: [Navbar, RouterModule],
  template: `
    <app-navbar />
    <main class="container-fluid">
      <router-outlet />
    </main>
  `,
  styles: ``,
})
export class FeaturesLayoutComponent {}
