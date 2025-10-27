import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Tag, 
  BarChart2, 
  Settings,
  CheckSquare,
  TrendingUp,
  Activity,
  Award,
  Clock
} from 'lucide-react';
import AdminDashboardLayout from './AdminDashboardLayout';
import { 
  StatsDashboard, 
  DataTable, 
  Chart,
  LoadingGrid,
  ResponsiveCard,
  CardHeader,
  CardContent,
  CardFooter,
  CardIcon,
  CardTitle,
  CardSubtitle,
  CardDescription,
  CardActions,
  ActionButton
} from '../ui';
import { useDataTable } from '../../hooks';
import { useToast } from '../../hooks/useToast';

const ModernAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('candidates');
  const { success, error, warning, info } = useToast();

  // Mock data for demonstration
  const stats = [
    {
      key: 'total-users',
      label: 'Total Utilisateurs',
      value: '1,234',
      change: 12.5,
      changeType: 'positive',
      icon: Users,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20'
    },
    {
      key: 'active-candidates',
      label: 'Candidats Actifs',
      value: '456',
      change: 8.2,
      changeType: 'positive',
      icon: UserCheck,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/20'
    },
    {
      key: 'total-categories',
      label: 'Catégories',
      value: '24',
      change: 0,
      changeType: 'neutral',
      icon: Tag,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20'
    },
    {
      key: 'pending-approvals',
      label: 'En Attente',
      value: '12',
      change: -15.3,
      changeType: 'negative',
      icon: Clock,
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
      case 'candidates':
        return (
          <div className="space-y-6">
            <StatsDashboard
              stats={stats}
              title="Statistiques des Candidats"
              subtitle="Vue d'ensemble des candidatures"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts.map(chart => (
                <Chart key={chart.key} {...chart} />
              ))}
            </div>

            <ResponsiveCard>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardIcon icon={Users} />
                  <div>
                    <CardTitle>Candidats Récents</CardTitle>
                    <CardSubtitle>Dernières inscriptions</CardSubtitle>
                  </div>
                </div>
                <CardActions>
                  <ActionButton
                    icon={Activity}
                    onClick={() => info('Info', 'Fonctionnalité en cours de développement')}
                    className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                  />
                </CardActions>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Liste des candidats récemment inscrits avec leurs informations de base.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Voir tous les candidats →
                </button>
              </CardFooter>
            </ResponsiveCard>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <ResponsiveCard>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardIcon icon={UserCheck} />
                  <div>
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                    <CardSubtitle>Administration des comptes</CardSubtitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Interface de gestion complète des utilisateurs de la plateforme.
                </CardDescription>
              </CardContent>
            </ResponsiveCard>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <ResponsiveCard>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardIcon icon={Tag} />
                  <div>
                    <CardTitle>Gestion des Catégories</CardTitle>
                    <CardSubtitle>Configuration des catégories de prix</CardSubtitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Créez et gérez les catégories de prix pour les différentes disciplines.
                </CardDescription>
              </CardContent>
            </ResponsiveCard>
          </div>
        );

      case 'votes':
        return (
          <div className="space-y-6">
            <ResponsiveCard>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardIcon icon={BarChart2} />
                  <div>
                    <CardTitle>Visualisation des Votes</CardTitle>
                    <CardSubtitle>Statistiques et analyses</CardSubtitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Consultez les statistiques de vote et les analyses de performance.
                </CardDescription>
              </CardContent>
            </ResponsiveCard>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <ResponsiveCard>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardIcon icon={Settings} />
                  <div>
                    <CardTitle>Paramètres</CardTitle>
                    <CardSubtitle>Configuration de la plateforme</CardSubtitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Configurez les paramètres généraux de la plateforme.
                </CardDescription>
              </CardContent>
            </ResponsiveCard>
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
      title="Dashboard Admin"
      subtitle="Gestion complète de la plateforme Makona Awards"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminDashboardLayout>
  );
};

export default ModernAdminDashboard;
