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
import CandidaturesManagement from './CandidaturesManagement';

const CandidatesManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' ou 'validation'
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Gestion des Candidats</h2>
            <p className="text-gray-400">Gérez les candidats et validez leurs candidatures</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => adminService.exportUsersCSV({ user_type: 'candidate', ...filters })}
              variant="outline"
              className="btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
            <Button
              onClick={loadCandidates}
              variant="outline"
              className="btn-secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            {activeSubTab === 'list' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Nouveau Candidat
              </Button>
            )}
          </div>
        </div>

        {/* Sous-onglets */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSubTab === 'list'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="font-medium">Liste des Candidats</span>
          </button>
          <button
            onClick={() => setActiveSubTab('validation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSubTab === 'validation'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="font-medium">Validation Candidatures</span>
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
            <div className="card-glass p-6">
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
      <div className="card-glass overflow-hidden">
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
                          onClick={() => openDetailModal(candidate)}
                          size="icon"
                          variant="ghost"
                          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openEditModal(candidate)}
                          size="icon"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-500/10 hover:text-green-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCandidate(candidate.id)}
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
        ) : (
          <motion.div
            key="validation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <CandidaturesManagement />
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
              className="card-glass p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
              className="card-glass p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

    </motion.div>
  );
};

// Component cleaned up - no more CreateCandidatureModal references
export default CandidatesManagement;
