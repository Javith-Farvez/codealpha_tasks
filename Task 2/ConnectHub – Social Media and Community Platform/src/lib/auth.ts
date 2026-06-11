// Authentication utilities for ConnectHub

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'connecthub_token';
  private static readonly USER_KEY = 'connecthub_user';

  /**
   * Register new user
   */
  static async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthToken> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<AuthToken> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  }

  /**
   * Logout user
   */
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get current token
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current user
   */
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  /**
   * Set token in storage
   */
  private static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Set user in storage
   */
  private static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Decode JWT token (for display purposes)
   */
  static decodeToken(token: string): any {
    try {
      // Simple base64 decode (note: in production use a proper JWT library)
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    return Date.now() >= decoded.exp * 1000;
  }

  /**
   * Add token to request headers
   */
  static getAuthHeaders(): { Authorization?: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Verify token with server
   */
  static async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/verify', {
        headers: this.getAuthHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
