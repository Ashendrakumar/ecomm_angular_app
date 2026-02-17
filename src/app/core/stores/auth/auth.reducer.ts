import { createReducer, on } from '@ngrx/store';
import * as AUTH_ACTIONS from './auth.action';
import { initialState } from './auth.state';

export const AUTH_REDUCER = createReducer(
  initialState,
  on(AUTH_ACTIONS.ToggleAuthMode, (state, { mode }) => {
    console.log('state', state);
    return { ...state, mode: mode === 'login' ? 'register' : 'login' };
  }),

  on(AUTH_ACTIONS.login, AUTH_ACTIONS.register, (state) => {
    return { ...state, loading: true, error: null };
  }),

  on(AUTH_ACTIONS.authSuccess, (state, { user }) => {
    console.log('222222', user);
    return { ...state, loading: false, error: null, user: user };
  }),

  on(AUTH_ACTIONS.authFailure, (state, { error }) => {
    return { ...state, loading: false, error: error };
  }),
);
