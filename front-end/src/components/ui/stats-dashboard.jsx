import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import StatsGrid from './stats-grid';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-500/20',
  className = "" 
}) => {
  const getChangeIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="w-3 h-3" />;
    if (changeType === 'negative') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-400';
    if (changeType === 'negative') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-gray-400 text-xs lg:text-sm truncate">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-white truncate">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-1 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-xs">
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${iconBg} flex-shrink-0 ml-2`}>
            <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${iconColor}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StatsDashboard = ({ 
  stats = [], 
  title = "Statistiques",
  subtitle,
  className = "" 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div>
          {title && <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
      )}

      {/* Stats Grid */}
      <StatsGrid stats={stats} />
    </div>
  );
};

const QuickStats = ({ 
  items = [], 
  className = "" 
}) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {items.map((item, index) => (
        <StatCard
          key={item.key || index}
          {...item}
        />
      ))}
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-500/20',
  trend,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-300">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend.direction === 'up' ? 'bg-green-500/20 text-green-400' :
                trend.direction === 'down' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {trend.value}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg} flex-shrink-0 ml-4`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { 
  StatsDashboard, 
  StatCard, 
  QuickStats, 
  MetricCard 
};
