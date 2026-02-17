import { createAction, createActionGroup, props } from '@ngrx/store';
import { AuthModel } from '../../models/auth.model';
import { User } from '../../models/user.model';
import { AuthMode } from './auth.state';

export const ToggleAuthMode = createAction('[Auth] Toggle Mode', props<{ mode: AuthMode }>());

export const login = createAction('[Auth] Login', props<AuthModel>());
export const register = createAction('[Auth] Register', props<AuthModel>());

export const authSuccess = createAction('[Auth] Success', props<{ user: AuthModel }>());
export const authFailure = createAction('[Auth] Failure', props<{ error: string }>());
