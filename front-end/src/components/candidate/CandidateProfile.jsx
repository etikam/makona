/**
 * Composant de profil candidat
 * Interface simple pour que les candidats voient leurs candidatures
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  XCircle,
  LogOut,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import candidatureService from '@/services/candidatureService';
import authService from '@/services/authService';

const CandidateProfile = ({ user, onLogout, onNavigate }) => {
  const [candidatures, setCandidatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCandidatures();
  }, []);

  const loadCandidatures = async () => {
    setIsLoading(true);
    try {
      const result = await candidatureService.getMyCandidatures();
      if (result.success) {
        setCandidatures(result.candidatures);
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
        description: "Impossible de charger vos candidatures",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  const getCountryName = (country) => {
    switch (country) {
      case 'guinea':
        return 'Guinée';
      case 'liberia':
        return 'Libéria';
      case 'sierra_leone':
        return 'Sierra Leone';
      default:
        return country;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">
              Mon Profil Candidat
            </h1>
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-400 border-red-400 hover:bg-red-400/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Nom complet</p>
                  <p className="text-white font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Téléphone</p>
                    <p className="text-white font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Pays</p>
                  <p className="text-white font-medium">{getCountryName(user.country)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Candidatures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Mes Candidatures
            </h2>
            <Button
              onClick={() => onNavigate('submit-candidature')}
              className="btn-primary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Nouvelle Candidature
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Chargement de vos candidatures...</p>
            </div>
          ) : candidatures.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                Vous n'avez pas encore de candidatures
              </p>
              <Button
                onClick={() => onNavigate('submit-candidature')}
                className="btn-primary"
              >
                Soumettre ma première candidature
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {candidatures.map((candidature, index) => (
                <motion.div
                  key={candidature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {candidature.category.name}
                      </h3>
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

                  {candidature.rejection_reason && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-400 text-sm">
                        <strong>Raison du rejet :</strong> {candidature.rejection_reason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => onNavigate(`candidature/${candidature.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
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

export default CandidateProfile;
