import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as AUTH_ACTIONS from './auth.action';
import { AuthModel } from '../../models/auth.model';

@Injectable()
export class AuthEffects {
  private authService: AuthService = inject(AuthService);
  private actions$: Actions = inject(Actions);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AUTH_ACTIONS.login),
      switchMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((user) => AUTH_ACTIONS.authSuccess({ user: user as AuthModel })),
          catchError((error: Error) => of(AUTH_ACTIONS.authFailure({ error: error.message }))),
        ),
      ),
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AUTH_ACTIONS.register),
      switchMap((action) =>
        this.authService.register(action.userName, action.email, action.password).pipe(
          map(
            (user) => AUTH_ACTIONS.authSuccess({ user: user as AuthModel }),
            catchError((err: Error) => of(AUTH_ACTIONS.authFailure({ error: err.message }))),
          ),
        ),
      ),
    );
  });
}
