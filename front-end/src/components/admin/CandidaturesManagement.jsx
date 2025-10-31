/**
 * Composant de gestion des candidatures (Admin)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, Eye, Check, X, Clock, 
  User, Calendar, Tag, Download, RefreshCw, ThumbsUp, ThumbsDown,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import adminService from '@/services/adminService';
import categoryService from '@/services/categoryService';

const CandidaturesManagement = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort_by: '-submitted_at'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showCandidatureModal, setShowCandidatureModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadCandidatures();
    loadCategories();
  }, [currentPage, filters]);

  const loadCandidatures = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: 20,
        status: 'pending', // Filtrer automatiquement les candidatures en attente (non validées)
        ...filters
      };
      
      // Nettoyer les paramètres de filtre
      if (params.category === 'all') delete params.category;
      
      const response = await adminService.getCandidatures(params);
      setCandidatures(response.results || response);
      setPagination(response.pagination || {});
    } catch (error) {
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleApproveCandidature = async (candidatureId) => {
    try {
      await adminService.approveCandidature(candidatureId);
      toast({
        title: "Succès",
        description: "Candidature approuvée avec succès"
      });
      loadCandidatures();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la candidature",
        variant: "destructive"
      });
    }
  };

  const handleRejectCandidature = async (candidatureId) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une raison de rejet",
        variant: "destructive"
      });
      return;
    }

    try {
      await adminService.rejectCandidature(candidatureId, rejectionReason);
      toast({
        title: "Succès",
        description: "Candidature rejetée"
      });
      setShowRejectModal(false);
      setRejectionReason('');
      loadCandidatures();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la candidature",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCandidature = async (candidatureId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return;
    }

    try {
      await adminService.deleteCandidature(candidatureId);
      toast({
        title: "Succès",
        description: "Candidature supprimée avec succès"
      });
      loadCandidatures();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la candidature",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { 
        icon: Clock, 
        color: 'bg-yellow-500', 
        text: 'En attente' 
      },
      'approved': { 
        icon: CheckCircle, 
        color: 'bg-green-500', 
        text: 'Approuvée' 
      },
      'rejected': { 
        icon: XCircle, 
        color: 'bg-red-500', 
        text: 'Rejetée' 
      }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getCategoryIcon = (categoryIcon) => {
    // Ici vous pouvez mapper les icônes de catégorie aux composants Lucide
    // Pour l'instant, on utilise une icône par défaut
    return Tag;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* En-tête responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Validation des Candidatures</h2>
            {candidatures.length > 0 && (
              <Badge className="bg-yellow-500 text-white text-xs sm:text-sm self-start sm:self-center">
                {candidatures.length} en attente
              </Badge>
            )}
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Candidatures en attente de validation</p>
        </div>
        
        {/* Boutons responsive */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            onClick={() => adminService.exportCandidaturesCSV(filters)}
            variant="outline"
            size="sm"
            className="btn-secondary text-xs sm:text-sm"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Exporter CSV</span>
            <span className="xs:hidden">CSV</span>
          </Button>
          <Button
            onClick={loadCandidatures}
            variant="outline"
            size="sm"
            className="btn-secondary text-xs sm:text-sm"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Actualiser</span>
            <span className="xs:hidden">↻</span>
          </Button>
        </div>
      </div>

      {/* Filtres responsive */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher candidat ou catégorie..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.sort_by || '-submitted_at'} onValueChange={(value) => handleFilterChange('sort_by', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-submitted_at">Plus récent</SelectItem>
              <SelectItem value="submitted_at">Plus ancien</SelectItem>
              <SelectItem value="candidate__first_name">Nom candidat</SelectItem>
              <SelectItem value="category__name">Catégorie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau des candidatures */}
      <div className="card-glass overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des candidatures...</p>
          </div>
        ) : candidatures.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucune candidature en attente</h3>
            <p className="text-gray-400">Toutes les candidatures ont été traitées ! 🎉</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4">Candidat</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Date de soumission</th>
                  <th className="p-4">Fichiers</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.map((candidature, index) => (
                  <motion.tr
                    key={candidature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {candidature.candidate_name?.split(' ').map(n => n[0]).join('') || '??'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{candidature.candidate_name}</p>
                          <p className="text-sm text-gray-400">{candidature.candidate_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{candidature.category_name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(candidature.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">
                          {new Date(candidature.submitted_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400">{candidature.files?.length || 0} fichier(s)</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => {
                            setSelectedCandidature(candidature);
                            setShowCandidatureModal(true);
                          }}
                          size="icon"
                          variant="ghost"
                          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {candidature.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApproveCandidature(candidature.id)}
                              size="icon"
                              variant="ghost"
                              className="text-green-400 hover:bg-green-500/10 hover:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedCandidature(candidature);
                                setShowRejectModal(true);
                              }}
                              size="icon"
                              variant="ghost"
                              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.count > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Affichage de {((currentPage - 1) * 20) + 1} à {Math.min(currentPage * 20, pagination.count)} sur {pagination.count} candidatures
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.previous}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.next}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card-glass p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Rejeter la candidature</h3>
              <p className="text-gray-400 mb-4">
                Candidat: {selectedCandidature?.candidate_name}
              </p>
              <Textarea
                placeholder="Raison du rejet..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowRejectModal(false)}
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => handleRejectCandidature(selectedCandidature.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Rejeter
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CandidaturesManagement;
