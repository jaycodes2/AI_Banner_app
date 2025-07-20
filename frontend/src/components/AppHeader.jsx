// src/components/AppHeader.jsx
import React, { memo } from 'react';
import { Moon, Sun, Sparkles, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=6d28d9&color=fff&size=64';

const AppHeader = memo(function AppHeader({ user = {}, onLogout }) {
  const [isDark, setIsDark] = useDarkMode();
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              BannerCraft AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by DALL·E 3</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            tabIndex={0}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" aria-hidden="true" />
            )}
          </motion.button>

          {/* Avatar that navigates to profile */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-xl min-w-0 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <img
              src={user.profileImage || user.avatar || DEFAULT_AVATAR}
              alt={user.name ? `${user.name}'s avatar` : 'User avatar'}
              className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              loading="lazy"
            />
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email || ''}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
            aria-label="Logout"
            tabIndex={0}
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </header>
  );
});

export default AppHeader;
