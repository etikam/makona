/**
 * Composant du profil candidat - Dashboard moderne et responsive
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  User, Edit3, Settings, Eye, EyeOff, Plus, Upload, 
  Award, Calendar, FileText, Image, Video, Music, 
  File, Globe, Facebook, Instagram, Youtube, Mail,
  Phone, MapPin, Shield, CheckCircle, XCircle, Clock,
  BarChart3, TrendingUp, Users, Star, ChevronRight,
  Save, X, Camera, Trash2, Download, RefreshCw,
  Heart, Trophy
} from 'lucide-react';
import CandidatureDetails from './CandidatureDetails';
import EditCandidatureModal from './EditCandidatureModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import candidateService from '@/services/candidateService';

const CandidateProfile = ({ user: currentUser, onLogout, onNavigate }) => {
  // États principaux
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  
  // États pour les modales
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCandidatureModal, setShowCandidatureModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // États pour les formulaires
  const [profileForm, setProfileForm] = useState({
    bio: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    website_url: ''
  });
  
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    country: '',
    profile_picture: null
  });
  
  const [candidatureForm, setCandidatureForm] = useState({
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
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // États pour la visibilité des mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // États pour les erreurs de validation des formulaires
  const [profileErrors, setProfileErrors] = useState({});
  const [userErrors, setUserErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // États pour les détails de candidature
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showCandidatureDetails, setShowCandidatureDetails] = useState(false);
  
  // États pour la modification de candidature
  const [editingCandidature, setEditingCandidature] = useState(null);
  const [showEditCandidature, setShowEditCandidature] = useState(false);

  // Chargement des données
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
      loadStats();
      loadCategories();
    } else {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
    }
  }, [currentUser]);


  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getDashboard();
      setDashboardData(data);
      
      // Pré-remplir les formulaires
      if (data.candidate_profile) {
        const profileData = {
          bio: data.candidate_profile.bio || '',
          facebook_url: data.candidate_profile.facebook_url || '',
          instagram_url: data.candidate_profile.instagram_url || '',
          youtube_url: data.candidate_profile.youtube_url || '',
          website_url: data.candidate_profile.website_url || ''
        };
        setProfileForm(profileData);
      }
      
      if (data.user) {
        setUserForm({
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          phone: data.user.phone || '',
          country: data.user.country || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
        toast({
          title: "Erreur",
        description: "Impossible de charger les données du profil",
          variant: "destructive"
        });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('🔄 Chargement des statistiques...');
      const data = await candidateService.getStats();
      console.log('📊 Statistiques chargées:', data);
      setStats(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await candidateService.getAvailableCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  // Fonction pour ouvrir la modale de profil et réinitialiser le formulaire
  const openProfileModal = () => {
    if (dashboardData?.candidate_profile) {
      const profileData = {
        bio: dashboardData.candidate_profile.bio || '',
        facebook_url: dashboardData.candidate_profile.facebook_url || '',
        instagram_url: dashboardData.candidate_profile.instagram_url || '',
        youtube_url: dashboardData.candidate_profile.youtube_url || '',
        website_url: dashboardData.candidate_profile.website_url || ''
      };
      setProfileForm(profileData);
    }
    // Réinitialiser les erreurs
    setProfileErrors({});
    setShowProfileModal(true);
  };

  // Fonction pour ouvrir la modale d'informations utilisateur
  const openUserModal = () => {
    if (dashboardData?.user) {
      const userData = {
        first_name: dashboardData.user.first_name || '',
        last_name: dashboardData.user.last_name || '',
        phone: dashboardData.user.phone || '',
        country: dashboardData.user.country || '',
        profile_picture: null
      };
      setUserForm(userData);
    }
    // Réinitialiser les erreurs
    setUserErrors({});
    setShowUserModal(true);
  };

  // Fonction pour ouvrir la modale de mot de passe et réinitialiser les erreurs
  const openPasswordModal = () => {
    setPasswordErrors({});
    setShowPasswordModal(true);
  };

  // Fonction pour ouvrir les détails d'une candidature
  const openCandidatureDetails = (candidature) => {
    setSelectedCandidature(candidature);
    setShowCandidatureDetails(true);
  };

  // Fonction pour fermer les détails de candidature
  const closeCandidatureDetails = () => {
    setSelectedCandidature(null);
    setShowCandidatureDetails(false);
  };

  // Fonction pour ouvrir la modification d'une candidature
  const openEditCandidature = (candidature) => {
    setEditingCandidature(candidature);
    setShowEditCandidature(true);
  };

  // Fonction pour fermer la modification de candidature
  const closeEditCandidature = () => {
    setEditingCandidature(null);
    setShowEditCandidature(false);
  };

  // Fonction appelée après modification réussie
  const handleCandidatureUpdateSuccess = () => {
    loadDashboardData(); // Recharger les données
    closeEditCandidature();
  };

  // Gestion des formulaires
  const handleProfileUpdate = async () => {
    try {
      await candidateService.updateProfile(profileForm);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès"
      });
      setShowProfileModal(false);
      await loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive"
      });
      }
  };

  const handleUserUpdate = async () => {
    try {
      await candidateService.updateUserProfile(userForm);
      toast({
        title: "Succès",
        description: "Informations mises à jour avec succès"
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
          variant: "destructive"
        });
      }
  };

  const handlePasswordChange = async () => {
    try {
      // Réinitialiser les erreurs
      setPasswordErrors({});
      
      await candidateService.changePassword(passwordForm);
      toast({
        title: "Succès",
        description: "Mot de passe modifié avec succès"
      });
      setShowPasswordModal(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      // Gérer les erreurs de validation
      if (error.message && error.message.includes('current_password')) {
        setPasswordErrors({ current_password: 'Le mot de passe actuel est incorrect.' });
      } else if (error.message && error.message.includes('new_password')) {
        setPasswordErrors({ new_password: 'Le nouveau mot de passe ne respecte pas les critères.' });
      } else if (error.message && error.message.includes('confirm_password')) {
        setPasswordErrors({ confirm_password: 'Les mots de passe ne correspondent pas.' });
      } else {
        // Erreur générale
        toast({
          title: "Erreur",
          description: "Impossible de modifier le mot de passe",
        variant: "destructive"
      });
      }
    }
  };

  const handleCandidatureCreate = async () => {
    try {
      await candidateService.createCandidature({
        category: candidatureForm.category,
        description: candidatureForm.description
      });
      toast({
        title: "Succès",
        description: "Candidature créée avec succès"
      });
      setShowCandidatureModal(false);
      setCandidatureForm({
        category: '',
        description: '',
        files: { photo: [], video: [], audio: [], portfolio: [], documents: [] }
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la candidature",
        variant: "destructive"
      });
    }
  };

  // Utilitaires
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'photo': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'portfolio': return <FileText className="w-4 h-4" />;
      case 'documents': return <File className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
  return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erreur de chargement</h2>
          <p className="text-gray-400 mb-4">Impossible de charger les données du profil</p>
          <Button onClick={loadDashboardData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
            </Button>
          </div>
      </div>
    );
  }

  const { user, candidate_profile, candidatures } = dashboardData || {};

  return (
    <>
      <Helmet>
        <title>Mon Profil - Makona Awards 2025</title>
        <meta name="description" content="Gérez votre profil et vos candidatures pour les Makona Awards 2025." />
      </Helmet>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30">
                  {user?.profile_picture_url || user?.profile_picture ? (
                    <img 
                      src={user.profile_picture_url || `http://localhost:8000/media/${user.profile_picture}`} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Erreur de chargement de l\'image:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-blue-100">@{user?.username}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={openProfileModal}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
            <Button
                  onClick={openPasswordModal}
              variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
                  <Shield className="w-4 h-4 mr-2" />
                  Mot de passe
            </Button>
          </div>
                </div>
              </div>
            </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Navigation tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'candidatures', label: 'Mes candidatures', icon: Award },
              { id: 'profile', label: 'Mon profil', icon: User },
              { id: 'settings', label: 'Paramètres', icon: Settings }
            ].map(tab => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Contenu des onglets */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
        <motion.div
                key="overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Statistiques */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Total candidatures</p>
                            <p className="text-2xl font-bold text-white">{stats.total_candidatures}</p>
                          </div>
                          <Award className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Catégories disponibles</p>
                            <p className="text-2xl font-bold text-white">{stats.categories_available || 0}</p>
                          </div>
                          <FileText className="w-8 h-8 text-indigo-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Taux de réussite</p>
                            <p className="text-2xl font-bold text-white">
                              {stats.total_candidatures > 0 
                                ? Math.round((stats.approved_candidatures / stats.total_candidatures) * 100)
                                : 0}%
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                  <div>
                            <p className="text-sm text-gray-400">Profil complet</p>
                            <p className="text-2xl font-bold text-white">{stats.profile_completion}%</p>
                          </div>
                          <User className="w-8 h-8 text-purple-500" />
                  </div>
                      </CardContent>
                    </Card>
                </div>
              )}
              
                {/* Activité récente */}
                {stats && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Dernière activité
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300">
                          {stats.last_activity 
                            ? new Date(stats.last_activity).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Aucune candidature'
                          }
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {stats.last_activity 
                            ? 'Dernière candidature soumise'
                            : 'Commencez par créer votre première candidature'
                          }
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Approuvées</span>
                            <span className="text-green-400 font-semibold">{stats.approved_candidatures}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">En attente</span>
                            <span className="text-yellow-400 font-semibold">{stats.pending_candidatures}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rejetées</span>
                            <span className="text-red-400 font-semibold">{stats.rejected_candidatures}</span>
                </div>
              </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Opportunités
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-white mb-2">{stats.categories_available || 0}</p>
                        <p className="text-gray-300">Catégories disponibles</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Explorez toutes les catégories pour maximiser vos chances
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Informations du profil */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Informations personnelles
                        </div>
            <Button
                          onClick={openUserModal}
                          size="sm"
              variant="outline"
                          className="text-xs"
            >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Modifier
            </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Photo de profil */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          {user?.profile_picture_url || user?.profile_picture ? (
                            <img 
                              src={user.profile_picture_url || `http://localhost:8000/media/${user.profile_picture}`} 
                              alt="Photo de profil" 
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
          </div>
                          )}
                        </div>
                <div>
                          <h3 className="text-white font-semibold text-lg">
                            {user?.first_name} {user?.last_name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {user?.user_type === 'candidate' ? 'Candidat' : 'Administrateur'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{user?.email}</span>
                </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{user?.phone || 'Non renseigné'}</span>
              </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{user?.country}</span>
            </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Réseaux sociaux
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {candidate_profile?.facebook_url && (
                <div className="flex items-center gap-3">
                          <Facebook className="w-4 h-4 text-blue-500" />
                          <a href={candidate_profile.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            Facebook
                          </a>
                  </div>
                      )}
                      {candidate_profile?.instagram_url && (
              <div className="flex items-center gap-3">
                          <Instagram className="w-4 h-4 text-pink-500" />
                          <a href={candidate_profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                            Instagram
                          </a>
                </div>
              )}
                      {candidate_profile?.youtube_url && (
              <div className="flex items-center gap-3">
                          <Youtube className="w-4 h-4 text-red-500" />
                          <a href={candidate_profile.youtube_url} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                            YouTube
                          </a>
                </div>
                      )}
                      {candidate_profile?.website_url && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-green-500" />
                          <a href={candidate_profile.website_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                            Site web
                          </a>
              </div>
                      )}
                      {!candidate_profile?.facebook_url && !candidate_profile?.instagram_url && 
                       !candidate_profile?.youtube_url && !candidate_profile?.website_url && (
                        <p className="text-gray-500 text-sm">Aucun réseau social renseigné</p>
                      )}
                    </CardContent>
                  </Card>
            </div>

                {/* Biographie */}
                {candidate_profile?.bio && (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Biographie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{candidate_profile.bio}</p>
                    </CardContent>
                  </Card>
                )}
        </motion.div>
            )}

            {activeTab === 'candidatures' && (
        <motion.div
                key="candidatures"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Mes candidatures</h2>
            <Button
                    onClick={() => setShowCandidatureModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
            >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle candidature
            </Button>
          </div>

                {candidatures && candidatures.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {candidatures.map((candidature) => (
                      <Card key={candidature.id} className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white">{candidature.category.name}</CardTitle>
                            <Badge className={`${getStatusColor(candidature.status)} text-white`}>
                              {candidature.status_display}
                            </Badge>
            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {candidature.description && (
                            <p className="text-gray-300 text-sm">{candidature.description}</p>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            Soumise le {new Date(candidature.submitted_at).toLocaleDateString('fr-FR')}
                          </div>

                          {/* Statistiques de performance */}
                          {candidature.status === 'approved' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                {/* Votes reçus */}
                                <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg p-3 border border-pink-500/30">
                                  <div className="flex items-center justify-center gap-2 mb-1">
                                    <Heart className="w-5 h-5 text-pink-400" />
                                    <span className="text-xl font-bold text-white">
                                      {candidature.vote_count || 0}
                                    </span>
                                  </div>
                                  <p className="text-xs text-pink-300 text-center">Votes reçus</p>
                                </div>

                                {/* Rang dans la catégorie */}
                                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-500/30">
                                  <div className="flex items-center justify-center gap-2 mb-1">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    <span className="text-xl font-bold text-white">
                                      #{candidature.ranking || 'N/A'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-yellow-300 text-center">Rang actuel</p>
                                </div>
                              </div>

                              {/* Indicateur de performance */}
                              {candidature.vote_count > 0 && (
                                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-2 border border-green-500/30">
                                  <div className="flex items-center justify-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    <p className="text-sm text-green-300">
                                      Excellente performance ! Votre candidature progresse bien
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Message pour candidatures en attente non publiées */}
                          {candidature.status === 'pending' && !candidature.published && (
                            <div className="py-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <p className="text-sm text-yellow-300">
                                  En attente d'approbation - Vous pouvez encore modifier votre candidature
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Message pour candidatures en attente publiées */}
                          {candidature.status === 'pending' && candidature.published && (
                            <div className="py-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                              <div className="flex items-center justify-center gap-2">
                                <Globe className="w-4 h-4 text-blue-400" />
                                <p className="text-sm text-blue-300">
                                  Publiée - Visible au public, modification non autorisée
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Message pour candidatures rejetées */}
                          {candidature.status === 'rejected' && (
                            <div className="py-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                              <div className="flex items-center justify-center gap-2">
                                <XCircle className="w-4 h-4 text-red-400" />
                                <p className="text-sm text-red-300">
                                  Candidature rejetée - Non éligible aux votes
                                </p>
                              </div>
                            </div>
                          )}

                          {candidature.files && candidature.files.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-400">Fichiers joints:</p>
                              <div className="flex flex-wrap gap-2">
                                {candidature.files.map((file) => (
                                  <div key={file.id} className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-xs">
                                    {getFileIcon(file.file_type)}
                                    <span className="text-gray-300">{file.file_type}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Boutons d'action */}
                          <div className="flex justify-end gap-2 pt-2">
                            {/* Bouton Modifier (seulement si en attente et non publiée) */}
                            {candidature.status === 'pending' && !candidature.published && (
                              <Button
                                onClick={() => openEditCandidature(candidature)}
                                variant="outline"
                                size="sm"
                                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                            )}
                            
                            {/* Bouton Détails */}
                            <Button
                              onClick={() => openCandidatureDetails(candidature)}
                              variant="outline"
                              size="sm"
                              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
              </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
            </div>
          ) : (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-12 text-center">
                      <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Aucune candidature</h3>
                      <p className="text-gray-400 mb-6">Vous n'avez pas encore soumis de candidature</p>
                      <Button
                        onClick={() => setShowCandidatureModal(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Créer ma première candidature
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
                <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white">Mon profil</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="first_name" className="text-gray-300">Prénom</Label>
                        <Input
                          id="first_name"
                          value={userForm.first_name}
                          onChange={(e) => setUserForm(prev => ({ ...prev, first_name: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                      <div>
                        <Label htmlFor="last_name" className="text-gray-300">Nom</Label>
                        <Input
                          id="last_name"
                          value={userForm.last_name}
                          onChange={(e) => setUserForm(prev => ({ ...prev, last_name: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                        <Input
                          id="phone"
                          value={userForm.phone}
                          onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                  </div>
                      <div>
                        <Label htmlFor="country" className="text-gray-300">Pays</Label>
                        <Select value={userForm.country} onValueChange={(value) => setUserForm(prev => ({ ...prev, country: value }))}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Sélectionner un pays" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="guinea">Guinée</SelectItem>
                            <SelectItem value="liberia">Libéria</SelectItem>
                            <SelectItem value="sierra_leone">Sierra Leone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleUserUpdate} className="w-full bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Biographie et réseaux</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="bio" className="text-gray-300">Biographie</Label>
                        <Textarea
                          id="bio"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Parlez-nous de vous..."
                          rows={4}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook_url" className="text-gray-300">Facebook</Label>
                        <Input
                          id="facebook_url"
                          value={profileForm.facebook_url}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, facebook_url: e.target.value }))}
                          placeholder="https://facebook.com/votre-profil"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                <div>
                        <Label htmlFor="instagram_url" className="text-gray-300">Instagram</Label>
                        <Input
                          id="instagram_url"
                          value={profileForm.instagram_url}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, instagram_url: e.target.value }))}
                          placeholder="https://instagram.com/votre-profil"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                </div>
                      <div>
                        <Label htmlFor="youtube_url" className="text-gray-300">YouTube</Label>
                        <Input
                          id="youtube_url"
                          value={profileForm.youtube_url}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, youtube_url: e.target.value }))}
                          placeholder="https://youtube.com/votre-chaine"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
              </div>
                      <div>
                        <Label htmlFor="website_url" className="text-gray-300">Site web</Label>
                        <Input
                          id="website_url"
                          value={profileForm.website_url}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, website_url: e.target.value }))}
                          placeholder="https://votre-site.com"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
            </div>
                      <Button onClick={handleProfileUpdate} className="w-full bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </CardContent>
                  </Card>
          </div>
        </motion.div>
            )}

            {activeTab === 'settings' && (
        <motion.div
                key="settings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white">Paramètres</h2>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Sécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">Modifiez votre mot de passe pour sécuriser votre compte</p>
            <Button
                      onClick={() => setShowPasswordModal(true)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
                      <Shield className="w-4 h-4 mr-2" />
                      Changer le mot de passe
            </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
                      </div>

        {/* Modales */}
        {/* Modal de création de candidature */}
        <AnimatePresence>
          {showCandidatureModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowCandidatureModal(false)}
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
                    onClick={() => setShowCandidatureModal(false)}
                    variant="ghost"
                    size="icon"
            >
                    <X className="w-4 h-4" />
            </Button>
                    </div>

                <div className="space-y-6">
                    <div>
                    <Label htmlFor="category" className="text-white">Catégorie *</Label>
                    <Select 
                      value={candidatureForm.category} 
                      onValueChange={(value) => {
                        setCandidatureForm(prev => ({ ...prev, category: value }));
                        const category = categories.find(cat => cat.id.toString() === value);
                        setSelectedCategory(category);
                      }}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span className="flex-1">{category.name}</span>
                              {category.category_class && (
                                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                  {category.category_class.name}
                                </Badge>
                              )}
            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={candidatureForm.description}
                      onChange={(e) => setCandidatureForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre candidature..."
                      rows={4}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  {selectedCategory && (
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Fichiers requis</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[
                          { key: 'photo', label: 'Photos', required: selectedCategory.requires_photo },
                          { key: 'video', label: 'Vidéos', required: selectedCategory.requires_video },
                          { key: 'audio', label: 'Audio', required: selectedCategory.requires_audio },
                          { key: 'portfolio', label: 'Portfolio', required: selectedCategory.requires_portfolio },
                          { key: 'documents', label: 'Documents', required: selectedCategory.requires_documents }
                        ].filter(fileType => fileType.required).map(fileType => (
                          <div key={fileType.key} className="space-y-2">
                            <Label className="text-white flex items-center gap-2 text-sm font-medium">
                              <span className="text-lg">{getFileIcon(fileType.key)}</span>
                              {fileType.label} *
                            </Label>
                            
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors bg-gray-800/30">
                              <input
                                type="file"
                                multiple
                                accept={fileType.key === 'photo' ? 'image/*' : 
                                       fileType.key === 'video' ? 'video/*' :
                                       fileType.key === 'audio' ? 'audio/*' :
                                       fileType.key === 'portfolio' ? '.pdf,.doc,.docx,.txt' :
                                       '.pdf,.doc,.docx,.txt'}
                                onChange={(e) => {
                                  const files = Array.from(e.target.files);
                                  setCandidatureForm(prev => ({
                                    ...prev,
                                    files: { ...prev.files, [fileType.key]: files }
                                  }));
                                }}
                                className="hidden"
                                id={`file-${fileType.key}`}
                              />
                              <label
                                htmlFor={`file-${fileType.key}`}
                                className="cursor-pointer flex flex-col items-center justify-center py-4"
                              >
                                <div className="text-3xl mb-2 text-gray-400">
                                  {getFileIcon(fileType.key)}
                                </div>
                                <p className="text-gray-300 text-sm text-center mb-1">
                                  Cliquez pour sélectionner des {fileType.label.toLowerCase()}
                                </p>
                                <p className="text-gray-500 text-xs text-center">
                                  {fileType.key === 'photo' ? 'JPG, PNG, GIF' :
                                   fileType.key === 'video' ? 'MP4, AVI, MOV' :
                                   fileType.key === 'audio' ? 'MP3, WAV, M4A' :
                                   fileType.key === 'portfolio' ? 'PDF, DOC, DOCX, TXT' :
                                   'PDF, DOC, DOCX, TXT'}
                                </p>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                    </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                    onClick={() => setShowCandidatureModal(false)}
                      variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleCandidatureCreate}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!candidatureForm.category}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la candidature
                    </Button>
                  </div>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de changement de mot de passe */}
        <AnimatePresence>
          {showPasswordModal && (
                <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowPasswordModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Changer le mot de passe</h3>
                  <Button
                    onClick={() => setShowPasswordModal(false)}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>
            </div>

                <div className="space-y-4">
                    <div>
                    <Label htmlFor="current_password" className="text-white">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.current_password}
                        onChange={(e) => {
                          setPasswordForm(prev => ({ ...prev, current_password: e.target.value }));
                          // Effacer l'erreur quand l'utilisateur tape
                          if (passwordErrors.current_password) {
                            setPasswordErrors(prev => ({ ...prev, current_password: '' }));
                          }
                        }}
                        className={`bg-gray-800 text-white pr-10 ${
                          passwordErrors.current_password 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-red-400 text-sm mt-1">{passwordErrors.current_password}</p>
                    )}
                    </div>
                  <div>
                    <Label htmlFor="new_password" className="text-white">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.new_password}
                        onChange={(e) => {
                          setPasswordForm(prev => ({ ...prev, new_password: e.target.value }));
                          // Effacer l'erreur quand l'utilisateur tape
                          if (passwordErrors.new_password) {
                            setPasswordErrors(prev => ({ ...prev, new_password: '' }));
                          }
                        }}
                        className={`bg-gray-800 text-white pr-10 ${
                          passwordErrors.new_password 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new_password && (
                      <p className="text-red-400 text-sm mt-1">{passwordErrors.new_password}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirm_password" className="text-white">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirm_password}
                        onChange={(e) => {
                          setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }));
                          // Effacer l'erreur quand l'utilisateur tape
                          if (passwordErrors.confirm_password) {
                            setPasswordErrors(prev => ({ ...prev, confirm_password: '' }));
                          }
                        }}
                        className={`bg-gray-800 text-white pr-10 ${
                          passwordErrors.confirm_password 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
            </div>
                    {passwordErrors.confirm_password && (
                      <p className="text-red-400 text-sm mt-1">{passwordErrors.confirm_password}</p>
                    )}
                  </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    onClick={() => setShowPasswordModal(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handlePasswordChange}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                      </div>
                    </div>
        </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de modification des informations utilisateur */}
        <AnimatePresence>
          {showUserModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowUserModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Modifier les informations</h3>
                  <Button
                    onClick={() => setShowUserModal(false)}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>
      </div>

                <div className="space-y-6">
                  {/* Photo de profil */}
                  <div>
                    <Label className="text-white text-sm font-medium mb-3 block">
                      Photo de profil
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {userForm.profile_picture ? (
                          <img 
                            src={URL.createObjectURL(userForm.profile_picture)} 
                            alt="Photo de profil" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                          />
                        ) : user?.profile_picture_url || user?.profile_picture ? (
                          <img 
                            src={user.profile_picture_url || `http://localhost:8000/media/${user.profile_picture}`} 
                            alt="Photo de profil" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                            onError={(e) => {
                              console.error('Erreur de chargement de l\'image:', e.target.src);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-400" />
    </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setUserForm(prev => ({ ...prev, profile_picture: file }));
                            }
                          }}
                          className="hidden"
                          id="profile-picture"
                        />
                        <label
                          htmlFor="profile-picture"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                          Changer la photo
                        </label>
                        <p className="text-gray-400 text-xs mt-1">
                          JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                    </div>
                  </div>

                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name" className="text-white">Prénom *</Label>
                      <Input
                        id="first_name"
                        value={userForm.first_name}
                        onChange={(e) => {
                          setUserForm(prev => ({ ...prev, first_name: e.target.value }));
                          if (userErrors.first_name) {
                            setUserErrors(prev => ({ ...prev, first_name: '' }));
                          }
                        }}
                        className={`bg-gray-800 text-white mt-1 ${
                          userErrors.first_name ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {userErrors.first_name && (
                        <p className="text-red-400 text-sm mt-1">{userErrors.first_name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="text-white">Nom *</Label>
                      <Input
                        id="last_name"
                        value={userForm.last_name}
                        onChange={(e) => {
                          setUserForm(prev => ({ ...prev, last_name: e.target.value }));
                          if (userErrors.last_name) {
                            setUserErrors(prev => ({ ...prev, last_name: '' }));
                          }
                        }}
                        className={`bg-gray-800 text-white mt-1 ${
                          userErrors.last_name ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {userErrors.last_name && (
                        <p className="text-red-400 text-sm mt-1">{userErrors.last_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-white">Téléphone</Label>
                      <Input
                        id="phone"
                        value={userForm.phone}
                        onChange={(e) => {
                          setUserForm(prev => ({ ...prev, phone: e.target.value }));
                          if (userErrors.phone) {
                            setUserErrors(prev => ({ ...prev, phone: '' }));
                          }
                        }}
                        className={`bg-gray-800 text-white mt-1 ${
                          userErrors.phone ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="+224 123 456 789"
                      />
                      {userErrors.phone && (
                        <p className="text-red-400 text-sm mt-1">{userErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-white">Pays *</Label>
                      <Select
                        value={userForm.country}
                        onValueChange={(value) => {
                          setUserForm(prev => ({ ...prev, country: value }));
                          if (userErrors.country) {
                            setUserErrors(prev => ({ ...prev, country: '' }));
                          }
                        }}
                      >
                        <SelectTrigger className={`bg-gray-800 text-white mt-1 ${
                          userErrors.country ? 'border-red-500' : 'border-gray-600'
                        }`}>
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guinea">Guinée</SelectItem>
                          <SelectItem value="liberia">Libéria</SelectItem>
                          <SelectItem value="sierra_leone">Sierra Leone</SelectItem>
                        </SelectContent>
                      </Select>
                      {userErrors.country && (
                        <p className="text-red-400 text-sm mt-1">{userErrors.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                    onClick={() => setShowUserModal(false)}
                      variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleUserUpdate}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!userForm.first_name || !userForm.last_name || !userForm.country}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                    </Button>
                  </div>
                </motion.div>
        </motion.div>
          )}
        </AnimatePresence>

        {/* Modal des détails de candidature */}
        <AnimatePresence>
          {showCandidatureDetails && (
            <CandidatureDetails
              candidature={selectedCandidature}
              onClose={closeCandidatureDetails}
              onEdit={openEditCandidature}
            />
          )}
        </AnimatePresence>

        {/* Modal de modification de candidature */}
        <AnimatePresence>
          {showEditCandidature && (
            <EditCandidatureModal
              candidature={editingCandidature}
              onClose={closeEditCandidature}
              onSuccess={handleCandidatureUpdateSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CandidateProfile;
