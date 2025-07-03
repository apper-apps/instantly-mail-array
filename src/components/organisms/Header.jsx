import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onMenuClick, title = 'Dashboard' }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <ApperIcon name="Bell" className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
          </button>

          {/* Help */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ApperIcon name="HelpCircle" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Account selector */}
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
            <div className="w-6 h-6 bg-gradient-to-br from-success-400 to-success-500 rounded-full flex items-center justify-center mr-2">
              <ApperIcon name="Check" className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Account: Active</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;