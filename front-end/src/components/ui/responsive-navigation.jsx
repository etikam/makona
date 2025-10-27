import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

const NavigationItem = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick, 
  badge,
  className = "" 
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
    } ${className}`}
  >
    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
    <span className="font-medium truncate">{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </motion.button>
);

const NavigationGroup = ({ 
  title, 
  children, 
  className = "" 
}) => (
  <div className={`space-y-1 ${className}`}>
    {title && (
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
        {title}
      </h3>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const ResponsiveNavigation = ({ 
  items = [], 
  groups = [],
  className = "" 
}) => {
  return (
    <nav className={`space-y-6 ${className}`}>
      {/* Items simples */}
      {items.length > 0 && (
        <NavigationGroup>
          {items.map((item, index) => (
            <NavigationItem
              key={item.key || index}
              {...item}
            />
          ))}
        </NavigationGroup>
      )}

      {/* Groupes d'items */}
      {groups.map((group, groupIndex) => (
        <NavigationGroup
          key={group.key || groupIndex}
          title={group.title}
        >
          {group.items.map((item, itemIndex) => (
            <NavigationItem
              key={item.key || itemIndex}
              {...item}
            />
          ))}
        </NavigationGroup>
      ))}
    </nav>
  );
};

export { ResponsiveNavigation, NavigationItem, NavigationGroup };
export default ResponsiveNavigation;
