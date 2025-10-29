/**
 * Composant de gestion des candidatures (Admin) - CRUD complet
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, Plus, Edit, Trash2, Eye, 
  User, Award, Calendar, Clock, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Download, RefreshCw,
  Upload, Image, Video, Music, File, X, Save,
  Heart, Trophy, BarChart3, TrendingUp, Globe,
  AlertCircle, CheckSquare, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import adminService from '@/services/adminService';
import categoryService from '@/services/categoryService';

const AdminCandidaturesManagement = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    candidate: 'all',
    published: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [editFormData, setEditFormData] = useState({
    description: '',
    status: 'pending',
    published: false,
    rejection_reason: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCandidatures();
    loadCategories();
    loadCandidates();
  }, [currentPage, filters]);

  const loadCandidatures = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCandidatures({
        page: currentPage,
        search: filters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
        candidate: filters.candidate !== 'all' ? filters.candidate : undefined,
        published: filters.published !== 'all' ? filters.published === 'true' : undefined
      });
      setCandidatures(response.results || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await adminService.getCandidates();
      setCandidates(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des candidats:', error);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openDetailModal = (candidature) => {
    setSelectedCandidature(candidature);
    setShowDetailModal(true);
  };

  const openEditModal = (candidature) => {
    setSelectedCandidature(candidature);
    setEditFormData({
      description: candidature.description || '',
      status: candidature.status,
      published: candidature.published || false,
      rejection_reason: candidature.rejection_reason || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (candidature) => {
    setSelectedCandidature(candidature);
    setShowDeleteModal(true);
  };

  const handleUpdateCandidature = async () => {
    try {
      setFormErrors({});
      
      // Validation
      if (!editFormData.description.trim()) {
        setFormErrors({ description: 'La description est obligatoire' });
        return;
      }

      await adminService.updateCandidature(selectedCandidature.id, editFormData);
      
      toast({
        title: "Succès",
        description: "Candidature mise à jour avec succès"
      });
      
      setShowEditModal(false);
      loadCandidatures();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la candidature",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCandidature = async () => {
    try {
      await adminService.deleteCandidature(selectedCandidature.id);
      
      toast({
        title: "Succès",
        description: "Candidature supprimée avec succès"
      });
      
      setShowDeleteModal(false);
      loadCandidatures();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la candidature",
        variant: "destructive"
      });
    }
  };

  const handleTogglePublish = async (candidature) => {
    try {
      const newPublishedStatus = !candidature.published;
      await adminService.updateCandidature(candidature.id, {
        published: newPublishedStatus
      });
      
      toast({
        title: "Succès",
        description: `Candidature ${newPublishedStatus ? 'publiée' : 'dépubliée'} avec succès`
      });
      
      loadCandidatures();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de publication",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-500', icon: <Clock className="w-3 h-3" /> },
      approved: { label: 'Approuvée', color: 'bg-green-500', icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { label: 'Rejetée', color: 'bg-red-500', icon: <XCircle className="w-3 h-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Gestion des Candidatures</h2>
          <p className="text-gray-400 text-sm sm:text-base">Gérez toutes les candidatures soumises</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={loadCandidatures}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvées</SelectItem>
              <SelectItem value="rejected">Rejetées</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.candidate} onValueChange={(value) => handleFilterChange('candidate', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Candidat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les candidats</SelectItem>
              {candidates.map((candidate) => (
                <SelectItem key={candidate.id} value={candidate.id.toString()}>
                  {candidate.first_name} {candidate.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.published} onValueChange={(value) => handleFilterChange('published', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Publication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="true">Publiées</SelectItem>
              <SelectItem value="false">Non publiées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des candidatures */}
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des candidatures...</p>
          </div>
        ) : candidatures.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Candidat</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Publiée</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Soumise le</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fichiers</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {candidatures.map((candidature) => (
                  <tr key={candidature.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {candidature.candidate_name || `${candidature.candidate?.first_name || ''} ${candidature.candidate?.last_name || ''}`.trim()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {candidature.candidate_email || candidature.candidate?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {candidature.category_name || candidature.category?.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {candidature.category_class_name || candidature.category?.category_class?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(candidature.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidature.published ? (
                        <Badge className="bg-green-500 text-white flex items-center gap-1 w-fit">
                          <Globe className="w-3 h-3" />
                          Publiée
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          Non publiée
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(candidature.submitted_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {candidature.files?.slice(0, 3).map((file, index) => (
                          <div key={index} className={`${getFileTypeColor(file.file_type)}`}>
                            {getFileIcon(file.file_type)}
                          </div>
                        ))}
                        {candidature.files?.length > 3 && (
                          <span className="text-xs text-gray-400">+{candidature.files.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleTogglePublish(candidature)}
                          variant="outline"
                          size="sm"
                          className={`${
                            candidature.published 
                              ? 'border-orange-500 text-orange-400 hover:bg-orange-500/10' 
                              : 'border-green-500 text-green-400 hover:bg-green-500/10'
                          }`}
                        >
                          {candidature.published ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Dépublier
                            </>
                          ) : (
                            <>
                              <Globe className="w-4 h-4 mr-1" />
                              Publier
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => openDetailModal(candidature)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openEditModal(candidature)}
                          variant="ghost"
                          size="sm"
                          className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openDeleteModal(candidature)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Aucune candidature trouvée</h3>
            <p className="text-gray-500">Aucune candidature ne correspond aux critères de recherche.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Affichage de {pagination.start_index} à {pagination.end_index} sur {pagination.total_count} résultats
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.has_previous}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </Button>
              <span className="text-sm text-gray-300">
                Page {currentPage} sur {pagination.total_pages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.has_next}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <AnimatePresence>
        {showDetailModal && selectedCandidature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Détails de la candidature</h3>
                <Button
                  onClick={() => setShowDetailModal(false)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Candidat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-white font-medium">
                          {selectedCandidature.candidate_name || `${selectedCandidature.candidate?.first_name || ''} ${selectedCandidature.candidate?.last_name || ''}`.trim()}
                        </p>
                        <p className="text-gray-400">
                          {selectedCandidature.candidate_email || selectedCandidature.candidate?.email}
                        </p>
                        <p className="text-gray-400">
                          {selectedCandidature.candidate_phone || selectedCandidature.candidate?.phone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Catégorie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-white font-medium">
                          {selectedCandidature.category_name || selectedCandidature.category?.name}
                        </p>
                        <p className="text-gray-400">
                          {selectedCandidature.category_class_name || selectedCandidature.category?.category_class?.name}
                        </p>
                        <div className="flex gap-2">
                          {getStatusBadge(selectedCandidature.status)}
                          {selectedCandidature.published && (
                            <Badge className="bg-green-500 text-white flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Publiée
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                {selectedCandidature.description && (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{selectedCandidature.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Médias soumis */}
                <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Médias soumis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCandidature.files && selectedCandidature.files.length > 0 ? (
                      <div className="space-y-6">
                        {/* Grouper les fichiers par type */}
                        {['photo', 'video', 'audio', 'portfolio', 'documents'].map(fileType => {
                          const filesOfType = selectedCandidature.files.filter(file => file.file_type === fileType);
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
                                  <div key={index} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                          {getFileIcon(file.file_type)}
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
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-lg">Aucun média soumis</p>
                        <p className="text-gray-500 text-sm mt-2">
                          Les médias seront visibles ici une fois soumis
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistiques détaillées */}
                <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Statistiques de performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Votes reçus */}
                      <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg p-4 border border-pink-500/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Heart className="w-6 h-6 text-pink-400" />
                          <div>
                            <p className="text-2xl font-bold text-white">
                              {selectedCandidature.vote_count || 0}
                            </p>
                            <p className="text-pink-300 text-sm">Votes reçus</p>
                          </div>
                        </div>
                        <div className="text-xs text-pink-200">
                          {selectedCandidature.status === 'approved' ? 'Candidature éligible aux votes' : 'En attente d\'approbation'}
                        </div>
                      </div>

                      {/* Rang dans la catégorie */}
                      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Trophy className="w-6 h-6 text-yellow-400" />
                          <div>
                            <p className="text-2xl font-bold text-white">
                              #{selectedCandidature.ranking || 'N/A'}
                            </p>
                            <p className="text-yellow-300 text-sm">Rang actuel</p>
                          </div>
                        </div>
                        <div className="text-xs text-yellow-200">
                          {selectedCandidature.status === 'approved' ? 'Classement en cours' : 'Non classé'}
                        </div>
                      </div>

                      {/* Statut de publication */}
                      <div className={`rounded-lg p-4 border ${
                        selectedCandidature.published 
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
                          : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-500/30'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Globe className={`w-6 h-6 ${selectedCandidature.published ? 'text-green-400' : 'text-gray-400'}`} />
                          <div>
                            <p className={`text-lg font-bold ${selectedCandidature.published ? 'text-white' : 'text-gray-400'}`}>
                              {selectedCandidature.published ? 'Publiée' : 'Non publiée'}
                            </p>
                            <p className={`text-sm ${selectedCandidature.published ? 'text-green-300' : 'text-gray-400'}`}>
                              Visibilité publique
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs ${selectedCandidature.published ? 'text-green-200' : 'text-gray-300'}`}>
                          {selectedCandidature.published ? 'Visible au public' : 'Réservée aux admins'}
                        </div>
                      </div>

                      {/* Date de soumission */}
                      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-6 h-6 text-blue-400" />
                          <div>
                            <p className="text-lg font-bold text-white">
                              {new Date(selectedCandidature.submitted_at).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-blue-300 text-sm">Soumise le</p>
                          </div>
                        </div>
                        <div className="text-xs text-blue-200">
                          {selectedCandidature.reviewed_at ? `Examinée le ${new Date(selectedCandidature.reviewed_at).toLocaleDateString('fr-FR')}` : 'En attente d\'examen'}
                        </div>
                      </div>
                    </div>

                    {/* Évolution des votes */}
                    {selectedCandidature.status === 'approved' && selectedCandidature.vote_count > 0 && (
                      <div className="mt-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Performance positive</p>
                            <p className="text-green-300 text-sm">
                              Cette candidature progresse bien dans sa catégorie
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message si pas encore approuvée */}
                    {selectedCandidature.status !== 'approved' && (
                      <div className="mt-6 bg-gray-600/20 rounded-lg p-4 border border-gray-500/30">
                        <div className="flex items-center gap-3">
                          <Clock className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="text-gray-300 font-medium">En attente d'approbation</p>
                            <p className="text-gray-400 text-sm">
                              Les statistiques de vote seront disponibles après approbation
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'édition */}
      <AnimatePresence>
        {showEditModal && selectedCandidature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Modifier la candidature</h3>
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de la candidature..."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    rows={4}
                  />
                  {formErrors.description && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status" className="text-white">Statut</Label>
                    <Select
                      value={editFormData.status}
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="approved">Approuvée</SelectItem>
                        <SelectItem value="rejected">Rejetée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="published" className="text-white">Publiée</Label>
                    <Switch
                      id="published"
                      checked={editFormData.published}
                      onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, published: checked }))}
                    />
                  </div>
                </div>

                {editFormData.status === 'rejected' && (
                  <div>
                    <Label htmlFor="rejection_reason" className="text-white">Raison du rejet</Label>
                    <Textarea
                      id="rejection_reason"
                      value={editFormData.rejection_reason}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, rejection_reason: e.target.value }))}
                      placeholder="Expliquez pourquoi la candidature est rejetée..."
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowEditModal(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleUpdateCandidature}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de suppression */}
      <AnimatePresence>
        {showDeleteModal && selectedCandidature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Supprimer la candidature</h3>
                  <p className="text-gray-400">Cette action est irréversible</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Êtes-vous sûr de vouloir supprimer la candidature de <strong>{selectedCandidature.candidate_name || `${selectedCandidature.candidate?.first_name || ''} ${selectedCandidature.candidate?.last_name || ''}`.trim()}</strong> pour la catégorie <strong>{selectedCandidature.category_name || selectedCandidature.category?.name}</strong> ?
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDeleteCandidature}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminCandidaturesManagement;
