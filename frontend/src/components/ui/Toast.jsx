import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: {
      bg: 'glass border-emerald-400/30',
      icon: 'text-emerald-400',
      accent: 'bg-emerald-400/20',
      shadow: 'shadow-emerald-500/25'
    },
    error: {
      bg: 'glass border-red-400/30',
      icon: 'text-red-400',
      accent: 'bg-red-400/20',
      shadow: 'shadow-red-500/25'
    },
    warning: {
      bg: 'glass border-yellow-400/30',
      icon: 'text-yellow-400',
      accent: 'bg-yellow-400/20',
      shadow: 'shadow-yellow-500/25'
    },
    info: {
      bg: 'glass border-blue-400/30',
      icon: 'text-blue-400',
      accent: 'bg-blue-400/20',
      shadow: 'shadow-blue-500/25'
    },
  };

  const Icon = icons[toast.type];
  const style = styles[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        ${style.bg} ${style.shadow} backdrop-blur-xl
        text-white p-5 rounded-2xl shadow-2xl
        flex items-center gap-4 min-w-80 max-w-md
        border-2 hover:shadow-glow-lg
        relative overflow-hidden group
      `}
    >
      {/* Animated background accent */}
      <div className={`absolute inset-0 ${style.accent} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
      
      {/* Icon with pulse animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
        className="relative z-10"
      >
        <Icon className={`w-6 h-6 ${style.icon} animate-pulse-glow`} />
      </motion.div>
      
      {/* Content */}
      <div className="flex-1 relative z-10">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-semibold text-white"
        >
          {toast.title}
        </motion.p>
        {toast.message && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/80 mt-1"
          >
            {toast.message}
          </motion.p>
        )}
      </div>
      
      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClose(toast.id)}
        className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 relative z-10"
      >
        <X className="w-4 h-4" />
      </motion.button>
      
      {/* Progress bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${style.icon.replace('text-', 'bg-')} opacity-60`}
      />
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;