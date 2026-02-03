/**
 * User model for authentication
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Auth state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
