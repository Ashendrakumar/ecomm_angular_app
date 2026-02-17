import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToggleAuthMode } from '../../core/stores/auth/auth.action';
import { AuthMode } from '../../core/stores/auth/auth.state';

@Component({
  selector: 'app-auth-container',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss',
})
export class AuthContainerComponent {
  store = inject(Store);
  toggleMode(mode: AuthMode, event: Event): void {
    event.preventDefault();
    this.store.dispatch(ToggleAuthMode({ mode }));
  }
}
