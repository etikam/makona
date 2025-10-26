/**
 * Composant de gestion des catégories avec types de médias (Admin) - Design moderne
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, Plus, Edit, Trash2, Save, X, Eye, EyeOff,
  Image, Video, FileText, Music, File, Settings, Palette,
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle,
  Search, Filter, BarChart3, Users, Calendar, TrendingUp,
  Grid3X3, List, MoreVertical, Star, Clock, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import categoryService from '@/services/categoryService';
import apiService from '@/services/api';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    withMedia: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color_gradient: '',
    is_active: true,
    requires_photo: true,
    requires_video: false,
    requires_portfolio: false,
    requires_audio: false,
    requires_documents: false,
    max_video_duration: null,
    max_audio_duration: null
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // Utiliser l'endpoint admin pour avoir toutes les données
      const response = await apiService.get('/categories/admin/');
      console.log('Categories loaded:', response);
      
      // Gérer la réponse selon le format (array ou objet avec pagination)
      const categoriesData = Array.isArray(response) ? response : response.results || response;
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
      calculateStats(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      
      // Messages d'erreur spécifiques côté client
      let errorMessage = "Erreur serveur";
      if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        errorMessage = "Impossible de se connecter au serveur";
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMessage = "Session expirée, veuillez vous reconnecter";
      } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        errorMessage = "Accès non autorisé";
      } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        errorMessage = "Service temporairement indisponible";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer les statistiques
  const calculateStats = (categoriesData) => {
    const total = categoriesData.length;
    const active = categoriesData.filter(cat => cat.is_active).length;
    const inactive = total - active;
    const withMedia = categoriesData.filter(cat => 
      cat.requires_photo || cat.requires_video || cat.requires_audio || 
      cat.requires_portfolio || cat.requires_documents
    ).length;
    
    setStats({ total, active, inactive, withMedia });
  };

  // Fonction de recherche
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCategories(categories);
      return;
    }
    
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(term.toLowerCase()) ||
      category.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  // Effet pour la recherche
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, categories]);

  const handleCreateCategory = async () => {
    try {
      await categoryService.createCategory(formData);
      toast({
        title: "Succès",
        description: "Catégorie créée avec succès"
      });
      setShowCreateModal(false);
      resetForm();
      loadCategories();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await categoryService.updateCategory(editingCategory.id, formData);
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès"
      });
      setShowEditModal(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès"
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color_gradient: '',
      is_active: true,
      requires_photo: true,
      requires_video: false,
      requires_portfolio: false,
      requires_audio: false,
      requires_documents: false,
      max_video_duration: null,
      max_audio_duration: null
    });
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color_gradient: category.color_gradient,
      is_active: category.is_active,
      requires_photo: category.requires_photo,
      requires_video: category.requires_video,
      requires_portfolio: category.requires_portfolio,
      requires_audio: category.requires_audio,
      requires_documents: category.requires_documents || false,
      max_video_duration: category.max_video_duration,
      max_audio_duration: category.max_audio_duration
    });
    setShowEditModal(true);
  };

  const getMediaTypeIcon = (type) => {
    const icons = {
      photo: Image,
      video: Video,
      portfolio: FileText,
      audio: Music,
      documents: File
    };
    return icons[type] || FileText;
  };

  const getMediaTypeColor = (type) => {
    const colors = {
      photo: 'bg-blue-500',
      video: 'bg-red-500',
      portfolio: 'bg-green-500',
      audio: 'bg-purple-500',
      documents: 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getRequiredFileTypes = (category) => {
    const types = [];
    if (category.requires_photo) types.push('photo');
    if (category.requires_video) types.push('video');
    if (category.requires_portfolio) types.push('portfolio');
    if (category.requires_audio) types.push('audio');
    if (category.requires_documents) types.push('documents');
    
    return types;
  };

  const predefinedGradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-red-500 to-pink-600',
    'from-purple-500 to-indigo-600',
    'from-pink-500 to-rose-600',
    'from-orange-500 to-red-600'
  ];

  const predefinedIcons = [
    '🎵', '💃', '🎬', '📸', '📚', '🎨', '🎭', '👗', '👨‍🍳', '🏃‍♂️', '💻', '🎓'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header moderne */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestion des Catégories</h1>
            <p className="text-gray-400">Configurez les catégories et leurs types de médias requis</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 text-lg font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle catégorie
          </Button>
        </div>

        {/* Barre de recherche et contrôles */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 h-12"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-12 w-12"
            >
              <Grid3X3 className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-12 w-12"
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Actives</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Inactives</p>
              <p className="text-2xl font-bold text-white">{stats.inactive}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Avec Médias</p>
              <p className="text-2xl font-bold text-white">{stats.withMedia}</p>
            </div>
            <Star className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Liste des catégories - Vue moderne */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredCategories) ? filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header moderne */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color_gradient} flex items-center justify-center text-2xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={category.is_active ? "default" : "secondary"}
                        className={category.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(category)}
                    className="h-10 w-10 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="h-10 w-10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                {category.description}
              </p>

              {/* Types de médias requis - Design moderne */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Types de médias requis
                </h4>
                
                {getRequiredFileTypes(category).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {getRequiredFileTypes(category).map((type) => {
                      const Icon = getMediaTypeIcon(type);
                      return (
                        <div
                          key={type}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl ${getMediaTypeColor(type)} text-white text-sm font-medium backdrop-blur-sm`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{type}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                    <span className="text-gray-400 text-sm">Aucun type de média requis</span>
                  </div>
                )}
              </div>

              {/* Durées max - Design moderne */}
              {(category.requires_video && category.max_video_duration) || (category.requires_audio && category.max_audio_duration) ? (
                <div className="mt-4 space-y-2">
                  {category.requires_video && category.max_video_duration && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm font-medium">
                        Vidéo max: {category.max_video_duration}s
                      </span>
                    </div>
                  )}
                  {category.requires_audio && category.max_audio_duration && (
                    <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 text-sm font-medium">
                        Audio max: {category.max_audio_duration}s
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Erreur de chargement des catégories</p>
              <p className="text-gray-500 text-sm mt-2">Format de données inattendu</p>
            </div>
          </div>
        )}
        </div>
      ) : (
        /* Vue liste */
        <div className="space-y-4">
          {Array.isArray(filteredCategories) ? filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color_gradient} flex items-center justify-center text-xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRequiredFileTypes(category).map((type) => {
                      const Icon = getMediaTypeIcon(type);
                      return (
                        <div
                          key={type}
                          className={`w-8 h-8 rounded-lg ${getMediaTypeColor(type)} flex items-center justify-center`}
                          title={type}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      );
                    })}
                  </div>
                  
                  <Badge 
                    variant={category.is_active ? "default" : "secondary"}
                    className={category.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(category)}
                      className="h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Erreur de chargement des catégories</p>
                <p className="text-gray-500 text-sm mt-2">Format de données inattendu</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal moderne de création/édition */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {showCreateModal ? 'Nouvelle Catégorie' : 'Modifier la Catégorie'}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {showCreateModal ? 'Créez une nouvelle catégorie pour les candidatures' : 'Modifiez les paramètres de cette catégorie'}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Section 1: Informations de base */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    Informations de base
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white font-medium">Nom de la catégorie *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Musique"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon" className="text-white font-medium">Icône</Label>
                      <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Sélectionner une icône" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="none">Aucune icône</SelectItem>
                          {predefinedIcons.map(icon => (
                            <SelectItem key={icon} value={icon} className="text-white hover:bg-gray-700">
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="description" className="text-white font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description de la catégorie..."
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Section 2: Apparence */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Apparence
                  </h4>
                  
                  <div className="space-y-4">
                    <Label className="text-white font-medium">Dégradé de couleur</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {predefinedGradients.map(gradient => (
                        <button
                          key={gradient}
                          onClick={() => setFormData(prev => ({ ...prev, color_gradient: gradient }))}
                          className={`w-full h-12 rounded-lg bg-gradient-to-r ${gradient} transition-all duration-200 ${
                            formData.color_gradient === gradient 
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' 
                              : 'hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Types de médias requis - Multi Select Moderne */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    Types de médias requis
                  </h4>
                  
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm mb-4">
                      Sélectionnez les types de médias que les candidats doivent obligatoirement fournir pour cette catégorie
                    </p>
                    
                    {/* Multi Select Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          id: 'photo',
                          label: 'Photo',
                          description: 'Images et photos',
                          icon: Image,
                          color: 'blue',
                          bgColor: 'bg-blue-500/20',
                          iconColor: 'text-blue-400',
                          borderColor: 'border-blue-500/30'
                        },
                        {
                          id: 'video',
                          label: 'Vidéo',
                          description: 'Clips et démos',
                          icon: Video,
                          color: 'red',
                          bgColor: 'bg-red-500/20',
                          iconColor: 'text-red-400',
                          borderColor: 'border-red-500/30'
                        },
                        {
                          id: 'portfolio',
                          label: 'Portfolio',
                          description: 'Travaux et projets',
                          icon: FileText,
                          color: 'green',
                          bgColor: 'bg-green-500/20',
                          iconColor: 'text-green-400',
                          borderColor: 'border-green-500/30'
                        },
                        {
                          id: 'audio',
                          label: 'Audio',
                          description: 'Musique et sons',
                          icon: Music,
                          color: 'purple',
                          bgColor: 'bg-purple-500/20',
                          iconColor: 'text-purple-400',
                          borderColor: 'border-purple-500/30'
                        },
                        {
                          id: 'documents',
                          label: 'Documents',
                          description: 'PDF, Word, textes',
                          icon: File,
                          color: 'orange',
                          bgColor: 'bg-orange-500/20',
                          iconColor: 'text-orange-400',
                          borderColor: 'border-orange-500/30'
                        }
                      ].map((mediaType) => {
                        const Icon = mediaType.icon;
                        const isSelected = formData[`requires_${mediaType.id}`];
                        
                        return (
                          <motion.div
                            key={mediaType.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                              ${isSelected 
                                ? `${mediaType.bgColor} ${mediaType.borderColor} ring-2 ring-${mediaType.color}-500/50` 
                                : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                              }
                            `}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                [`requires_${mediaType.id}`]: !prev[`requires_${mediaType.id}`]
                              }));
                            }}
                          >
                            {/* Checkbox visuel */}
                            <div className="absolute top-3 right-3">
                              <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                ${isSelected 
                                  ? `bg-${mediaType.color}-500 border-${mediaType.color}-500` 
                                  : 'border-gray-400'
                                }
                              `}>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Contenu */}
                            <div className="flex items-center gap-3 pr-8">
                              <div className={`w-12 h-12 ${mediaType.bgColor} rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${mediaType.iconColor}`} />
                              </div>
                              <div>
                                <h5 className="text-white font-medium">{mediaType.label}</h5>
                                <p className="text-gray-400 text-sm">{mediaType.description}</p>
                              </div>
                            </div>

                            {/* Indicateur de sélection */}
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`absolute inset-0 ${mediaType.bgColor} rounded-xl opacity-20 pointer-events-none`}
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Résumé des sélections */}
                    <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                      <h5 className="text-white font-medium mb-2">Types sélectionnés :</h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'photo', label: 'Photo', color: 'blue' },
                          { id: 'video', label: 'Vidéo', color: 'red' },
                          { id: 'portfolio', label: 'Portfolio', color: 'green' },
                          { id: 'audio', label: 'Audio', color: 'purple' },
                          { id: 'documents', label: 'Documents', color: 'orange' }
                        ].map((mediaType) => {
                          if (formData[`requires_${mediaType.id}`]) {
                            return (
                              <Badge 
                                key={mediaType.id}
                                className={`bg-${mediaType.color}-500/20 text-${mediaType.color}-400 border-${mediaType.color}-500/30`}
                              >
                                {mediaType.label}
                              </Badge>
                            );
                          }
                          return null;
                        })}
                        {!Object.values([
                          'requires_photo', 'requires_video', 'requires_portfolio', 
                          'requires_audio', 'requires_documents'
                        ]).some(key => formData[key]) && (
                          <span className="text-gray-500 text-sm">Aucun type sélectionné</span>
                        )}
                      </div>
                    </div>

                    {/* Durée max vidéo */}
                    {formData.requires_video && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20"
                      >
                        <Label htmlFor="max_video_duration" className="text-white font-medium">
                          Durée maximale vidéo (secondes)
                        </Label>
                        <Input
                          id="max_video_duration"
                          type="number"
                          value={formData.max_video_duration || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, max_video_duration: parseInt(e.target.value) || null }))}
                          placeholder="Ex: 300 (5 minutes)"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-2"
                        />
                        <p className="text-gray-400 text-xs mt-1">
                          Laissez vide pour aucune limite de durée (max: 3600s = 1h)
                        </p>
                      </motion.div>
                    )}

                    {/* Durée max audio */}
                    {formData.requires_audio && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
                      >
                        <Label htmlFor="max_audio_duration" className="text-white font-medium">
                          Durée maximale audio (secondes)
                        </Label>
                        <Input
                          id="max_audio_duration"
                          type="number"
                          value={formData.max_audio_duration || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, max_audio_duration: parseInt(e.target.value) || null }))}
                          placeholder="Ex: 180 (3 minutes)"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-2"
                        />
                        <p className="text-gray-400 text-xs mt-1">
                          Laissez vide pour aucune limite de durée (max: 1800s = 30min)
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Section 4: Statut */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_active" className="text-white font-medium text-lg cursor-pointer">Catégorie active</Label>
                      <p className="text-gray-400 text-sm mt-1">Les candidats peuvent postuler à cette catégorie</p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-6 border-t border-gray-700">
                  <Button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    variant="outline"
                    className="px-8 py-2 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={showCreateModal ? handleCreateCategory : handleUpdateCategory}
                    className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {showCreateModal ? 'Créer la catégorie' : 'Sauvegarder les modifications'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoriesManagement;