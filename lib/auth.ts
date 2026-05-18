import Cookies from 'js-cookie';
import api from '@/lib/api';
import type { AuthResponse, User } from '@/types';

export const authLogin = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
  Cookies.set('token', data.token, { expires: 7, sameSite: 'Lax' });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const authRegister = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
  Cookies.set('token', data.token, { expires: 7, sameSite: 'Lax' });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const authLogout = async (): Promise<void> => {
  await api.post('/api/auth/logout');
  Cookies.remove('token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!Cookies.get('token') || !!localStorage.getItem('token');
};
