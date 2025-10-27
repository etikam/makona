import React, { useState } from 'react';
import { ResponsiveDashboardLayout } from '../ui/responsive-dashboard-layout';
import { ResponsiveSidebarNav } from '../ui/responsive-sidebar-nav';
import { ResponsiveHeader } from '../ui/responsive-header';
import { ResponsiveStatsGrid } from '../ui/responsive-grid';

const SimpleResponsiveTest = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarContent = (
    <ResponsiveSidebarNav
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );

  const stats = [
    {
      key: 'users',
      label: 'Utilisateurs',
      value: '1,234',
      change: 12.5,
      changeType: 'positive'
    },
    {
      key: 'candidates',
      label: 'Candidats',
      value: '456',
      change: 8.2,
      changeType: 'positive'
    },
    {
      key: 'categories',
      label: 'Catégories',
      value: '24',
      change: 0,
      changeType: 'neutral'
    },
    {
      key: 'pending',
      label: 'En Attente',
      value: '12',
      change: -15.3,
      changeType: 'negative'
    }
  ];

  return (
    <ResponsiveDashboardLayout sidebarContent={sidebarContent}>
      <ResponsiveHeader
        title="Test Responsive"
        subtitle="Sidebar pliable et design responsive"
        actions={[
          {
            label: 'Actualiser',
            shortLabel: '↻',
            onClick: () => window.location.reload(),
            variant: 'outline'
          }
        ]}
        className="mb-6"
      />

      <div className="space-y-6">
        <ResponsiveStatsGrid>
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-sm">📊</span>
                </div>
              </div>
            </div>
          ))}
        </ResponsiveStatsGrid>

        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Test de Responsive</h3>
          <p className="text-gray-400 mb-4">
            Cette page teste la sidebar pliable et le design responsive. 
            Redimensionnez votre navigateur pour voir l'adaptation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Mobile</h4>
              <p className="text-gray-400 text-sm">Sidebar masquée par défaut</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Tablet</h4>
              <p className="text-gray-400 text-sm">Layout adaptatif</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Desktop</h4>
              <p className="text-gray-400 text-sm">Sidebar pliable</p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveDashboardLayout>
  );
};

export default SimpleResponsiveTest;
