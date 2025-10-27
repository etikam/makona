import React from 'react';
import { Helmet } from 'react-helmet';
import { ScrollableStatsGrid } from '@/components/ui';
import { BarChart3, CheckCircle, Clock, Star, Users, UserCheck } from 'lucide-react';

const TestScrollableStats = () => {
  const mockStats = [
    {
      key: 'total',
      label: 'Total Classes',
      value: 4,
      icon: BarChart3,
      iconColor: 'text-blue-400',
      className: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30'
    },
    {
      key: 'active',
      label: 'Classes Actives',
      value: 4,
      icon: CheckCircle,
      iconColor: 'text-green-400',
      className: 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30'
    },
    {
      key: 'inactive',
      label: 'Classes Inactives',
      value: 0,
      icon: Clock,
      iconColor: 'text-orange-400',
      className: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30'
    },
    {
      key: 'with-categories',
      label: 'Avec Catégories',
      value: 0,
      icon: Star,
      iconColor: 'text-purple-400',
      className: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30'
    },
    {
      key: 'users',
      label: 'Utilisateurs',
      value: 12,
      icon: Users,
      iconColor: 'text-cyan-400',
      className: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30'
    },
    {
      key: 'verified',
      label: 'Vérifiés',
      value: 8,
      icon: UserCheck,
      iconColor: 'text-emerald-400',
      className: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Test Scrollable Stats - Makona Awards 2025</title>
        <meta name="description" content="Test du composant ScrollableStatsGrid." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Test ScrollableStatsGrid</h1>
            <p className="text-gray-400">Testez le défilement horizontal des statistiques</p>
          </div>
          
          <ScrollableStatsGrid
            stats={mockStats}
            className="mb-8"
          />
          
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Instructions de test :</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Sur mobile : Glissez horizontalement pour voir toutes les statistiques</li>
              <li>• Sur desktop : Utilisez les boutons de flèche ou glissez avec la souris</li>
              <li>• Les statistiques devraient s'adapter à la largeur de l'écran</li>
              <li>• Pas de scrollbar visible (masquée avec CSS)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestScrollableStats;
