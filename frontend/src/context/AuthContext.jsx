import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  const checkToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthState({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      setAuthState({ isAuthenticated: true, user, isLoading: false });
    } catch (err) {
      localStorage.removeItem("token");
      setAuthState({ isAuthenticated: false, user: null, isLoading: false });
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const login = async (email, password) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { token, user } = await authService.login(email, password);
      localStorage.setItem("token", token);
      setAuthState({ isAuthenticated: true, user, isLoading: false });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { token, user } = await authService.signup(name, email, password);
      localStorage.setItem("token", token);
      setAuthState({ isAuthenticated: true, user, isLoading: false });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setAuthState(prev => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ isAuthenticated: false, user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      signup, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
