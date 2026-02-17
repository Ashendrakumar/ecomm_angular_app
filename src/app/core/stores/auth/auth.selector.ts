import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, (state) => state.user);
export const selectAuthMode = createSelector(selectAuthState, (state) => state.mode);
export const isAuthorizing = createSelector(selectAuthState, (state) => state.loading);
