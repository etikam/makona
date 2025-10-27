import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Tag, 
  BarChart2, 
  Settings,
  CheckSquare
} from 'lucide-react';
import { Button } from './button';

const ResponsiveSidebarNav = ({
  activeTab = 'candidates',
  onTabChange,
  collapsed = false,
  className = ""
}) => {
  const navigationItems = [
    {
      key: 'candidates',
      icon: Users,
      label: 'Gestion Candidats',
      isActive: activeTab === 'candidates'
    },
    {
      key: 'users',
      icon: UserCheck,
      label: 'Gestion Utilisateurs',
      isActive: activeTab === 'users'
    },
    {
      key: 'category-classes',
      icon: Tag,
      label: 'Classes de Catégories',
      isActive: activeTab === 'category-classes'
    },
    {
      key: 'categories',
      icon: Tag,
      label: 'Gestion Catégories',
      isActive: activeTab === 'categories'
    },
    {
      key: 'votes',
      icon: BarChart2,
      label: 'Visualisation des Votes',
      isActive: activeTab === 'votes'
    },
    {
      key: 'settings',
      icon: Settings,
      label: 'Paramètres',
      isActive: activeTab === 'settings'
    }
  ];

  return (
    <nav className={`space-y-2 ${className}`}>
      {navigationItems.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            onClick={() => onTabChange?.(item.key)}
            variant="ghost"
            className={`${
              collapsed 
                ? 'w-12 h-12 justify-center' 
                : 'w-full justify-start h-12 px-3'
            } ${
              item.isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Button>
        </motion.div>
      ))}
    </nav>
  );
};

export default ResponsiveSidebarNav;
