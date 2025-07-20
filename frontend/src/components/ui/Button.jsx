import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

const Button = React.memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const isDisabled = disabled || loading;

  const handleClick = useCallback((e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  }, [onClick, isDisabled]);

  const buttonClasses = useMemo(() => {
    const baseClasses = [
      'font-semibold rounded-2xl transition-all duration-500',
      'flex items-center justify-center gap-2 relative overflow-hidden group',
      'focus:outline-none focus:ring-4 focus:ring-blue-500/20'
    ];

    const variants = {
      primary: [
        'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600',
        'hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
        'text-white shadow-2xl hover:shadow-rainbow',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent',
        'before:translate-x-[-100%] hover:before:translate-x-[100%]',
        'before:transition-transform before:duration-700',
        'hover:scale-105 active:scale-95'
      ],
      secondary: [
        'glass border border-white/30 backdrop-blur-xl',
        'text-white hover:bg-white/20 hover:border-white/40',
        'shadow-glass hover:shadow-glow',
        'hover:scale-105 active:scale-95'
      ],
      danger: [
        'bg-gradient-to-r from-red-500 to-red-600',
        'hover:from-red-600 hover:to-red-700',
        'text-white shadow-lg hover:shadow-red-500/25',
        'hover:scale-105 active:scale-95'
      ],
      success: [
        'bg-gradient-to-r from-emerald-500 to-green-600',
        'hover:from-emerald-600 hover:to-green-700',
        'text-white shadow-lg hover:shadow-emerald-500/25',
        'hover:scale-105 active:scale-95'
      ],
      glass: [
        'glass-dark border border-white/20 backdrop-blur-2xl',
        'text-white hover:bg-white/10 hover:border-white/30',
        'shadow-glass-dark hover:shadow-glow-lg',
        'hover:scale-105 active:scale-95'
      ],
      gradient: [
        'bg-gradient-rainbow bg-size-200 animate-gradient-shift',
        'text-white shadow-2xl hover:shadow-rainbow',
        'hover:scale-105 active:scale-95'
      ]
    };

    const sizes = {
      xs: 'px-3 py-1.5 text-xs',
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    };

    const allClasses = [
      ...baseClasses,
      ...(variants[variant] || variants.primary),
      sizes[size] || sizes.md
    ];

    if (isDisabled) {
      allClasses.push('opacity-50 cursor-not-allowed grayscale');
    } else {
      allClasses.push('cursor-pointer');
    }

    if (className) {
      allClasses.push(className);
    }

    return allClasses.join(' ');
  }, [variant, size, disabled, loading, className, isDisabled]);

  return (
    <motion.button
      whileHover={!isDisabled ? { y: -2 } : {}}
      whileTap={!isDisabled ? { y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={buttonClasses}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
    >
      {/* Shimmer effect overlay */}
      {!isDisabled && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;