/**
 * Dashboard administrateur
 * Interface pour gérer les candidatures et le système
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import candidatureService from '@/services/candidatureService';
import authService from '@/services/authService';

const AdminDashboard = ({ user, onLogout, onNavigate }) => {
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Dashboard Administrateur
              </h1>
              <p className="text-gray-400">
                Bienvenue, {user.first_name} {user.last_name}
              </p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-400 border-red-400 hover:bg-red-400/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">En attente</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Approuvées</p>
                  <p className="text-2xl font-bold text-white">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-gray-400 text-sm">Rejetées</p>
                  <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liste des candidatures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Gestion des Candidatures
            </h2>
            <Button
              onClick={loadCandidatures}
              variant="outline"
              className="btn-secondary"
            >
              Actualiser
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Chargement des candidatures...</p>
            </div>
          ) : candidatures.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Aucune candidature pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidatures.map((candidature, index) => (
                <motion.div
                  key={candidature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-lg p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {candidature.candidate.first_name} {candidature.candidate.last_name}
                      </h3>
                      <p className="text-gray-400 mb-2">
                        {candidature.category.name} • {candidature.candidate.email}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Soumise le {new Date(candidature.submitted_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(candidature.status)}`}>
                      {getStatusIcon(candidature.status)}
                      <span className="text-sm font-medium">
                        {getStatusText(candidature.status)}
                      </span>
                    </div>
                  </div>

                  {candidature.files && candidature.files.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Fichiers soumis :</p>
                      <div className="flex flex-wrap gap-2">
                        {candidature.files.map((file, fileIndex) => (
                          <span
                            key={fileIndex}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                          >
                            {file.file_type} - {file.title || 'Sans titre'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onNavigate(`admin/candidature/${candidature.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                    
                    {candidature.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleApproveCandidature(candidature.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approuver
                        </Button>
                        <Button
                          onClick={() => handleRejectCandidature(candidature.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
