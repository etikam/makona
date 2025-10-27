import React, { useState } from 'react';
import AdminDashboardLayout from './AdminDashboardLayout';
import CategoryClassesManagement from './CategoryClassesManagement';
import { 
  ResponsiveStatsGrid,
  ResponsiveCardGrid,
  ResponsiveChartGrid,
  StatCard,
  Chart
} from '../ui';

const TestResponsiveDashboard = () => {
  const [activeTab, setActiveTab] = useState('category-classes');

  const stats = [
    {
      key: 'total-users',
      label: 'Total Utilisateurs',
      value: '1,234',
      change: 12.5,
      changeType: 'positive',
      icon: 'Users',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20'
    },
    {
      key: 'active-candidates',
      label: 'Candidats Actifs',
      value: '456',
      change: 8.2,
      changeType: 'positive',
      icon: 'UserCheck',
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/20'
    },
    {
      key: 'total-categories',
      label: 'Catégories',
      value: '24',
      change: 0,
      changeType: 'neutral',
      icon: 'Tag',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20'
    },
    {
      key: 'pending-approvals',
      label: 'En Attente',
      value: '12',
      change: -15.3,
      changeType: 'negative',
      icon: 'Clock',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20'
    }
  ];

  const charts = [
    {
      key: 'users-chart',
      title: 'Évolution des Utilisateurs',
      subtitle: 'Inscriptions par mois',
      type: 'line',
      data: [
        { label: 'Jan', value: 120 },
        { label: 'Fév', value: 150 },
        { label: 'Mar', value: 180 },
        { label: 'Avr', value: 200 },
        { label: 'Mai', value: 220 },
        { label: 'Juin', value: 250 }
      ]
    },
    {
      key: 'categories-chart',
      title: 'Répartition des Catégories',
      subtitle: 'Candidatures par catégorie',
      type: 'pie',
      data: [
        { label: 'Musique', value: 45 },
        { label: 'Danse', value: 30 },
        { label: 'Théâtre', value: 15 },
        { label: 'Arts Visuels', value: 10 }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'category-classes':
        return <CategoryClassesManagement />;
      
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <ResponsiveStatsGrid>
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.key}
                  title={stat.label}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType}
                  className="hover:scale-105 transition-transform"
                />
              ))}
            </ResponsiveStatsGrid>

            {/* Charts */}
            <ResponsiveChartGrid>
              {charts.map(chart => (
                <Chart key={chart.key} {...chart} />
              ))}
            </ResponsiveChartGrid>

            {/* Cards */}
            <ResponsiveCardGrid>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Test Card 1</h3>
                <p className="text-gray-400">Ceci est une carte de test pour vérifier le responsive.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Test Card 2</h3>
                <p className="text-gray-400">Une autre carte de test avec du contenu.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Test Card 3</h3>
                <p className="text-gray-400">Troisième carte pour tester la grille responsive.</p>
              </div>
            </ResponsiveCardGrid>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">Onglet non trouvé</h3>
            <p className="text-gray-400">L'onglet sélectionné n'existe pas.</p>
          </div>
        );
    }
  };

  return (
    <AdminDashboardLayout
      title="Test Dashboard Responsive"
      subtitle="Test de la sidebar pliable et du responsive design"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminDashboardLayout>
  );
};

export default TestResponsiveDashboard;
