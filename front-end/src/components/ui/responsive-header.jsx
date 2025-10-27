import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

const ResponsiveHeader = ({
  title,
  subtitle,
  actions = [],
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6 lg:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Titre et sous-titre */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-200 text-sm sm:text-base truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || 'default'}
                size={action.size || 'default'}
                className={`${action.className || 'bg-white/20 hover:bg-white/30 text-white border-white/30'} text-sm sm:text-base`}
                disabled={action.disabled}
              >
                {action.icon && <action.icon className="w-4 h-4 mr-1 sm:mr-2" />}
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">{action.shortLabel || action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResponsiveHeader;
