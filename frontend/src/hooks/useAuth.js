import { useState, useCallback, useEffect } from 'react';
import { loginUser, signupUser, getUserFromToken } from './authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true // initially true to avoid flash
  });

  const checkToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthState({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    try {
      const user = await getUserFromToken(token);
      setAuthState({ isAuthenticated: true, user, isLoading: false });
    } catch (err) {
      localStorage.removeItem("token");
      setAuthState({ isAuthenticated: false, user: null, isLoading: false });
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const login = useCallback(async (email, password) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const { token, user } = await loginUser(email, password);
    localStorage.setItem("token", token);
    setAuthState({ isAuthenticated: true, user, isLoading: false });
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const { token, user } = await signupUser(name, email, password);
    localStorage.setItem("token", token);
    setAuthState({ isAuthenticated: true, user, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuthState({ isAuthenticated: false, user: null, isLoading: false });
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout
  };
};
