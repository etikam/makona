import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from './button';
import CollapsibleSidebar from './collapsible-sidebar';

const ResponsiveDashboardLayout = ({
  children,
  sidebarContent,
  className = "",
  onTabChange,
  user
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Sur mobile, fermer la sidebar par défaut
      if (mobile) {
        setSidebarOpen(false);
      } else {
        // Sur desktop, garder la sidebar ouverte par défaut
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabClick = (tabKey) => {
    // Appeler la fonction de changement d'onglet
    onTabChange?.(tabKey);
    
    // Fermer la sidebar seulement sur mobile pour libérer l'espace
    // Sur desktop, garder la sidebar ouverte pour une meilleure ergonomie
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-900 overflow-hidden ${className}`}>
      {/* Sidebar */}
      <CollapsibleSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        user={user}
      >
        {React.cloneElement(sidebarContent, { onTabChange: handleTabClick })}
      </CollapsibleSidebar>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-semibold text-white truncate">Makona Awards</h1>
              <p className="text-xs text-gray-400 truncate">Dashboard Admin</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-4 py-4 lg:px-6 lg:py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-4 sm:space-y-6"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveDashboardLayout;
