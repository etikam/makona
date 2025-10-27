import React from 'react';
import { motion } from 'framer-motion';

const ResponsiveGrid = ({
  children,
  minItemWidth = 300,
  gap = 4,
  className = ""
}) => {
  return (
    <div 
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="w-full"
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

const ResponsiveCardGrid = ({
  children,
  className = ""
}) => {
  return (
    <ResponsiveGrid
      minItemWidth={280}
      gap={4}
      className={`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {children}
    </ResponsiveGrid>
  );
};

const ResponsiveStatsGrid = ({
  children,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="w-full"
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

const ResponsiveChartGrid = ({
  children,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 ${className}`}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="w-full"
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export { 
  ResponsiveGrid, 
  ResponsiveCardGrid, 
  ResponsiveStatsGrid, 
  ResponsiveChartGrid 
};
export default ResponsiveGrid;
