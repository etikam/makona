import React from 'react';
import { motion } from 'framer-motion';

const StatsGrid = ({ stats = [], className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.key || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs lg:text-sm truncate">{stat.label}</p>
              <p className="text-xl lg:text-2xl font-bold text-white truncate">{stat.value}</p>
              {stat.change !== undefined && (
                <p className={`text-xs mt-1 ${
                  stat.change > 0 ? 'text-green-400' : 
                  stat.change < 0 ? 'text-red-400' : 
                  'text-gray-400'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </p>
              )}
            </div>
            <div className="flex-shrink-0 ml-2">
              {stat.icon && (
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${
                  stat.iconBg || 'bg-blue-500/20'
                }`}>
                  <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                    stat.iconColor || 'text-blue-400'
                  }`} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
