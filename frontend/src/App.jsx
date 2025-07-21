import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import { useDarkMode } from './hooks/useDarkMode';

import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import UserProfile from './components/UserProfile';

function AppContent() {
  const { isAuthenticated, user, isLoading, login, signup } = useAuth();
  const [isDark, setIsDark] = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user && location.pathname === '/') {
      // Redirect to layout only after login and if on root path
      navigate('/app'); // you can use '/' if Layout is on root
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-xl text-gray-700 dark:text-white animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated && user ? (
        <motion.div
          key="app"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          <Routes>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/app/*" element={<Layout />} />
            <Route path="*" element={<div className="p-10 text-red-600">404 Not Found</div>} />
          </Routes>
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onLogin={login} onSignup={signup} isLoading={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
