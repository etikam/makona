import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Trash2, Plus, FileText, Image, Video, Music, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import candidateService from '@/services/candidateService';

const EditCandidatureModal = ({ candidature, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // État du formulaire
  const [formData, setFormData] = useState({
    description: '',
    files: {
      photo: [],
      video: [],
      audio: [],
      portfolio: [],
      documents: []
    }
  });

  // Charger les données de la candidature
  useEffect(() => {
    if (candidature) {
      setFormData({
        description: candidature.description || '',
        files: {
          photo: candidature.files?.filter(f => f.file_type === 'photo') || [],
          video: candidature.files?.filter(f => f.file_type === 'video') || [],
          audio: candidature.files?.filter(f => f.file_type === 'audio') || [],
          portfolio: candidature.files?.filter(f => f.file_type === 'portfolio') || [],
          documents: candidature.files?.filter(f => f.file_type === 'documents') || []
        }
      });
    }
  }, [candidature]);

  // Gestion des fichiers
  const handleFileUpload = (fileType, files) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: [...prev.files[fileType], ...fileArray]
      }
    }));
  };

  const removeFile = (fileType, index) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: prev.files[fileType].filter((_, i) => i !== index)
      }
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }
    
    // Vérifier qu'il y a au moins un fichier
    const totalFiles = Object.values(formData.files).flat().length;
    if (totalFiles === 0) {
      newErrors.files = 'Au moins un fichier est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Préparer les données pour l'API
      const submitData = {
        description: formData.description,
        files: formData.files
      };

      await candidateService.updateCandidature(candidature.id, submitData);
      
      toast({
        title: "Succès",
        description: "Candidature mise à jour avec succès"
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la candidature"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'photo': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case 'portfolio': return <File className="w-5 h-5" />;
      case 'documents': return <FileText className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
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

  if (!candidature) return null;

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
                Modifier la candidature
              </h2>
              <p className="text-blue-100">
                {candidature.category?.name} - {candidature.category?.category_class?.name}
              </p>
            </div>
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            
            {/* Description */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description de la candidature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Décrivez votre candidature
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Expliquez pourquoi vous méritez de gagner dans cette catégorie..."
                    className="bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Médias */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Médias de la candidature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {errors.files && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.files}
                    </p>
                  </div>
                )}

                {['photo', 'video', 'audio', 'portfolio', 'documents'].map(fileType => (
                  <div key={fileType} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        {getFileTypeIcon(fileType)}
                        {getFileTypeLabel(fileType)}
                        <Badge variant="outline" className="text-gray-400 border-gray-500">
                          {formData.files[fileType].length}
                        </Badge>
                      </h4>
                      
                      <input
                        type="file"
                        id={`upload-${fileType}`}
                        multiple
                        accept={
                          fileType === 'photo' ? 'image/*' :
                          fileType === 'video' ? 'video/*' :
                          fileType === 'audio' ? 'audio/*' :
                          fileType === 'portfolio' ? '.pdf,.doc,.docx,.zip,.rar' :
                          '.pdf,.doc,.docx,.txt,.rtf'
                        }
                        onChange={(e) => handleFileUpload(fileType, e.target.files)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`upload-${fileType}`).click()}
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>

                    {/* Liste des fichiers */}
                    {formData.files[fileType].length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {formData.files[fileType].map((file, index) => (
                          <div key={index} className="bg-slate-600/50 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {getFileTypeIcon(fileType)}
                              <div className="min-w-0 flex-1">
                                <p className="text-white text-sm truncate">
                                  {file.name || file.file?.split('/').pop() || `Fichier ${index + 1}`}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Fichier existant'}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(fileType, index)}
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
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-600">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-500 text-slate-300 hover:bg-slate-600"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditCandidatureModal;
