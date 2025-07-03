import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ 
  variant = 'default', 
  size = 'md', 
  children, 
  className = '',
  pulse = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-error-100 text-error-800',
    active: 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg',
    paused: 'bg-gradient-to-r from-warning-400 to-warning-500 text-white shadow-lg',
    draft: 'bg-gray-200 text-gray-700',
    sent: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const pulseAnimation = pulse ? {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } : {};

  return (
    <motion.span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...pulseAnimation}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;