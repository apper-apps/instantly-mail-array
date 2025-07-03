import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatusIndicator = ({ 
  status = 'active', 
  label, 
  showDot = true, 
  className = '',
  ...props 
}) => {
  const statusConfig = {
    active: {
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      dotColor: 'bg-success-500',
      icon: 'CheckCircle'
    },
    paused: {
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
      dotColor: 'bg-warning-500',
      icon: 'Pause'
    },
    draft: {
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      dotColor: 'bg-gray-500',
      icon: 'FileText'
    },
    completed: {
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      dotColor: 'bg-primary-500',
      icon: 'CheckCircle2'
    },
    error: {
      color: 'text-error-600',
      bgColor: 'bg-error-100',
      dotColor: 'bg-error-500',
      icon: 'AlertCircle'
    }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color} ${className}`}
      {...props}
    >
      {showDot && (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-2 h-2 rounded-full mr-2 ${config.dotColor}`}
        />
      )}
      
      <ApperIcon name={config.icon} className="w-4 h-4 mr-1" />
      
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.div>
  );
};

export default StatusIndicator;