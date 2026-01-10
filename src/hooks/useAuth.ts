'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      login: (token, user) => set({ token, user, isLoggedIn: true }),
      logout: () => {
        set({ token: null, user: null, isLoggedIn: false });
        if (typeof window !== 'undefined') {
          const google = (window as any).google;
          if (google?.accounts?.id) {
            google.accounts.id.disableAutoSelect();
          }
        }
      },
    }),
    { name: 'merchant-auth' }
  )
);

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    const unsubFinishHydration = useAuth.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    
    if (useAuth.persist.hasHydrated()) {
      setHydrated(true);
    }
    
    return () => {
      unsubFinishHydration();
    };
  }, []);
  
  return hydrated;
}

export function sanitizeRedirectUrl(url: string | null): string {
  const defaultPath = '/merchant/subscription';
  
  if (!url) return defaultPath;
  
  try {
    if (url.startsWith('/') && !url.startsWith('//')) {
      const decoded = decodeURIComponent(url);
      if (decoded.includes('://') || decoded.startsWith('//')) {
        return defaultPath;
      }
      return url;
    }
    return defaultPath;
  } catch {
    return defaultPath;
  }
}
