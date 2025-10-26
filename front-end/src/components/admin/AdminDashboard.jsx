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
import CandidatesManagement from './CandidatesManagement';

const AdminDashboard = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidatures, setCandidatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    loadCandidatures();
  }, []);

  const tabs = [
    { id: 'candidates', icon: Users, label: 'Gestion Candidats' },
    { id: 'users', icon: UserCheck, label: 'Gestion Utilisateurs' },
    { id: 'categories', icon: Tag, label: 'Gestion Catégories' },
    { id: 'votes', icon: BarChart2, label: 'Visualisation des Votes' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  const loadCandidatures = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'endpoint admin
      const result = await candidatureService.getCandidatures();
      if (result.success) {
        setCandidatures(result.candidatures);
        calculateStats(result.candidatures);
      } else {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (candidatures) => {
    const stats = {
      total: candidatures.length,
      pending: candidatures.filter(c => c.status === 'pending').length,
      approved: candidatures.filter(c => c.status === 'approved').length,
      rejected: candidatures.filter(c => c.status === 'rejected').length
    };
    setStats(stats);
  };

  const handleApproveCandidature = async (candidatureId) => {
    try {
      // TODO: Implémenter l'endpoint d'approbation
      toast({
        title: "Candidature approuvée",
        description: "La candidature a été approuvée avec succès",
      });
      loadCandidatures(); // Recharger la liste
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la candidature",
        variant: "destructive"
      });
    }
  };

  const handleRejectCandidature = async (candidatureId) => {
    try {
      // TODO: Implémenter l'endpoint de rejet
      toast({
        title: "Candidature rejetée",
        description: "La candidature a été rejetée",
      });
      loadCandidatures(); // Recharger la liste
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la candidature",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

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
      case 'categories':
        return <CategoriesManagement />;
      case 'votes':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-white mb-6">Visualisation des Votes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-glass p-6">
                <h3 className="text-xl font-bold mb-4">Votes par Catégorie</h3>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center text-gray-500">Graphique à barres</div>
              </div>
              <div className="card-glass p-6">
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
              <div className="card-glass p-6">
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
              <div className="card-glass p-6">
                <h3 className="text-xl font-bold mb-4">Chronomètre</h3>
                <p className="text-gray-400 mb-2">Date de fin : 30 Décembre 2025, 23:59</p>
                <Button onClick={handleNotImplemented} className="btn-secondary w-full">Modifier le chronomètre</Button>
              </div>
              <div className="card-glass p-6">
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
      <div className="min-h-screen flex">
        <aside className="w-16 md:w-64 bg-slate-900/80 backdrop-blur-xl p-2 md:p-4 flex flex-col">
          {/* En-tête utilisateur */}
          <div className="mb-6 p-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-black">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-400">Administrateur</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 p-3 rounded-lg w-full text-left transition-colors ${
                activeTab === tab.id ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-6 h-6 shrink-0" />
              <span className="hidden md:block font-semibold">{tab.label}</span>
            </button>
          ))}

          {/* Bouton de déconnexion */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="flex items-center gap-4 p-3 rounded-lg w-full text-left transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="w-6 h-6 shrink-0" />
              <span className="hidden md:block font-semibold">Déconnexion</span>
            </button>
          </div>
        </aside>
        
        <main className="flex-1 p-6 md:p-10 bg-makona-pattern">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
