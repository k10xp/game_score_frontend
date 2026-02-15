import { ref, computed } from 'vue';

// Types
export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// State
const token = ref<string | null>(localStorage.getItem('auth_token'));
const user = ref<User | null>(
  JSON.parse(localStorage.getItem('auth_user') || 'null')
);

// Computed
export const authenticated = computed(() => !!token.value);
export const currentUser = computed(() => user.value);

// API endpoint
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// Functions
export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Login failed' }));
      return { success: false, error: error.message || 'Invalid credentials' };
    }

    const data: AuthResponse = await response.json();

    // Store token and user
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function register(
  firstName: string,
  lastName: string,
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, username, password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Registration failed' }));
      return { success: false, error: error.message || 'Registration failed' };
    }

    const data: AuthResponse = await response.json();

    // Store token and user
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export function logout() {
  token.value = null;
  user.value = null;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getAuthToken(): string | null {
  return token.value;
}

// Initialize auth state on app load
export function initAuth() {
  const storedToken = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');

  if (storedToken && storedUser) {
    token.value = storedToken;
    user.value = JSON.parse(storedUser);
  }
}
