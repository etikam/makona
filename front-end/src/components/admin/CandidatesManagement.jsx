/**
 * Composant de gestion des candidats (Admin) - CRUD complet
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Plus, Edit, Trash2, Eye, 
  UserCheck, UserX, Mail, Phone, MapPin, Calendar,
  ChevronLeft, ChevronRight, Download, RefreshCw,
  UserPlus, FileText, Award, Settings, X, CheckSquare,
  List, Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import adminService from '@/services/adminService';
import categoryService from '@/services/categoryService';
import CandidaturesManagement from './CandidaturesManagement';
import AdminCandidaturesManagement from './AdminCandidaturesManagement';

const CandidatesManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list', 'validation' ou 'candidatures'
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    is_verified: 'all',
    is_active: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCandidatureModal, setShowCandidatureModal] = useState(false);
  const [candidatureData, setCandidatureData] = useState({
    category: '',
    description: '',
    files: {
      photo: [],
      video: [],
      audio: [],
      portfolio: [],
      documents: []
    }
  });
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    country: 'guinea',
    user_type: 'candidate',
    password: '',
    password_confirm: '',
    is_verified: false,
    is_active: true,
    bio: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    website_url: ''
  });
  
  // États pour les erreurs de validation des formulaires
  const [formErrors, setFormErrors] = useState({});
  const [candidatureErrors, setCandidatureErrors] = useState({});

  useEffect(() => {
    loadCandidates();
  }, [currentPage, filters]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: 20,
        user_type: 'candidate',
        ...filters
      };
      
      // Nettoyer les paramètres de filtre
      if (params.is_verified === 'all') delete params.is_verified;
      if (params.is_active === 'all') delete params.is_active;
      
      const response = await adminService.getUsers(params);
      setCandidates(response.results || response);
      setPagination(response.pagination || {});
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidats",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const handleCreateCandidate = async () => {
    // Validation des mots de passe
    if (formData.password !== formData.password_confirm) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      });
      return;
    }

    try {
      // Préparer toutes les données (utilisateur + profil candidat)
      const userData = {
        email: formData.email,
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        country: formData.country,
        user_type: formData.user_type,
        password: formData.password,
        password_confirm: formData.password_confirm,
        is_verified: formData.is_verified,
        is_active: formData.is_active,
        // Données du profil candidat
        bio: formData.bio,
        facebook_url: formData.facebook_url,
        instagram_url: formData.instagram_url,
        youtube_url: formData.youtube_url,
        website_url: formData.website_url
      };

      // Créer l'utilisateur (le profil candidat sera créé automatiquement côté backend)
      await adminService.createUser(userData);

      toast({
        title: "Succès",
        description: "Candidat créé avec succès"
      });
      setShowCreateModal(false);
      resetForm();
      loadCandidates();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le candidat",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCandidate = async () => {
    try {
      await adminService.updateUser(selectedCandidate.id, formData);
      toast({
        title: "Succès",
        description: "Candidat mis à jour avec succès"
      });
      setShowEditModal(false);
      setSelectedCandidate(null);
      resetForm();
      loadCandidates();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le candidat",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
      return;
    }

    try {
      await adminService.deleteUser(candidateId);
      toast({
        title: "Succès",
        description: "Candidat supprimé avec succès"
      });
      loadCandidates();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le candidat",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      phone: '',
      country: 'guinea',
      user_type: 'candidate',
      password: '',
      password_confirm: '',
      is_verified: false,
      is_active: true,
      bio: '',
      facebook_url: '',
      instagram_url: '',
      youtube_url: '',
      website_url: ''
    });
  };

  const openEditModal = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      email: candidate.email,
      username: candidate.username,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      phone: candidate.phone || '',
      country: candidate.country,
      user_type: candidate.user_type,
      is_verified: candidate.is_verified,
      is_active: candidate.is_active,
      bio: candidate.candidate_profile?.bio || '',
      facebook_url: candidate.candidate_profile?.facebook_url || '',
      instagram_url: candidate.candidate_profile?.instagram_url || '',
      youtube_url: candidate.candidate_profile?.youtube_url || '',
      website_url: candidate.candidate_profile?.website_url || ''
    });
    setShowEditModal(true);
  };

  const openDetailModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetailModal(true);
  };

  // Fonctions pour les candidatures
  const loadCategories = async () => {
    try {
      // Charger les catégories depuis l'endpoint admin pour avoir toutes les informations
      const response = await categoryService.getCategories();
      // Les catégories doivent inclure file_requirements, required_file_types, awards, etc.
      const categoriesData = response.results || response;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    }
  };

  const resetCandidatureForm = () => {
    setCandidatureData({
      category: '',
      description: '',
      files: {
        photo: [],
        video: [],
        audio: [],
        portfolio: [],
        documents: []
      }
    });
  };

  const handleCreateCandidature = async () => {
    // Réinitialiser les erreurs
    setCandidatureErrors({});
    
    // Debug
    console.log('Données de candidature avant validation:', candidatureData);
    console.log('Catégories disponibles:', categories.map(c => ({ id: c.id, name: c.name })));
    
    // Validation côté client
    const errors = {};
    
    // Vérifier la catégorie (doit être non vide et non null)
    const categoryValue = candidatureData.category;
    console.log('Valeur de catégorie:', categoryValue, 'Type:', typeof categoryValue);
    
    if (!categoryValue || categoryValue === '' || categoryValue === null || categoryValue === undefined) {
      errors.category = "Veuillez sélectionner une catégorie";
    } else {
      // Vérifier que la catégorie existe dans la liste
      const categoryExists = categories.some(cat => 
        cat.id.toString() === categoryValue.toString() || 
        cat.id === parseInt(categoryValue, 10)
      );
      
      if (!categoryExists) {
        console.error('Catégorie non trouvée dans la liste:', categoryValue);
        errors.category = "Catégorie invalide";
      }
    }
    
    // Vérifier la description (optionnelle mais si fournie, ne doit pas être vide)
    if (candidatureData.description && !candidatureData.description.trim()) {
      errors.description = "La description ne peut pas être vide si elle est fournie";
    }
    
    // Vérifier les fichiers requis
    const selectedCategory = categories.find(cat => cat.id.toString() === candidatureData.category);
    if (selectedCategory) {
      // Utiliser required_file_types si disponible, sinon utiliser les flags individuels
      const requiredTypes = selectedCategory.required_file_types || [];
      const fileRequirements = {
        photo: selectedCategory.requires_photo || requiredTypes.includes('photo'),
        video: selectedCategory.requires_video || requiredTypes.includes('video'),
        audio: selectedCategory.requires_audio || requiredTypes.includes('audio'),
        portfolio: selectedCategory.requires_portfolio || requiredTypes.includes('portfolio'),
        documents: selectedCategory.requires_documents || requiredTypes.includes('documents')
      };

      if (fileRequirements.photo && (!candidatureData.files.photo || candidatureData.files.photo.length === 0)) {
        errors.photo = "Des photos sont requises pour cette catégorie";
      }
      if (fileRequirements.video && (!candidatureData.files.video || candidatureData.files.video.length === 0)) {
        errors.video = "Des vidéos sont requises pour cette catégorie";
      }
      if (fileRequirements.audio && (!candidatureData.files.audio || candidatureData.files.audio.length === 0)) {
        errors.audio = "Des fichiers audio sont requis pour cette catégorie";
      }
      if (fileRequirements.portfolio && (!candidatureData.files.portfolio || candidatureData.files.portfolio.length === 0)) {
        errors.portfolio = "Un portfolio est requis pour cette catégorie";
      }
      if (fileRequirements.documents && (!candidatureData.files.documents || candidatureData.files.documents.length === 0)) {
        errors.documents = "Des documents sont requis pour cette catégorie";
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setCandidatureErrors(errors);
      return;
    }

    try {
      // Convertir la catégorie en nombre si c'est une chaîne
      const categoryId = typeof candidatureData.category === 'string' 
        ? parseInt(candidatureData.category, 10) 
        : candidatureData.category;

      // Vérifier que la conversion a réussi
      if (isNaN(categoryId)) {
        setCandidatureErrors({ category: "Catégorie invalide" });
        return;
      }

      const candidatureDataToSend = {
        candidate: selectedCandidate.id,
        category: categoryId,
        ...(candidatureData.description && candidatureData.description.trim() && {
          description: candidatureData.description.trim()
        })
      };

      // Créer la candidature
      const candidature = await adminService.createCandidature(candidatureDataToSend);

      // Ajouter les fichiers si il y en a
      if (selectedCategory) {
        const fileTypes = ['photo', 'video', 'audio', 'portfolio', 'documents'];
        
        for (const fileType of fileTypes) {
          const files = candidatureData.files[fileType];
          if (files && files.length > 0) {
            for (const file of files) {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('file_type', fileType);
              
              await adminService.addCandidatureFile(candidature.id, formData);
            }
          }
        }
      }

      toast({
        title: "Succès",
        description: "Candidature créée avec succès"
      });

      setShowCandidatureModal(false);
      resetCandidatureForm();
      loadCandidates(); // Recharger pour mettre à jour les statistiques
    } catch (error) {
      console.error('Erreur création candidature:', error);
      
      // Gérer les erreurs de validation du serveur
      // Les erreurs Django REST Framework peuvent être dans error.data ou error.response.data
      let errorMessage = error.message || '';
      let serverErrors = {};
      
      // Essayer de récupérer les erreurs détaillées du serveur
      const errorData = error.data || (error.response && error.response.data);
      
      if (errorData && typeof errorData === 'object') {
        // Erreurs de champ spécifiques (format Django REST Framework)
        Object.keys(errorData).forEach(field => {
          if (field === 'non_field_errors' || field === 'detail' || field === 'message') {
            return; // Ignorer les champs spéciaux
          }
          
          if (Array.isArray(errorData[field])) {
            serverErrors[field] = errorData[field][0] || errorData[field].join(', ');
          } else if (typeof errorData[field] === 'string') {
            serverErrors[field] = errorData[field];
          } else if (typeof errorData[field] === 'object') {
            // Gérer les erreurs imbriquées
            const nestedErrors = Object.values(errorData[field]).flat();
            if (nestedErrors.length > 0) {
              serverErrors[field] = nestedErrors[0];
            }
          }
        });
        
        // Erreurs générales (non_field_errors)
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors[0];
        }
      }
      
      // Utiliser les erreurs du serveur si disponibles, sinon les erreurs génériques
      if (Object.keys(serverErrors).length > 0) {
        setCandidatureErrors(serverErrors);
        // Afficher aussi un toast pour les erreurs importantes
        if (serverErrors.category && (serverErrors.category.includes('déjà') || serverErrors.category.includes('unique'))) {
          toast({
            title: "Candidature déjà existante",
            description: serverErrors.category,
            variant: "destructive"
          });
        }
      } else if (errorMessage) {
        // Erreurs génériques basées sur le message
        if (errorMessage.includes('ensemble unique') || errorMessage.includes('unique') || errorMessage.includes('déjà')) {
          setCandidatureErrors({ 
            category: "Ce candidat a déjà une candidature pour cette catégorie. Veuillez choisir une autre catégorie."
          });
          toast({
            title: "Candidature déjà existante",
            description: "Ce candidat a déjà une candidature pour cette catégorie. Veuillez choisir une autre catégorie.",
            variant: "destructive"
          });
        } else if (errorMessage.includes('file_type') || errorMessage.includes('fichier')) {
          setCandidatureErrors({ files: errorMessage });
        } else if (errorMessage.includes('category') || errorMessage.includes('catégorie')) {
          setCandidatureErrors({ category: errorMessage });
        } else if (errorMessage.includes('description')) {
          setCandidatureErrors({ description: errorMessage });
        } else if (errorMessage.includes('candidat') || errorMessage.includes('candidate')) {
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur",
            description: errorMessage || "Impossible de créer la candidature",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer la candidature",
          variant: "destructive"
        });
      }
    }
  };

  const handleCategoryChange = (categoryId) => {
    setCandidatureData(prev => ({ 
      ...prev, 
      category: categoryId,
      files: {
        photo: [],
        video: [],
        audio: [],
        portfolio: [],
        documents: []
      }
    }));
  };

  const handleFileChange = (fileType, files) => {
    setCandidatureData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: files
      }
    }));
  };

  const getFileIcon = (fileType) => {
    const icons = {
      photo: '📷',
      video: '🎥',
      audio: '🎵',
      portfolio: '📁',
      documents: '📄'
    };
    return icons[fileType] || '📄';
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

  const openCandidatureModal = (candidate = null) => {
    // Si un candidat est fourni, l'utiliser, sinon utiliser selectedCandidate
    if (candidate) {
      setSelectedCandidate(candidate);
    }
    
    if (!selectedCandidate && !candidate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un candidat",
        variant: "destructive"
      });
      return;
    }
    
    setCandidatureErrors({});
    setShowCandidatureModal(true);
    loadCategories();
  };

  const getStatusBadge = (candidate) => {
    if (!candidate.is_active) {
      return <Badge variant="destructive">Inactif</Badge>;
    }
    if (!candidate.is_verified) {
      return <Badge variant="secondary">Non vérifié</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Actif</Badge>;
  };

  const countries = [
    { value: 'guinea', label: 'Guinée' },
    { value: 'liberia', label: 'Libéria' },
    { value: 'sierra_leone', label: 'Sierra Leone' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* En-tête avec sous-onglets */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Gestion des Candidats</h2>
            <p className="text-gray-400 text-sm sm:text-base">Gérez les candidats et validez leurs candidatures</p>
          </div>
          
          {/* Boutons responsive */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              onClick={() => adminService.exportUsersCSV({ user_type: 'candidate', ...filters })}
              variant="outline"
              size="sm"
              className="btn-secondary text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Exporter CSV</span>
              <span className="xs:hidden">CSV</span>
            </Button>
            <Button
              onClick={loadCandidates}
              variant="outline"
              size="sm"
              className="btn-secondary text-xs sm:text-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Actualiser</span>
              <span className="xs:hidden">↻</span>
            </Button>
            {activeSubTab === 'list' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                size="sm"
                className="btn-primary text-xs sm:text-sm"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Nouveau Candidat</span>
                <span className="xs:hidden">Nouveau</span>
              </Button>
            )}
          </div>
        </div>

        {/* Sous-onglets responsive */}
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-sm ${
              activeSubTab === 'list'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Liste des Candidats</span>
          </button>
          <button
            onClick={() => setActiveSubTab('validation')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-sm ${
              activeSubTab === 'validation'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <CheckSquare className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Validation Candidatures</span>
          </button>
          <button
            onClick={() => setActiveSubTab('candidatures')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-sm ${
              activeSubTab === 'candidatures'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Candidatures</span>
          </button>
        </div>
      </div>

      {/* Contenu conditionnel selon le sous-onglet */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Filtres */}
            <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un candidat..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filters.is_verified} onValueChange={(value) => handleFilterChange('is_verified', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut de vérification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="true">Vérifié</SelectItem>
                    <SelectItem value="false">Non vérifié</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.is_active} onValueChange={(value) => handleFilterChange('is_active', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut actif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="true">Actif</SelectItem>
                    <SelectItem value="false">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

      {/* Tableau des candidats */}
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des candidats...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun candidat trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4">Candidat</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Candidatures</th>
                  <th className="p-4">Date d'inscription</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{candidate.full_name}</p>
                          <p className="text-sm text-gray-400">@{candidate.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-300">{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-300">{candidate.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {countries.find(c => c.value === candidate.country)?.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(candidate)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">{candidate.candidatures_count || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">
                          {new Date(candidate.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => openCandidatureModal(candidate)}
                          size="icon"
                          variant="ghost"
                          className="text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                          title="Créer une candidature"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openDetailModal(candidate)}
                          size="icon"
                          variant="ghost"
                          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openEditModal(candidate)}
                          size="icon"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-500/10 hover:text-green-300"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          title="Supprimer"
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
        )}
      </div>

            {/* Pagination */}
            {pagination.count > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  Affichage de {((currentPage - 1) * 20) + 1} à {Math.min(currentPage * 20, pagination.count)} sur {pagination.count} candidats
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
          </motion.div>
        ) : activeSubTab === 'validation' ? (
          <motion.div
            key="validation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <CandidaturesManagement />
          </motion.div>
        ) : (
          <motion.div
            key="candidatures"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AdminCandidaturesManagement />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création/édition */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {showCreateModal ? 'Nouveau Candidat' : 'Modifier le Candidat'}
                </h3>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="candidat@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-white">Nom d'utilisateur *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="nom_utilisateur"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-white">Prénom *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-white">Nom *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+224 123 456 789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-white">Pays *</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Champs de mot de passe (seulement pour la création) */}
                {showCreateModal && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password" className="text-white">Mot de passe *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Mot de passe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password_confirm" className="text-white">Confirmer le mot de passe *</Label>
                      <Input
                        id="password_confirm"
                        type="password"
                        value={formData.password_confirm}
                        onChange={(e) => setFormData(prev => ({ ...prev, password_confirm: e.target.value }))}
                        placeholder="Confirmer le mot de passe"
                      />
                    </div>
                  </div>
                )}

                {/* Profil candidat */}
                <div>
                  <Label htmlFor="bio" className="text-white">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Présentez-vous en quelques mots..."
                    rows={3}
                  />
                </div>

                {/* Réseaux sociaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook_url" className="text-white">Facebook</Label>
                    <Input
                      id="facebook_url"
                      value={formData.facebook_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_url" className="text-white">Instagram</Label>
                    <Input
                      id="instagram_url"
                      value={formData.instagram_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="youtube_url" className="text-white">YouTube</Label>
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url" className="text-white">Site web</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                      placeholder="https://monsite.com"
                    />
                  </div>
                </div>

                {/* Statuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_verified" className="text-white">Email vérifié</Label>
                    <Switch
                      id="is_verified"
                      checked={formData.is_verified}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_verified: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active" className="text-white">Compte actif</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={showCreateModal ? handleCreateCandidate : handleUpdateCandidate}
                    className="btn-primary"
                  >
                    {showCreateModal ? 'Créer' : 'Sauvegarder'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de détails */}
      <AnimatePresence>
        {showDetailModal && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Détails du Candidat</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowDetailModal(false)}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Informations personnelles */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {selectedCandidate.first_name?.[0]}{selectedCandidate.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{selectedCandidate.full_name}</h4>
                    <p className="text-gray-400">@{selectedCandidate.username}</p>
                    {getStatusBadge(selectedCandidate)}
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-white">Contact</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{selectedCandidate.email}</span>
                    </div>
                    {selectedCandidate.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{selectedCandidate.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        {countries.find(c => c.value === selectedCandidate.country)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Biographie */}
                {selectedCandidate.candidate_profile?.bio && (
                  <div className="space-y-3">
                    <h5 className="font-semibold text-white">Biographie</h5>
                    <p className="text-gray-300">{selectedCandidate.candidate_profile.bio}</p>
                  </div>
                )}

                {/* Réseaux sociaux */}
                {(selectedCandidate.candidate_profile?.facebook_url || 
                  selectedCandidate.candidate_profile?.instagram_url || 
                  selectedCandidate.candidate_profile?.youtube_url || 
                  selectedCandidate.candidate_profile?.website_url) && (
                  <div className="space-y-3">
                    <h5 className="font-semibold text-white">Réseaux sociaux</h5>
                    <div className="space-y-2">
                      {selectedCandidate.candidate_profile.facebook_url && (
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400">Facebook:</span>
                          <a href={selectedCandidate.candidate_profile.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            {selectedCandidate.candidate_profile.facebook_url}
                          </a>
                        </div>
                      )}
                      {selectedCandidate.candidate_profile.instagram_url && (
                        <div className="flex items-center gap-3">
                          <span className="text-pink-400">Instagram:</span>
                          <a href={selectedCandidate.candidate_profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">
                            {selectedCandidate.candidate_profile.instagram_url}
                          </a>
                        </div>
                      )}
                      {selectedCandidate.candidate_profile.youtube_url && (
                        <div className="flex items-center gap-3">
                          <span className="text-red-400">YouTube:</span>
                          <a href={selectedCandidate.candidate_profile.youtube_url} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                            {selectedCandidate.candidate_profile.youtube_url}
                          </a>
                        </div>
                      )}
                      {selectedCandidate.candidate_profile.website_url && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">Site web:</span>
                          <a href={selectedCandidate.candidate_profile.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">
                            {selectedCandidate.candidate_profile.website_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-white">Statistiques</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Candidatures</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{selectedCandidate.candidatures_count || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400">Membre depuis</span>
                      </div>
                      <p className="text-sm text-white">
                        {new Date(selectedCandidate.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setShowDetailModal(false)}
                    variant="outline"
                  >
                    Fermer
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      openCandidatureModal(selectedCandidate);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle candidature
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedCandidate);
                    }}
                    className="btn-primary"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création de candidature */}
      <AnimatePresence>
        {showCandidatureModal && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCandidatureModal(false);
              resetCandidatureForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Nouvelle candidature</h3>
                <Button
                  onClick={() => {
                    setShowCandidatureModal(false);
                    resetCandidatureForm();
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Informations du candidat */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Candidat</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {selectedCandidate.first_name?.[0]}{selectedCandidate.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{selectedCandidate.full_name}</p>
                      <p className="text-sm text-gray-400">@{selectedCandidate.username}</p>
                    </div>
                  </div>
                </div>

                {/* Formulaire de candidature */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category" className="text-white">Catégorie *</Label>
                    <Select 
                      value={candidatureData.category || ''} 
                      onValueChange={(value) => {
                        console.log('Catégorie sélectionnée:', value, 'Type:', typeof value);
                        handleCategoryChange(value);
                        // Effacer l'erreur quand l'utilisateur sélectionne
                        setCandidatureErrors(prev => ({ ...prev, category: '' }));
                      }}
                    >
                      <SelectTrigger className={candidatureErrors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.is_active).map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span className="flex-1">{category.name}</span>
                              {category.category_class && (
                                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                  {category.category_class.name || category.category_class_name}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {candidatureErrors.category && (
                      <p className="text-red-400 text-sm mt-1">{candidatureErrors.category}</p>
                    )}
                  </div>

                  {/* Informations de la catégorie sélectionnée */}
                  {candidatureData.category && (() => {
                    const selectedCategory = categories.find(cat => cat.id.toString() === candidatureData.category);
                    if (!selectedCategory) return null;

                    const awards = [];
                    if (selectedCategory.awards_trophy) awards.push({ type: 'trophy', label: '🏆 Trophée', color: 'text-yellow-400' });
                    if (selectedCategory.awards_certificate) awards.push({ type: 'certificate', label: '📜 Satisfecit', color: 'text-blue-400' });
                    if (selectedCategory.awards_monetary) awards.push({ type: 'monetary', label: '💰 Primes monétaires', color: 'text-green-400' });
                    if (selectedCategory.awards_plaque) awards.push({ type: 'plaque', label: '🪧 Plaque commémorative', color: 'text-purple-400' });

                    return (
                      <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-blue-400" />
                          <h4 className="text-lg font-semibold text-white">Informations de la catégorie</h4>
                        </div>
                        
                        {/* Description */}
                        {selectedCategory.description && (
                          <p className="text-sm text-gray-300">{selectedCategory.description}</p>
                        )}

                        {/* Types de prix */}
                        {awards.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Types de prix attribués :</p>
                            <div className="flex flex-wrap gap-2">
                              {awards.map((award, idx) => (
                                <Badge key={idx} variant="outline" className={`${award.color} border-current`}>
                                  {award.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Exigences de fichiers */}
                        {selectedCategory.required_file_types && selectedCategory.required_file_types.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Fichiers requis :</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedCategory.required_file_types.map((fileType, idx) => (
                                <Badge key={idx} variant="outline" className="text-yellow-300 border-yellow-300/50">
                                  {getFileIcon(fileType)} {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Limites de durée */}
                        {(selectedCategory.max_video_duration || selectedCategory.max_audio_duration) && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Limites de durée :</p>
                            <div className="space-y-1">
                              {selectedCategory.max_video_duration && (
                                <p className="text-xs text-gray-300">📹 Vidéo max : {Math.floor(selectedCategory.max_video_duration / 60)} min</p>
                              )}
                              {selectedCategory.max_audio_duration && (
                                <p className="text-xs text-gray-300">🎵 Audio max : {Math.floor(selectedCategory.max_audio_duration / 60)} min</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={candidatureData.description}
                      onChange={(e) => {
                        setCandidatureData(prev => ({ ...prev, description: e.target.value }));
                        // Effacer l'erreur quand l'utilisateur tape
                        if (candidatureErrors.description) {
                          setCandidatureErrors(prev => ({ ...prev, description: '' }));
                        }
                      }}
                      placeholder="Décrivez votre candidature..."
                      rows={4}
                      className={candidatureErrors.description ? 'border-red-500' : ''}
                    />
                    {candidatureErrors.description && (
                      <p className="text-red-400 text-sm mt-1">{candidatureErrors.description}</p>
                    )}
                  </div>
                </div>

                {/* Champs de fichiers selon la catégorie sélectionnée */}
                {candidatureData.category && (() => {
                  const selectedCategory = categories.find(cat => cat.id.toString() === candidatureData.category);
                  if (!selectedCategory) return null;

                  // Utiliser required_file_types si disponible, sinon utiliser les flags individuels
                  const requiredTypes = selectedCategory.required_file_types || [];
                  const fileRequirements = {
                    photo: selectedCategory.requires_photo || requiredTypes.includes('photo'),
                    video: selectedCategory.requires_video || requiredTypes.includes('video'),
                    audio: selectedCategory.requires_audio || requiredTypes.includes('audio'),
                    portfolio: selectedCategory.requires_portfolio || requiredTypes.includes('portfolio'),
                    documents: selectedCategory.requires_documents || requiredTypes.includes('documents')
                  };

                  const fileTypes = [
                    { key: 'photo', label: 'Photos', required: fileRequirements.photo },
                    { key: 'video', label: 'Vidéos', required: fileRequirements.video },
                    { key: 'audio', label: 'Audio', required: fileRequirements.audio },
                    { key: 'portfolio', label: 'Portfolio', required: fileRequirements.portfolio },
                    { key: 'documents', label: 'Documents', required: fileRequirements.documents }
                  ].filter(fileType => fileType.required);

                  if (fileTypes.length === 0) return null;

                  // Extensions autorisées selon le type
                  const allowedExtensions = {
                    photo: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'],
                    video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
                    audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
                    portfolio: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'rar', '7z'],
                    documents: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx']
                  };

                  const getAcceptString = (fileType) => {
                    const extensions = allowedExtensions[fileType] || [];
                    if (fileType === 'photo') return 'image/*';
                    if (fileType === 'video') return 'video/*';
                    if (fileType === 'audio') return 'audio/*';
                    return extensions.map(ext => `.${ext}`).join(',');
                  };

                  return (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                        Fichiers requis
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {fileTypes.map(fileType => (
                          <div key={fileType.key} className="space-y-3">
                            <Label className="text-white flex items-center gap-2 text-sm font-medium">
                              <span className="text-lg">{getFileIcon(fileType.key)}</span>
                              {fileType.label} *
                            </Label>
                            
                            <div className={`border-2 border-dashed rounded-lg p-4 hover:border-gray-500 transition-colors bg-gray-800/30 ${
                              candidatureErrors[fileType.key] ? 'border-red-500' : 'border-gray-600'
                            }`}>
                              <input
                                type="file"
                                multiple
                                accept={getAcceptString(fileType.key)}
                                onChange={(e) => {
                                  handleFileChange(fileType.key, Array.from(e.target.files));
                                  // Effacer l'erreur quand l'utilisateur sélectionne des fichiers
                                  if (candidatureErrors[fileType.key]) {
                                    setCandidatureErrors(prev => ({ ...prev, [fileType.key]: '' }));
                                  }
                                }}
                                className="hidden"
                                id={`file-${fileType.key}`}
                              />
                              <label
                                htmlFor={`file-${fileType.key}`}
                                className="cursor-pointer flex flex-col items-center justify-center py-4"
                              >
                                <div className={`text-3xl mb-2 ${getFileTypeColor(fileType.key)}`}>
                                  {getFileIcon(fileType.key)}
                                </div>
                                <p className="text-gray-300 text-sm text-center mb-1">
                                  Cliquez pour sélectionner des {fileType.label.toLowerCase()}
                                </p>
                                <p className="text-gray-500 text-xs text-center">
                                  {allowedExtensions[fileType.key]?.map(ext => ext.toUpperCase()).join(', ') || 'Tous formats'}
                                </p>
                                {/* Afficher la limite de durée si applicable */}
                                {fileType.key === 'video' && selectedCategory.max_video_duration && (
                                  <p className="text-orange-400 text-xs text-center mt-1">
                                    Durée max : {Math.floor(selectedCategory.max_video_duration / 60)} min
                                  </p>
                                )}
                                {fileType.key === 'audio' && selectedCategory.max_audio_duration && (
                                  <p className="text-orange-400 text-xs text-center mt-1">
                                    Durée max : {Math.floor(selectedCategory.max_audio_duration / 60)} min
                                  </p>
                                )}
                              </label>
                            </div>
                            
                            {candidatureErrors[fileType.key] && (
                              <p className="text-red-400 text-sm">{candidatureErrors[fileType.key]}</p>
                            )}
                            
                            {/* Affichage des fichiers sélectionnés */}
                            {candidatureData.files[fileType.key] && candidatureData.files[fileType.key].length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-400 font-medium">
                                  {candidatureData.files[fileType.key].length} fichier(s) sélectionné(s)
                                </p>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {candidatureData.files[fileType.key].map((file, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
                                      <span className={`text-lg ${getFileTypeColor(fileType.key)}`}>
                                        {getFileIcon(fileType.key)}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-300 truncate font-medium">
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {(file.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowCandidatureModal(false);
                    resetCandidatureForm();
                  }}
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateCandidature}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la candidature
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

// Component cleaned up - no more CreateCandidatureModal references
export default CandidatesManagement;
