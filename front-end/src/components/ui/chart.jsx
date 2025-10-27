import React from 'react';
import { motion } from 'framer-motion';

const Chart = ({ 
  title,
  subtitle,
  data = [],
  type = 'bar',
  height = 300,
  className = "" 
}) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChart data={data} height={height} />;
      case 'line':
        return <LineChart data={data} height={height} />;
      case 'pie':
        return <PieChart data={data} height={height} />;
      case 'area':
        return <AreaChart data={data} height={height} />;
      default:
        return <BarChart data={data} height={height} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative" style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </motion.div>
  );
};

const BarChart = ({ data, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-full gap-2">
      {data.map((item, index) => (
        <motion.div
          key={item.label || index}
          initial={{ height: 0 }}
          animate={{ height: `${(item.value / maxValue) * 100}%` }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg flex-1 min-h-[20px] relative group"
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {item.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const LineChart = ({ data, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          points={points}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const PieChart = ({ data, height }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="relative h-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
          
          cumulativePercentage += percentage;
          
          const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
          const color = colors[index % colors.length];
          
          return (
            <path
              key={item.label || index}
              d={`M 50,50 L ${50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180)},${50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180)} A 40,40 0 ${percentage > 50 ? 1 : 0},1 ${50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180)},${50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180)} Z`}
              fill={color}
            />
          );
        })}
      </svg>
    </div>
  );
};

const AreaChart = ({ data, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill="url(#areaGradient)"
        />
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={points}
        />
      </svg>
    </div>
  );
};

export default Chart;
