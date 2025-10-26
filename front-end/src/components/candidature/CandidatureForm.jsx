/**
 * Composant de soumission de candidature
 * Interface fluide et intuitive pour soumettre une candidature
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileImage, 
  FileVideo, 
  FileText, 
  Music, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import candidatureService from '@/services/candidatureService';
import categoryService from '@/services/categoryService';

const CandidatureForm = ({ category, onSuccess, onCancel }) => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Obtenir les exigences de la catégorie
  const requirements = categoryService.getFileRequirements(category);
  const requiredTypes = categoryService.getRequiredFileTypes(category);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const processedFiles = newFiles.map(file => {
      const fileType = candidatureService.getFileTypeFromExtension(file.name);
      return {
        file,
        type: fileType,
        title: '',
        order: files.length,
        id: Math.random().toString(36).substr(2, 9)
      };
    });

    // Validation des fichiers
    const validation = candidatureService.validateFiles([...files, ...processedFiles], requirements);
    
    if (!validation.isValid) {
      toast({
        title: "Erreur de validation",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setFiles(prev => [...prev, ...processedFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const updateFileTitle = (fileId, title) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, title } : file
    ));
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'photo': return FileImage;
      case 'video': return FileVideo;
      case 'audio': return Music;
      case 'portfolio': return FileText;
      default: return FileText;
    }
  };

  const getFileTypeLabel = (type) => {
    switch (type) {
      case 'photo': return 'Photo';
      case 'video': return 'Vidéo';
      case 'audio': return 'Audio';
      case 'portfolio': return 'Portfolio';
      default: return 'Fichier';
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "Aucun fichier",
        description: "Veuillez ajouter au moins un fichier",
        variant: "destructive"
      });
      return;
    }

    // Validation finale
    const validation = candidatureService.validateFiles(files, requirements);
    if (!validation.isValid) {
      toast({
        title: "Erreur de validation",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await candidatureService.submitCandidature({
        categoryId: category.id,
        files: files.map(file => candidatureService.prepareFileData(
          file.file, 
          file.type, 
          file.title, 
          file.order
        ))
      });

      if (result.success) {
        toast({
          title: "Candidature soumise !",
          description: result.message,
        });
        onSuccess && onSuccess(result.candidature);
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
        description: "Une erreur est survenue lors de la soumission",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFileTypeRequired = (type) => {
    return requiredTypes.includes(type);
  };

  const isFileTypePresent = (type) => {
    return files.some(file => file.type === type);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-8"
      >
        {/* En-tête */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Candidature - {category.name}
          </h2>
          <p className="text-gray-400 mb-4">
            {category.description}
          </p>
          
          {/* Exigences */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Exigences de fichiers :</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['photo', 'video', 'portfolio', 'audio'].map(type => {
                const isRequired = isFileTypeRequired(type);
                const isPresent = isFileTypePresent(type);
                const Icon = getFileIcon(type);
                
                return (
                  <div 
                    key={type}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      isRequired 
                        ? isPresent 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {getFileTypeLabel(type)}
                      {isRequired && ' *'}
                    </span>
                    {isRequired && isPresent && <CheckCircle className="w-4 h-4" />}
                    {isRequired && !isPresent && <AlertCircle className="w-4 h-4" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Zone de drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-yellow-500 bg-yellow-500/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Glissez vos fichiers ici
          </h3>
          <p className="text-gray-400 mb-4">
            ou cliquez pour sélectionner des fichiers
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="btn-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter des fichiers
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Liste des fichiers */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Fichiers sélectionnés ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => {
                const Icon = getFileIcon(file.type);
                const size = candidatureService.formatFileSize(file.file.size);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                  >
                    <Icon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {getFileTypeLabel(file.type)} • {size}
                      </p>
                      <input
                        type="text"
                        placeholder="Titre du fichier (optionnel)"
                        value={file.title}
                        onChange={(e) => updateFileTitle(file.id, e.target.value)}
                        className="mt-2 w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <Button
                      onClick={() => removeFile(file.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 btn-primary"
            disabled={isSubmitting || files.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Soumission...
              </>
            ) : (
              'Soumettre la candidature'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CandidatureForm;
