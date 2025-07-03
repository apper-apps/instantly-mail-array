import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  gradient = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden';
  
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-gray-50' : '';
  
  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-xl hover:scale-[1.02]' : '';

  return (
    <motion.div
      className={`${baseClasses} ${gradientClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;