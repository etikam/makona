import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './button';

const ResponsiveSidebar = ({
  isOpen,
  onClose,
  title,
  children,
  className = ""
}) => {
  return (
    <>
      {/* Overlay pour mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 z-50 lg:relative lg:translate-x-0 lg:z-auto ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-700/50">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ResponsiveSidebar;
