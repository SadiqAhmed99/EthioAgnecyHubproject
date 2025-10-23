import { useState, useEffect, useCallback } from 'react';
import { useLoaderData, useActionData, useNavigation, useFetcher } from '@remix-run/react';

export interface UseAuthReturn {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export function useAuth(): UseAuthReturn {
  const loaderData = useLoaderData<{ user?: any }>();
  const [isLoading, setIsLoading] = useState(false);
  const fetcher = useFetcher();

  const user = loaderData?.user;
  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      fetcher.submit(
        { email, password },
        { method: 'post', action: '/login' }
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      fetcher.submit({}, { method: 'post', action: '/logout' });
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  };
}
