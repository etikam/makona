import React from 'react';
import { motion } from 'framer-motion';
import ResponsiveLayout from './responsive-layout';
import ResponsiveHeader from './responsive-header';
import { ResponsiveNavigation } from './responsive-navigation';
import { ToastContainer } from './enhanced-toast';
import { useToast } from '../../hooks/useToast';

const DashboardLayout = ({
  title,
  subtitle,
  navigationItems = [],
  navigationGroups = [],
  actions = [],
  children,
  className = ""
}) => {
  const { toasts, removeToast } = useToast();

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo/Title */}
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <ResponsiveNavigation
          items={navigationItems}
          groups={navigationGroups}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-400 text-center">
          Makona Awards Admin
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <ResponsiveLayout sidebar={sidebar} className={className}>
        {/* Header */}
        <ResponsiveHeader
          title={title}
          subtitle={subtitle}
          actions={actions}
          className="mb-6"
        />

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </ResponsiveLayout>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default DashboardLayout;
