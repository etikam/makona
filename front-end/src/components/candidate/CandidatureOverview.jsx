/**
 * Composant d'overview d'une candidature
 * Affiche les fichiers, votes, rang et informations de prix
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, Image, Video, Music, File, Download, 
  Trophy, Award, TrendingUp, Users, Star, Calendar,
  Eye, EyeOff, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import candidateService from '@/services/candidateService';

const CandidatureOverview = ({ candidature, onClose }) => {
  const [candidatureDetails, setCandidatureDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    files: true,
    votes: true,
    ranking: true,
    awards: true
  });

  useEffect(() => {
    loadCandidatureDetails();
  }, [candidature]);

  const loadCandidatureDetails = async () => {
    try {
      setLoading(true);
      // Ici on pourrait charger plus de détails si nécessaire
      setCandidatureDetails(candidature);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getFileIcon = (fileType) => {
    const icons = {
      photo: Image,
      video: Video,
      audio: Music,
      portfolio: FileText,
      documents: File
    };
    const Icon = icons[fileType] || File;
    return <Icon className="w-4 h-4" />;
  };

  const getFileTypeColor = (fileType) => {
    const colors = {
      photo: 'text-blue-400',
      video: 'text-red-400',
      audio: 'text-purple-400',
      portfolio: 'text-green-400',
      documents: 'text-orange-400'
    };
    return colors[fileType] || 'text-gray-400';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      approved: 'Approuvée',
      rejected: 'Rejetée'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {candidatureDetails?.category?.name}
              </h2>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(candidatureDetails?.status)}>
                  {getStatusText(candidatureDetails?.status)}
                </Badge>
                <span className="text-gray-400 text-sm">
                  Soumise le {new Date(candidatureDetails?.submitted_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fichiers soumis */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleSection('files')}
              >
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Fichiers soumis
                  </span>
                  {expandedSections.files ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {expandedSections.files && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent>
                      {candidatureDetails?.files && candidatureDetails.files.length > 0 ? (
                        <div className="space-y-3">
                          {candidatureDetails.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className={getFileTypeColor(file.file_type)}>
                                  {getFileIcon(file.file_type)}
                                </span>
                                <div>
                                  <p className="text-white text-sm font-medium">
                                    {file.file.split('/').pop()}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {file.file_type} • {formatFileSize(file.file_size || 0)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-4">
                          Aucun fichier soumis
                        </p>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Votes et rang */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleSection('votes')}
              >
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Votes et classement
                  </span>
                  {expandedSections.votes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {expandedSections.votes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-2">
                            {candidatureDetails?.votes_count || 0}
                          </div>
                          <p className="text-gray-400">Votes reçus</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Rang actuel</span>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              #{candidatureDetails?.ranking || 'N/A'}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total candidats</span>
                            <span className="text-white">{candidatureDetails?.total_candidates || 0}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Progression</span>
                              <span className="text-white">
                                {candidatureDetails?.ranking && candidatureDetails?.total_candidates 
                                  ? Math.round(((candidatureDetails.total_candidates - candidatureDetails.ranking + 1) / candidatureDetails.total_candidates) * 100)
                                  : 0}%
                              </span>
                            </div>
                            <Progress 
                              value={candidatureDetails?.ranking && candidatureDetails?.total_candidates 
                                ? ((candidatureDetails.total_candidates - candidatureDetails.ranking + 1) / candidatureDetails.total_candidates) * 100
                                : 0
                              } 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Informations de prix */}
            <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleSection('awards')}
              >
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Informations de prix
                  </span>
                  {expandedSections.awards ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {expandedSections.awards && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Trophée */}
                        {candidatureDetails?.category?.awards_trophy && (
                          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <div className="flex items-center gap-3 mb-2">
                              <Trophy className="w-6 h-6 text-yellow-400" />
                              <h4 className="text-white font-semibold">Trophée</h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Cette catégorie attribue un trophée physique aux gagnants
                            </p>
                          </div>
                        )}

                        {/* Satisfecit */}
                        {candidatureDetails?.category?.awards_certificate && (
                          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="flex items-center gap-3 mb-2">
                              <Award className="w-6 h-6 text-blue-400" />
                              <h4 className="text-white font-semibold">Satisfecit</h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Certificat de reconnaissance pour les participants
                            </p>
                          </div>
                        )}

                        {/* Primes monétaires */}
                        {candidatureDetails?.category?.awards_monetary && (
                          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center gap-3 mb-2">
                              <TrendingUp className="w-6 h-6 text-green-400" />
                              <h4 className="text-white font-semibold">Primes monétaires</h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Récompenses financières pour les lauréats
                            </p>
                          </div>
                        )}

                        {/* Aucun prix */}
                        {!candidatureDetails?.category?.awards_trophy && 
                         !candidatureDetails?.category?.awards_certificate && 
                         !candidatureDetails?.category?.awards_monetary && (
                          <div className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20 col-span-full">
                            <div className="flex items-center gap-3 mb-2">
                              <Award className="w-6 h-6 text-gray-400" />
                              <h4 className="text-white font-semibold">Aucun prix spécifique</h4>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Cette catégorie ne propose pas de prix particuliers
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CandidatureOverview;
