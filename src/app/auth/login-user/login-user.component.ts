import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../core/stores/auth/auth.action';
import { Observable, Subscription } from 'rxjs';
import { AuthModel } from '../../core/models/auth.model';
import { selectAuthMode, selectUser } from '../../core/stores/auth/auth.selector';

@Component({
  selector: 'app-login-user',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss',
})
export class LoginUserComponent implements OnDestroy {
  private fb: FormBuilder = inject(FormBuilder);
  private store: Store = inject(Store);
  private subscriptions: Subscription[] = [];
  logInForm!: FormGroup;
  authMode$ = this.store.select(selectAuthMode);
  user$: Observable<AuthModel | null> = this.store.select(selectUser);

  constructor() {
    this.initializeForm();
  }

  private initializeForm() {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.subscriptions.push(
      this.user$.subscribe({
        next: (user) => {
          if (!user) return;
          this.logInForm.patchValue({ email: user?.email });
        },
      }),
    );
  }

  onSubmit() {
    this.store.dispatch(login(this.logInForm.value));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
