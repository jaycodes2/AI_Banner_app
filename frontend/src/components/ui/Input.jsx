import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const Input = React.memo(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  onFocus,
  onBlur,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  }, [onFocus]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  }, [onBlur]);

  const inputClasses = useMemo(() => {
    const baseClasses = [
      'w-full p-4 rounded-2xl border-2 transition-all duration-300',
      'glass backdrop-blur-xl',
      'border-white/30 dark:border-gray-600/30',
      'text-gray-900 dark:text-white',
      'placeholder-gray-500/70 dark:placeholder-gray-400/70',
      'focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 focus:outline-none',
      'hover:border-white/50 dark:hover:border-gray-500/50',
      'hover:shadow-glow'
    ];

    if (error) {
      baseClasses.push('border-red-500/50 focus:ring-red-500/20 focus:border-red-500/50');
    }

    if (isFocused) {
      baseClasses.push('shadow-glow-lg');
    } else {
      baseClasses.push('shadow-glass');
    }

    if (className) {
      baseClasses.push(className);
    }

    return baseClasses.join(' ');
  }, [error, isFocused, className]);

  const glowClasses = useMemo(() => {
    const classes = [
      'absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none',
      'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20',
      'blur-sm -z-10'
    ];

    if (isFocused) {
      classes.push('opacity-100');
    } else {
      classes.push('opacity-0');
    }

    return classes.join(' ');
  }, [isFocused]);

  return (
    <div className="space-y-2">
      {label && (
        <motion.label 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative group">
        <motion.input
          type={type}
          onFocus={handleFocus}
          onBlur={handleBlur}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={inputClasses}
          {...props}
        />
        
        <div className={glowClasses} />
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-red-400 font-medium flex items-center gap-1"
        >
          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;