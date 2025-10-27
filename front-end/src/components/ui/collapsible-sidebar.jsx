import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  Users,
  UserCheck,
  Tag,
  BarChart2,
  Settings,
  CheckSquare
} from 'lucide-react';
import { Button } from './button';

const CollapsibleSidebar = ({
  isOpen,
  onToggle,
  children,
  className = ""
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Overlay pour mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? (isMobile ? '280px' : '280px') : (isMobile ? '0px' : '80px'),
          x: isMobile && !isOpen ? '-100%' : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:relative left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 z-50 lg:z-auto overflow-hidden ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Header avec logo et bouton toggle */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-700/50">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-3 min-w-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">MA</span>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg font-bold text-white truncate">Makona Awards</h1>
                    <p className="text-xs text-gray-400">Édition 2025</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto"
                >
                  <span className="text-white font-bold text-sm">MA</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bouton toggle - visible sur desktop */}
            <Button
              onClick={onToggle}
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>

            {/* Bouton fermer - visible sur mobile */}
            <Button
              onClick={onToggle}
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="expanded-nav"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-2"
                >
                  {children}
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-nav"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-2"
                >
                  {/* Rendu des children en mode collapsed avec seulement les icônes */}
                  {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                      return React.cloneElement(child, { 
                        collapsed: true,
                        onTabChange: child.props.onTabChange 
                      });
                    }
                    return child;
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="expanded-footer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-xs">KE</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">Admin User</p>
                    <p className="text-xs text-gray-400">Administrateur</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-footer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-center"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-xs">KE</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CollapsibleSidebar;
