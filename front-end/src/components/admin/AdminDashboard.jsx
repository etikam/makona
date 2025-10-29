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
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-white mb-6">Paramètres de la Plateforme</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Gestion des Catégories</h3>
                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                  <p>Musique</p>
                  <div className="flex gap-2">
                    <Button onClick={handleNotImplemented} size="icon" variant="ghost"><Edit className="w-4 h-4"/></Button>
                    <Button onClick={handleNotImplemented} size="icon" variant="ghost" className="text-red-400"><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
                <Button onClick={handleNotImplemented} className="btn-secondary mt-4 w-full"><Plus className="w-4 h-4 mr-2"/> Ajouter une catégorie</Button>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Chronomètre</h3>
                <p className="text-gray-400 mb-2">Date de fin : 30 Décembre 2025, 23:59</p>
                <Button onClick={handleNotImplemented} className="btn-secondary w-full">Modifier le chronomètre</Button>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Gestion des Résultats</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handleNotImplemented} className="btn-primary flex-1">Annoncer les résultats</Button>
                  <Button onClick={handleNotImplemented} className="btn-secondary flex-1"><Download className="w-4 h-4 mr-2"/> Exporter les résultats (CSV)</Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
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
