/**
 * Dashboard administrateur
 * Interface pour gérer les candidatures et le système
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  BarChart3,
  Settings,
  LogOut,
  Eye,
  Check,
  X,
  CheckSquare,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Edit,
  Trash2,
  Download,
  Tag,
  UserCheck,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import candidatureService from '@/services/candidatureService';
import authService from '@/services/authService';
import UsersManagement from './UsersManagement';
import CandidaturesManagement from './CandidaturesManagement';
import CategoriesManagement from './CategoriesManagement';
import CategoryClassesManagement from './CategoryClassesManagement';
import CandidatesManagement from './CandidatesManagement';
import SettingsManagement from './SettingsManagement';
import AdminDashboardLayout from './AdminDashboardLayout';

const AdminDashboard = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('candidates');

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fonctionnalité à venir !",
      description: "Cette fonctionnalité n'est pas encore implémentée, mais vous pouvez la demander dans votre prochain message ! 🚀",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'candidates':
        return <CandidatesManagement />;
      case 'users':
        return <UsersManagement />;
      case 'category-classes':
        return <CategoryClassesManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'votes':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-white mb-6">Visualisation des Votes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Votes par Catégorie</h3>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center text-gray-500">Graphique à barres</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Progression des votes en temps réel</h3>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center text-gray-500">Graphique linéaire</div>
              </div>
            </div>
          </motion.div>
        );
      case 'settings':
        return <SettingsManagement />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - Makona Awards 2025</title>
        <meta name="description" content="Gestion de la plateforme Makona Awards 2025." />
      </Helmet>
      
      <AdminDashboardLayout
        title="Dashboard Admin"
        subtitle="Gestion complète de la plateforme Makona Awards"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
      >
        {renderContent()}
      </AdminDashboardLayout>
    </>
  );
};

export default AdminDashboard;
