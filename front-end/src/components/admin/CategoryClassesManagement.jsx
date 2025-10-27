/**
 * Composant de gestion des classes de catégories (Admin)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, Search, Filter, Plus, Edit, Trash2, Eye, 
  ChevronLeft, ChevronRight, Download, RefreshCw, X,
  BarChart3, Users, Calendar, TrendingUp, Grid3X3, List,
  MoreVertical, Star, Clock, CheckCircle, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { ResponsiveStatsGrid, ResponsiveCardGrid } from '@/components/ui/responsive-grid';
import { ScrollableStatsGrid } from '@/components/ui';
import categoryClassService from '@/services/categoryClassService';
import EnhancedModal from '@/components/ui/enhanced-modal';
import ConfirmationModal from '@/components/ui/confirmation-modal';

const CategoryClassesManagement = () => {
  const [categoryClasses, setCategoryClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    is_active: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    withCategories: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    order: 0
  });

  useEffect(() => {
    loadCategoryClasses();
  }, [currentPage, filters]);

  useEffect(() => {
    calculateStats();
  }, [categoryClasses]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, categoryClasses]);

  const loadCategoryClasses = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: 20,
        ...filters
      };
      
      // Nettoyer les paramètres de filtre
      if (params.is_active === 'all') delete params.is_active;
      
      const response = await categoryClassService.getAdminCategoryClasses(params);
      setCategoryClasses(response.results || response);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les classes de catégories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = categoryClasses.length;
    const active = categoryClasses.filter(cls => cls.is_active).length;
    const inactive = total - active;
    const withCategories = categoryClasses.filter(cls => cls.categories_count > 0).length;
    
    setStats({ total, active, inactive, withCategories });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredClasses(categoryClasses);
      return;
    }
    
    const filtered = categoryClasses.filter(cls =>
      cls.name.toLowerCase().includes(term.toLowerCase()) ||
      cls.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true,
      order: 0
    });
  };

  const handleCreateClass = async () => {
    try {
      await categoryClassService.createCategoryClass(formData);
      toast({
        title: "Succès",
        description: "Classe de catégorie créée avec succès"
      });
      setShowCreateModal(false);
      resetForm();
      loadCategoryClasses();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la classe de catégorie",
        variant: "destructive"
      });
    }
  };

  const handleUpdateClass = async () => {
    try {
      await categoryClassService.updateCategoryClass(selectedClass.id, formData);
      toast({
        title: "Succès",
        description: "Classe de catégorie mise à jour avec succès"
      });
      setShowEditModal(false);
      resetForm();
      loadCategoryClasses();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la classe de catégorie",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClass = (classItem) => {
    setClassToDelete(classItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!classToDelete) return;
    
    setIsDeleting(true);
    try {
      await categoryClassService.deleteCategoryClass(classToDelete.id);
      toast({
        title: "Succès",
        description: "Classe de catégorie supprimée avec succès"
      });
      loadCategoryClasses();
      setShowDeleteModal(false);
      setClassToDelete(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la classe de catégorie",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (classId) => {
    try {
      const classItem = categoryClasses.find(cls => cls.id === classId);
      await categoryClassService.toggleCategoryClassStatus(classItem.slug);
      toast({
        title: "Succès",
        description: `Classe ${classItem.is_active ? 'désactivée' : 'activée'} avec succès`
      });
      loadCategoryClasses();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la classe",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description,
      is_active: classItem.is_active,
      order: classItem.order
    });
    setShowEditModal(true);
  };

  const openDetailModal = (classItem) => {
    setSelectedClass(classItem);
    setShowDetailModal(true);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <Badge className="bg-green-500 text-white">Actif</Badge>;
    }
    return <Badge variant="destructive">Inactif</Badge>;
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* En-tête avec recherche et boutons de vue */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Gestion des Classes de Catégories</h2>
            <p className="text-gray-200 text-sm sm:text-base">Organisez vos catégories par domaines</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Nouvelle Classe</span>
              <span className="xs:hidden">Nouvelle</span>
            </Button>
          </div>
        </div>
        
        {/* Barre de recherche et contrôles - Design responsive amélioré */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Recherche - Prend toute la largeur sur mobile */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une classe..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 sm:pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300 h-10 sm:h-12 w-full text-sm sm:text-base"
            />
          </div>
          
          {/* Filtres et vues - Responsive */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            {/* Filtre de statut */}
            <Select 
              value={filters.is_active} 
              onValueChange={(value) => handleFilterChange('is_active', value)}
            >
              <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-800">Tous</SelectItem>
                <SelectItem value="true" className="text-white hover:bg-gray-800">Actifs</SelectItem>
                <SelectItem value="false" className="text-white hover:bg-gray-800">Inactifs</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Boutons de vue */}
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                onClick={() => setViewMode('grid')}
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                onClick={() => setViewMode('list')}
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grille de statistiques scrollable */}
      <ScrollableStatsGrid
        stats={[
          {
            key: 'total',
            label: 'Total Classes',
            value: stats.total,
            icon: BarChart3,
            iconColor: 'text-blue-400',
            className: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30'
          },
          {
            key: 'active',
            label: 'Classes Actives',
            value: stats.active,
            icon: CheckCircle,
            iconColor: 'text-green-400',
            className: 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30'
          },
          {
            key: 'inactive',
            label: 'Classes Inactives',
            value: stats.inactive,
            icon: Clock,
            iconColor: 'text-orange-400',
            className: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30'
          },
          {
            key: 'with-categories',
            label: 'Avec Catégories',
            value: stats.withCategories,
            icon: Star,
            iconColor: 'text-purple-400',
            className: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30'
          }
        ]}
        className="mb-6"
      />

      {/* Liste des classes de catégories */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des classes de catégories...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucune classe de catégorie</h3>
          <p className="text-gray-400">Commencez par créer votre première classe de catégorie</p>
        </div>
      ) : viewMode === 'grid' ? (
        <ResponsiveCardGrid>
          {filteredClasses.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header compact */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm lg:text-base truncate">{classItem.name}</h3>
                    <p className="text-xs text-gray-400">{classItem.categories_count} catégories</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(classItem.is_active)}
                </div>
              </div>
              
              {/* Description compacte */}
              <p className="text-gray-300 text-xs mb-3 line-clamp-2 leading-relaxed">{classItem.description}</p>
              
              {/* Footer avec actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">#{classItem.order}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => openDetailModal(classItem)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => openEditModal(classItem)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteClass(classItem)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </ResponsiveCardGrid>
      ) : (
        <div className="card-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="p-4 text-left text-gray-300">Classe</th>
                  <th className="p-4 text-left text-gray-300">Description</th>
                  <th className="p-4 text-left text-gray-300">Catégories</th>
                  <th className="p-4 text-left text-gray-300">Statut</th>
                  <th className="p-4 text-left text-gray-300">Ordre</th>
                  <th className="p-4 text-right text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem, index) => (
                  <motion.tr
                    key={classItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="font-medium text-white">{classItem.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300 text-sm line-clamp-1">{classItem.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400">{classItem.categories_count}</span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(classItem.is_active)}
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400">{classItem.order}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => openDetailModal(classItem)}
                          size="icon"
                          variant="ghost"
                          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openEditModal(classItem)}
                          size="icon"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-500/10 hover:text-green-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClass(classItem.id)}
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.count > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Affichage de {((currentPage - 1) * 20) + 1} à {Math.min(currentPage * 20, pagination.count)} sur {pagination.count} classes
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

      {/* Modal de création/modification améliorée */}
      <EnhancedModal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          resetForm();
        }}
        title={showCreateModal ? 'Créer une classe de catégorie' : 'Modifier la classe de catégorie'}
        description={showCreateModal ? 'Ajoutez une nouvelle classe pour organiser vos catégories' : 'Modifiez les informations de cette classe'}
        size="md"
      >

        <div className="space-y-6">
          <div>
            <Label className="text-white text-sm font-medium">Nom de la classe *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Arts & Culture"
              className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label className="text-white text-sm font-medium">Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description courte (max 200 caractères)..."
              className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.description.length}/200 caractères
            </p>
          </div>

          <div>
            <Label className="text-white text-sm font-medium">Ordre d'affichage</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              className="mt-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <Label className="text-white text-sm font-medium">Classe active</Label>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700/50">
          <Button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Annuler
          </Button>
          <Button 
            onClick={showCreateModal ? handleCreateClass : handleUpdateClass}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {showCreateModal ? 'Créer la classe' : 'Sauvegarder'}
          </Button>
        </div>
      </EnhancedModal>

      {/* Modal de détails améliorée */}
      <EnhancedModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Détails de la classe"
        description="Informations complètes sur cette classe de catégorie"
        size="md"
      >
        {selectedClass && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Tag className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">{selectedClass.name}</h4>
                <p className="text-gray-400">{selectedClass.categories_count} catégories</p>
              </div>
            </div>

            <div>
              <h5 className="text-white font-medium mb-2">Description</h5>
              <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                {selectedClass.description || 'Aucune description'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h5 className="text-white font-medium mb-2">Statut</h5>
                {getStatusBadge(selectedClass.is_active)}
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h5 className="text-white font-medium mb-2">Ordre d'affichage</h5>
                <p className="text-gray-300 text-lg font-semibold">#{selectedClass.order}</p>
              </div>
            </div>
          </div>
        )}
      </EnhancedModal>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setClassToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Supprimer la classe"
        message={`Êtes-vous sûr de vouloir supprimer la classe "${classToDelete?.name}" ? Cette action est irréversible et supprimera également toutes les catégories associées.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default CategoryClassesManagement;
