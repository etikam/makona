import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

const ResponsiveCard = ({
  children,
  className = "",
  hover = true,
  onClick,
  ...props
}) => {
  const baseClasses = "bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 transition-all duration-300";
  const hoverClasses = hover ? "hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const CardComponent = onClick ? motion.div : motion.div;
  const cardProps = onClick ? { onClick, ...props } : props;

  return (
    <CardComponent
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...cardProps}
    >
      {children}
    </CardComponent>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`flex items-start justify-between mb-3 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50 ${className}`}>
    {children}
  </div>
);

export const CardIcon = ({ icon: Icon, className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 ${className}`}>
      <Icon className={`w-4 h-4 lg:w-5 lg:h-5 text-blue-400`} />
    </div>
  );
};

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`font-semibold text-white text-sm lg:text-base truncate ${className}`}>
    {children}
  </h3>
);

export const CardSubtitle = ({ children, className = "" }) => (
  <p className={`text-xs text-gray-400 ${className}`}>
    {children}
  </p>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-gray-300 text-xs line-clamp-2 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const CardActions = ({ children, className = "" }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {children}
  </div>
);

export const ActionButton = ({ icon: Icon, onClick, variant = "ghost", className = "", ...props }) => (
  <Button
    onClick={onClick}
    size="icon"
    variant={variant}
    className={`h-8 w-8 ${className}`}
    {...props}
  >
    <Icon className="w-3.5 h-3.5" />
  </Button>
);

export default ResponsiveCard;
