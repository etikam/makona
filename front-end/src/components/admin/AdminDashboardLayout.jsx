import React from 'react';
import { motion } from 'framer-motion';
import ResponsiveDashboardLayout from '../ui/responsive-dashboard-layout';
import ResponsiveSidebarNav from '../ui/responsive-sidebar-nav';
import ResponsiveHeader from '../ui/responsive-header';
import { useToast } from '../../hooks/useToast';

const AdminDashboardLayout = ({
  children,
  title = "Dashboard Admin",
  subtitle = "Gestion complète de la plateforme",
  activeTab = 'candidates',
  onTabChange,
  user,
  className = ""
}) => {
  const { success, error, warning, info } = useToast();

  const sidebarContent = (
    <ResponsiveSidebarNav
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );

  return (
    <ResponsiveDashboardLayout
      sidebarContent={sidebarContent}
      className={className}
      onTabChange={onTabChange}
      user={user}
    >
      {/* Header */}
      <ResponsiveHeader
        title={title}
        subtitle={subtitle}
        className="mb-6"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {children}
      </motion.div>
    </ResponsiveDashboardLayout>
  );
};

export default AdminDashboardLayout;
