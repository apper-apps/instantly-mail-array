import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  gradient = false,
  className = '',
  ...props 
}) => {
  const changeIcon = changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  const changeColor = changeType === 'positive' ? 'text-success-600' : 'text-error-600';
  
  return (
    <Card className={`p-6 ${className}`} hover gradient={gradient} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {value}
          </motion.p>
          {change && (
            <div className={`flex items-center ${changeColor}`}>
              <ApperIcon name={changeIcon} className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;