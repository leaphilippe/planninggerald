import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const ADMIN_PASSWORD = 'Boubet61.';
const AUTH_KEY = 'auth_is_admin';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const restoreAuth = async () => {
      try {
        const value = await AsyncStorage.getItem(AUTH_KEY);

        if (!isMounted) return;

        setIsAdmin(value === 'true');
      } catch {
        if (!isMounted) return;
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    if (password !== ADMIN_PASSWORD) {
      return false;
    }

    try {
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      setIsAdmin(true);
      return true;
    } catch {
      setIsAdmin(false);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
    } finally {
      setIsAdmin(false);
    }
  }, []);

  return {
    isAdmin,
    isLoading,
    login,
    logout,
  };
});
