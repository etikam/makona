import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, FileText, Award, Users, Clock, CheckCircle, XCircle, AlertCircle, Eye, Download, Trophy, Star, Heart, BarChart3, TrendingUp, Edit3, Upload, Plus, Trash2, Image, Video, Music, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import candidateService from '@/services/candidateService';

const CandidatureDetails = ({ candidature, onClose, onEdit }) => {
  const [showMediaEdit, setShowMediaEdit] = useState(false);
  const [newFiles, setNewFiles] = useState({
    photo: [],
    video: [],
    audio: [],
    portfolio: [],
    documents: []
  });
  const [uploading, setUploading] = useState(false);

  if (!candidature) return null;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En attente',
          color: 'bg-yellow-500',
          icon: <Clock className="w-4 h-4" />,
          description: 'Votre candidature est en cours d\'examen'
        };
      case 'approved':
        return {
          label: 'Approuvée',
          color: 'bg-green-500',
          icon: <CheckCircle className="w-4 h-4" />,
          description: 'Votre candidature a été approuvée'
        };
      case 'rejected':
        return {
          label: 'Rejetée',
          color: 'bg-red-500',
          icon: <XCircle className="w-4 h-4" />,
          description: 'Votre candidature a été rejetée'
        };
      default:
        return {
          label: 'Inconnu',
          color: 'bg-gray-500',
          icon: <AlertCircle className="w-4 h-4" />,
          description: 'Statut inconnu'
        };
    }
  };

  const statusInfo = getStatusInfo(candidature.status);

  const getFileIcon = (fileType) => {
    const icons = {
      photo: <Image className="w-4 h-4" />,
      video: <Video className="w-4 h-4" />,
      audio: <Music className="w-4 h-4" />,
      portfolio: <File className="w-4 h-4" />,
      documents: <FileText className="w-4 h-4" />
    };
    return icons[fileType] || <File className="w-4 h-4" />;
  };

  const getFileTypeColor = (fileType) => {
    const colors = {
      photo: 'text-pink-400',
      video: 'text-red-400',
      audio: 'text-purple-400',
      portfolio: 'text-blue-400',
      documents: 'text-gray-400'
    };
    return colors[fileType] || 'text-gray-400';
  };

  const handleFileSelect = (fileType, files) => {
    const fileList = Array.from(files);
    setNewFiles(prev => ({
      ...prev,
      [fileType]: [...prev[fileType], ...fileList]
    }));
  };

  const handleRemoveFile = (fileType, index) => {
    setNewFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }));
  };

  const handleUploadFiles = async () => {
    if (!candidature.can_be_modified) {
      toast({
        title: "Erreur",
        description: "Cette candidature ne peut plus être modifiée",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      // Ajouter les nouveaux fichiers
      Object.entries(newFiles).forEach(([fileType, files]) => {
        files.forEach((file) => {
          formData.append(`${fileType}_files`, file);
        });
      });

      await candidateService.updateCandidature(candidature.id, formData);
      
      toast({
        title: "Succès",
        description: "Médias ajoutés avec succès"
      });
      
      setShowMediaEdit(false);
      setNewFiles({
        photo: [],
        video: [],
        audio: [],
        portfolio: [],
        documents: []
      });
      
      // Recharger les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'ajout des médias:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les médias",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Détails de la candidature
              </h2>
              <p className="text-blue-100">
                {candidature.category?.name} - {candidature.category?.category_class?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Bouton Modifier (seulement si non publiée) */}
              {candidature.status === 'pending' && !candidature.published && onEdit && (
                <Button
                  onClick={() => onEdit(candidature)}
                  variant="outline"
                  size="sm"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
              
              {/* Bouton Fermer */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:text-yellow-400"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Informations générales */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Statut</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${statusInfo.color} text-white`}>
                      {statusInfo.icon}
                      <span className="ml-1">{statusInfo.label}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{statusInfo.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Date de soumission</label>
                  <p className="text-white flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(candidature.submitted_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {candidature.reviewed_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Date d'examen</label>
                    <p className="text-white flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(candidature.reviewed_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                {candidature.reviewed_by && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Examiné par</label>
                    <p className="text-white flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4" />
                      {candidature.reviewed_by.first_name} {candidature.reviewed_by.last_name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations de la catégorie */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Catégorie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Nom de la catégorie</label>
                  <p className="text-white font-medium">{candidature.category?.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Classe de catégorie</label>
                  <p className="text-white">{candidature.category?.category_class?.name}</p>
                </div>

                {candidature.category?.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <p className="text-gray-300 text-sm">{candidature.category.description}</p>
                  </div>
                )}

                {/* Prix de la catégorie */}
                <div>
                  <label className="text-sm font-medium text-gray-300">Prix attribués</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidature.category?.awards_trophy && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        🏆 Trophée
                      </Badge>
                    )}
                    {candidature.category?.awards_certificate && (
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        📜 Satisfecit
                      </Badge>
                    )}
                    {candidature.category?.awards_monetary && (
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        💰 Primes monétaires
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques de vote et rang */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Votes reçus */}
                <div className="bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-pink-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{candidature.vote_count || 0}</p>
                      <p className="text-pink-300 text-sm">Votes reçus</p>
                    </div>
                  </div>
                </div>

                {/* Rang dans la catégorie */}
                {candidature.status === 'approved' && candidature.ranking && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <div>
                        <p className="text-2xl font-bold text-white">
                          #{candidature.ranking}
                        </p>
                        <p className="text-yellow-300 text-sm">Rang dans la catégorie</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message si pas encore approuvée */}
                {candidature.status !== 'approved' && (
                  <div className="bg-gray-600/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          Les votes et le rang seront disponibles après approbation
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Évolution des votes (placeholder pour future fonctionnalité) */}
                {candidature.status === 'approved' && candidature.vote_count > 0 && (
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Évolution positive</p>
                        <p className="text-blue-300 text-sm">Votre candidature progresse bien</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Médias soumis */}
            <Card className="bg-slate-700/50 border-slate-600 lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Médias soumis
                  </CardTitle>
                  {candidature.can_be_modified && (
                    <Button
                      onClick={() => setShowMediaEdit(!showMediaEdit)}
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {showMediaEdit ? 'Annuler' : 'Ajouter des médias'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {candidature.files && candidature.files.length > 0 ? (
                  <div className="space-y-6">
                    {/* Grouper les fichiers par type */}
                    {['photo', 'video', 'audio', 'portfolio', 'documents'].map(fileType => {
                      const filesOfType = candidature.files.filter(file => file.file_type === fileType);
                      if (filesOfType.length === 0) return null;
                      
                      const getFileTypeIcon = (type) => {
                        switch (type) {
                          case 'photo': return '📸';
                          case 'video': return '🎥';
                          case 'audio': return '🎵';
                          case 'portfolio': return '📁';
                          case 'documents': return '📄';
                          default: return '📄';
                        }
                      };
                      
                      const getFileTypeLabel = (type) => {
                        switch (type) {
                          case 'photo': return 'Photos';
                          case 'video': return 'Vidéos';
                          case 'audio': return 'Audios';
                          case 'portfolio': return 'Portfolio';
                          case 'documents': return 'Documents';
                          default: return 'Fichiers';
                        }
                      };
                      
                      return (
                        <div key={fileType} className="space-y-3">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="text-2xl">{getFileTypeIcon(fileType)}</span>
                            {getFileTypeLabel(fileType)}
                            <Badge variant="outline" className="text-gray-400 border-gray-500">
                              {filesOfType.length}
                            </Badge>
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filesOfType.map((file, index) => (
                              <div key={index} className="bg-slate-600/50 rounded-lg p-4 hover:bg-slate-600/70 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                      <FileText className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                      <p className="text-white font-medium capitalize">{file.file_type}</p>
                                      <p className="text-gray-400 text-sm">
                                        {new Date(file.uploaded_at).toLocaleDateString('fr-FR')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                {file.description && (
                                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                    {file.description}
                                  </p>
                                )}
                                
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                                    onClick={() => window.open(file.file, '_blank')}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Voir
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-green-500 text-green-400 hover:bg-green-500/10"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = file.file;
                                      link.download = file.file.split('/').pop();
                                      link.click();
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg">Aucun média soumis</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Les médias seront visibles ici une fois soumis
                    </p>
                  </div>
                )}

                {/* Section d'édition des médias */}
                {showMediaEdit && candidature.can_be_modified && (
                  <div className="mt-6 p-4 bg-slate-600/30 rounded-lg border border-slate-500">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Ajouter de nouveaux médias
                    </h4>
                    
                    <div className="space-y-4">
                      {['photo', 'video', 'audio', 'portfolio', 'documents'].map(fileType => (
                        <div key={fileType} className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <span className={`${getFileTypeColor(fileType)}`}>
                              {getFileIcon(fileType)}
                            </span>
                            {fileType.charAt(0).toUpperCase() + fileType.slice(1)}s
                          </label>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              multiple
                              accept={
                                fileType === 'photo' ? 'image/*' :
                                fileType === 'video' ? 'video/*' :
                                fileType === 'audio' ? 'audio/*' :
                                fileType === 'portfolio' ? '.pdf,.doc,.docx,.zip,.rar' :
                                '.pdf,.doc,.docx,.txt,.xls,.xlsx'
                              }
                              onChange={(e) => handleFileSelect(fileType, e.target.files)}
                              className="hidden"
                              id={`file-${fileType}`}
                            />
                            <label
                              htmlFor={`file-${fileType}`}
                              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-500 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors text-center"
                            >
                              <Upload className="w-4 h-4 inline mr-2" />
                              Sélectionner des fichiers
                            </label>
                          </div>
                          
                          {/* Afficher les fichiers sélectionnés */}
                          {newFiles[fileType].length > 0 && (
                            <div className="space-y-2">
                              {newFiles[fileType].map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className={`${getFileTypeColor(fileType)}`}>
                                      {getFileIcon(fileType)}
                                    </span>
                                    <span className="text-white text-sm">{file.name}</span>
                                    <span className="text-gray-400 text-xs">
                                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                    </span>
                                  </div>
                                  <Button
                                    onClick={() => handleRemoveFile(fileType, index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Boutons d'action */}
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          onClick={() => setShowMediaEdit(false)}
                          variant="outline"
                          className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handleUploadFiles}
                          disabled={uploading || Object.values(newFiles).every(files => files.length === 0)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {uploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Upload en cours...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Ajouter les médias
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Raison de rejet */}
            {candidature.status === 'rejected' && candidature.rejection_reason && (
              <Card className="bg-red-900/20 border-red-500/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Raison du rejet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-300">{candidature.rejection_reason}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-700/50 px-6 py-4 border-t border-slate-600">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-600">
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CandidatureDetails;
