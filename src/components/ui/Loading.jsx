import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'default', className = '' }) => {
  const shimmerVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  };

  const pulseVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }
    }
  };

  if (type === 'table') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Table Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Table Rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      variants={shimmerVariants}
                      animate="animate"
                      style={{ animationDelay: `${(i * 6 + j) * 0.1}s` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </div>
                <div className="h-8 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{ animationDelay: `${i * 0.2 + 0.3}s` }}
                  />
                </div>
                <div className="h-3 bg-gray-100 rounded w-2/3 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{ animationDelay: `${i * 0.2 + 0.6}s` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/3 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                </div>
                <div className="h-40 bg-gray-100 rounded-lg relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{ animationDelay: `${i * 0.5 + 0.3}s` }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      variants={shimmerVariants}
                      animate="animate"
                      style={{ animationDelay: `${i * 0.5 + 0.6}s` }}
                    />
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-3/4 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      variants={shimmerVariants}
                      animate="animate"
                      style={{ animationDelay: `${i * 0.5 + 0.9}s` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default loading
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          className="text-gray-600"
          variants={pulseVariants}
          animate="animate"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;