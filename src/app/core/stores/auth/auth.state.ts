import { AuthModel } from '../../models/auth.model';

export type AuthMode = 'login' | 'register';

export interface AuthState {
  mode: AuthMode;
  loading: boolean;
  error: string | null;
  user: AuthModel | null;
}

export const initialState: AuthState = {
  mode: 'login' as AuthMode,
  user: null,
  loading: false,
  error: null,
};
