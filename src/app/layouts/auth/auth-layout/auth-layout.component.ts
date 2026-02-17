import { Component } from '@angular/core';
import { AuthContainerComponent } from '../../../auth/auth-container/auth-container.component';

@Component({
  selector: 'app-auth-layout',
  imports: [AuthContainerComponent],
  template: `
    <main>
      <app-auth-container />
    </main>
  `,
  styles: ``,
})
export class AuthLayoutComponent {}
