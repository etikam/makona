import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-400 ${sizeClasses[size]} ${className}`}></div>
  );
};

const LoadingCard = ({ className = '' }) => (
  <div className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const LoadingGrid = ({ count = 6, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <LoadingCard key={index} />
    ))}
  </div>
);

const LoadingTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden ${className}`}>
    <div className="p-4 border-b border-gray-700/50">
      <div className="animate-pulse">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-700 rounded flex-1"></div>
          ))}
        </div>
      </div>
    </div>
    <div className="divide-y divide-gray-700/50">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="animate-pulse">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-700 rounded flex-1"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LoadingStats = ({ count = 4, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6"
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const LoadingPage = ({ message = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <LoadingSpinner size="lg" />
    <p className="text-gray-400">{message}</p>
  </div>
);

const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${height} ${width} ${className}`}></div>
);

export {
  LoadingSpinner,
  LoadingCard,
  LoadingGrid,
  LoadingTable,
  LoadingStats,
  LoadingPage,
  Skeleton
};
export default LoadingSpinner;
