/**
 * Composant de gestion des utilisateurs (Admin)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Plus, Edit, Trash2, Eye, 
  UserCheck, UserX, Mail, Phone, MapPin, Calendar,
  ChevronLeft, ChevronRight, Download, RefreshCw, X, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import adminService from '@/services/adminService';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    user_type: 'all',
    is_verified: 'all',
    is_active: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
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
    // Champs du profil candidat
    bio: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    website_url: ''
  });

  useEffect(() => {
    loadUsers();
  }, [currentPage, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: 20,
        ...filters
      };
      
      // Nettoyer les paramètres de filtre
      if (params.user_type === 'all') delete params.user_type;
      if (params.is_verified === 'all') delete params.is_verified;
      if (params.is_active === 'all') delete params.is_active;
      
      const response = await adminService.getUsers(params);
      setUsers(response.results || response);
      setPagination(response.pagination || {});
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
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

  const handleDeleteUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès"
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = async () => {
    try {
      if (!editingUser) return;

      // Validation des champs requis
      if (!formData.email || !formData.username || !formData.first_name || !formData.last_name) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }

      await adminService.updateUser(editingUser.id, formData);
      toast({
        title: "Succès",
        description: "Utilisateur modifié avec succès"
      });
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email || '',
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      country: user.country || 'guinea',
      user_type: user.user_type || 'candidate',
      password: '', // Ne pas pré-remplir le mot de passe
      password_confirm: '',
      is_verified: user.is_verified || false,
      is_active: user.is_active !== false,
      // Champs du profil candidat
      bio: user.candidate_profile?.bio || '',
      facebook_url: user.candidate_profile?.facebook_url || '',
      instagram_url: user.candidate_profile?.instagram_url || '',
      youtube_url: user.candidate_profile?.youtube_url || '',
      website_url: user.candidate_profile?.website_url || ''
    });
    setShowEditModal(true);
  };

  const handleExportCSV = async () => {
    try {
      const blob = await adminService.exportUsersCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'utilisateurs.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Succès",
        description: "Export CSV téléchargé"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (user) => {
    if (!user.is_active) {
      return <Badge variant="destructive">Inactif</Badge>;
    }
    if (!user.is_verified) {
      return <Badge variant="secondary">Non vérifié</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Actif</Badge>;
  };

  const getUserTypeBadge = (userType) => {
    const colors = {
      'candidate': 'bg-blue-500',
      'admin': 'bg-purple-500'
    };
    return (
      <Badge className={colors[userType] || 'bg-gray-500'}>
        {userType === 'candidate' ? 'Candidat' : 'Admin'}
      </Badge>
    );
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
      // Champs du profil candidat
      bio: '',
      facebook_url: '',
      instagram_url: '',
      youtube_url: '',
      website_url: ''
    });
  };

  const handleCreateUser = async () => {
    try {
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

      await adminService.createUser(formData);
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès"
      });
      setShowCreateModal(false);
      resetForm();
      loadUsers();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'utilisateur",
        variant: "destructive"
      });
    }
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Gestion des Utilisateurs</h2>
          <p className="text-gray-400 text-sm sm:text-base">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        
        {/* Boutons responsive */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="btn-secondary text-xs sm:text-sm"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Exporter CSV</span>
            <span className="xs:hidden">CSV</span>
          </Button>
          <Button
            onClick={loadUsers}
            variant="outline"
            size="sm"
            className="btn-secondary text-xs sm:text-sm"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Actualiser</span>
            <span className="xs:hidden">↻</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
            className="btn-primary text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Nouvel Utilisateur</span>
            <span className="xs:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* Filtres responsive */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.user_type} onValueChange={(value) => handleFilterChange('user_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Type d'utilisateur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="candidate">Candidat</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
          
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

      {/* Tableau des utilisateurs responsive */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des utilisateurs...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-800/50">
                <tr className="border-b border-gray-700/50">
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-300">Utilisateur</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-300 hidden sm:table-cell">Type</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-300">Statut</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-300 hidden lg:table-cell">Candidatures</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-300 hidden md:table-cell">Date d'inscription</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-black">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white text-sm sm:text-base truncate">{user.full_name}</p>
                          <p className="text-xs sm:text-sm text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">
                      {getUserTypeBadge(user.user_type)}
                    </td>
                    <td className="p-3 sm:p-4">
                      {getStatusBadge(user)}
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell">
                      <span className="text-gray-400 text-sm">{user.candidatures_count || 0}</span>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      <span className="text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 h-8 w-8 p-0"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          onClick={() => openEditModal(user)}
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-500/10 hover:text-green-300 h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

      {/* Pagination responsive */}
      {pagination.count > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            <span className="hidden sm:inline">Affichage de {((currentPage - 1) * 20) + 1} à {Math.min(currentPage * 20, pagination.count)} sur {pagination.count} utilisateurs</span>
            <span className="sm:hidden">{pagination.count} utilisateurs</span>
          </p>
          <div className="flex justify-center sm:justify-end gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.previous}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Précédent</span>
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.next}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <span className="hidden sm:inline mr-1">Suivant</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de création d'utilisateur */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              resetForm();
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
                <h3 className="text-xl font-bold text-white">Créer un nouvel utilisateur</h3>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Email *</label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Nom d'utilisateur *</label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="nom_utilisateur"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Prénom *</label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Prénom"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Nom *</label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Nom"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Téléphone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+224 123 456 789"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Type d'utilisateur *</label>
                    <Select value={formData.user_type} onValueChange={(value) => setFormData(prev => ({ ...prev, user_type: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candidate">Candidat</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mots de passe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Mot de passe *</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Mot de passe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Confirmer le mot de passe *</label>
                    <Input
                      type="password"
                      value={formData.password_confirm}
                      onChange={(e) => setFormData(prev => ({ ...prev, password_confirm: e.target.value }))}
                      placeholder="Confirmer le mot de passe"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Statuts */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_verified"
                      checked={formData.is_verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="is_verified" className="text-white text-sm">Vérifié</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-white text-sm">Actif</label>
                  </div>
                </div>

                {/* Champs du profil candidat - Affichage conditionnel */}
                {formData.user_type === 'candidate' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                  >
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informations du profil candidat
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-white text-sm font-medium">Biographie</label>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Décrivez votre parcours, vos compétences..."
                          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-sm font-medium">Facebook</label>
                          <Input
                            value={formData.facebook_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                            placeholder="https://facebook.com/votre-profil"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium">Instagram</label>
                          <Input
                            value={formData.instagram_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                            placeholder="https://instagram.com/votre-profil"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-sm font-medium">YouTube</label>
                          <Input
                            value={formData.youtube_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                            placeholder="https://youtube.com/c/votre-chaine"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium">Site web</label>
                          <Input
                            value={formData.website_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                            placeholder="https://votre-site.com"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button onClick={handleCreateUser} className="btn-primary">
                  Créer l'utilisateur
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'édition d'utilisateur */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowEditModal(false);
              setEditingUser(null);
              resetForm();
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
                <h3 className="text-xl font-bold text-white">Modifier l'utilisateur</h3>
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Email *</label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Nom d'utilisateur *</label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="nom_utilisateur"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Prénom *</label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Prénom"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Nom *</label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Nom"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Téléphone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+224 123 456 789"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Pays *</label>
                    <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guinea">Guinée</SelectItem>
                        <SelectItem value="senegal">Sénégal</SelectItem>
                        <SelectItem value="mali">Mali</SelectItem>
                        <SelectItem value="ivory_coast">Côte d'Ivoire</SelectItem>
                        <SelectItem value="burkina_faso">Burkina Faso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium">Type d'utilisateur *</label>
                    <Select value={formData.user_type} onValueChange={(value) => setFormData(prev => ({ ...prev, user_type: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candidate">Candidat</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_verified"
                        checked={formData.is_verified}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                        className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="is_verified" className="text-white text-sm">Vérifié</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="is_active" className="text-white text-sm">Actif</label>
                    </div>
                  </div>
                </div>

                {/* Champs du profil candidat */}
                {formData.user_type === 'candidate' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">Informations du profil candidat</h4>
                    </div>
                    
                    <div>
                      <label className="text-white text-sm font-medium">Biographie</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Décrivez-vous en quelques mots..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium">Facebook</label>
                        <Input
                          value={formData.facebook_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                          placeholder="https://facebook.com/votre-profil"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium">Instagram</label>
                        <Input
                          value={formData.instagram_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                          placeholder="https://instagram.com/votre-profil"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium">YouTube</label>
                        <Input
                          value={formData.youtube_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                          placeholder="https://youtube.com/c/votre-chaine"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium">Site web</label>
                        <Input
                          value={formData.website_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                          placeholder="https://votre-site.com"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button onClick={handleEditUser} className="btn-primary">
                  Modifier l'utilisateur
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de visualisation d'utilisateur */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowUserModal(false);
              setSelectedUser(null);
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
                <h3 className="text-xl font-bold text-white">Détails de l'utilisateur</h3>
                <Button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* En-tête avec avatar et infos principales */}
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-black">
                      {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">{selectedUser.full_name}</h4>
                    <p className="text-gray-400">@{selectedUser.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getUserTypeBadge(selectedUser.user_type)}
                      {getStatusBadge(selectedUser)}
                    </div>
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Informations de contact</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{selectedUser.email}</p>
                      </div>
                    </div>
                    
                    {selectedUser.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <Phone className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Téléphone</p>
                          <p className="text-white">{selectedUser.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm text-gray-400">Pays</p>
                        <p className="text-white capitalize">{selectedUser.country?.replace('_', ' ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Date d'inscription</p>
                        <p className="text-white">{new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profil candidat */}
                {selectedUser.user_type === 'candidate' && selectedUser.candidate_profile && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Profil candidat</h5>
                    
                    {selectedUser.candidate_profile.bio && (
                      <div className="p-4 bg-gray-800/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-2">Biographie</p>
                        <p className="text-white">{selectedUser.candidate_profile.bio}</p>
                      </div>
                    )}
                    
                    {/* Réseaux sociaux */}
                    {(selectedUser.candidate_profile.facebook_url || 
                      selectedUser.candidate_profile.instagram_url || 
                      selectedUser.candidate_profile.youtube_url || 
                      selectedUser.candidate_profile.website_url) && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-400">Réseaux sociaux</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedUser.candidate_profile.facebook_url && (
                            <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">f</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-400">Facebook</p>
                                <a 
                                  href={selectedUser.candidate_profile.facebook_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm truncate block"
                                >
                                  {selectedUser.candidate_profile.facebook_url}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {selectedUser.candidate_profile.instagram_url && (
                            <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">ig</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-400">Instagram</p>
                                <a 
                                  href={selectedUser.candidate_profile.instagram_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm truncate block"
                                >
                                  {selectedUser.candidate_profile.instagram_url}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {selectedUser.candidate_profile.youtube_url && (
                            <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">YT</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-400">YouTube</p>
                                <a 
                                  href={selectedUser.candidate_profile.youtube_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm truncate block"
                                >
                                  {selectedUser.candidate_profile.youtube_url}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {selectedUser.candidate_profile.website_url && (
                            <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">W</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-400">Site web</p>
                                <a 
                                  href={selectedUser.candidate_profile.website_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm truncate block"
                                >
                                  {selectedUser.candidate_profile.website_url}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Statistiques */}
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Statistiques</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-400">{selectedUser.candidatures_count || 0}</p>
                      <p className="text-sm text-gray-400">Candidatures</p>
                    </div>
                    <div className="p-4 bg-gray-800/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-400">{selectedUser.is_verified ? 'Oui' : 'Non'}</p>
                      <p className="text-sm text-gray-400">Vérifié</p>
                    </div>
                    <div className="p-4 bg-gray-800/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-400">{selectedUser.is_active ? 'Actif' : 'Inactif'}</p>
                      <p className="text-sm text-gray-400">Statut</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                  variant="outline"
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                    openEditModal(selectedUser);
                  }}
                  className="btn-primary"
                >
                  Modifier
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersManagement;
