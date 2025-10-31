/**
 * Composant de gestion des paramètres de la plateforme (Admin)
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Clock, Image, Users, Award, Globe, 
  Save, X, Plus, Edit, Trash2, Upload, RefreshCw,
  AlertCircle, CheckCircle, Calendar, Mail, Phone,
  Facebook, Instagram, Twitter, Youtube, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import settingsService from '@/services/settingsService';

const SettingsManagement = () => {
  const [activeSection, setActiveSection] = useState('countdown');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // États pour les paramètres
  const [settings, setSettings] = useState({
    countdown_enabled: true,
    countdown_target_date: null,
    hero_carousel_enabled: true,
    hero_carousel_auto_play: true,
    hero_carousel_interval: 5000,
    site_title: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    linkedin_url: '',
  });
  
  // États pour les sous-sections
  const [carouselImages, setCarouselImages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [hallOfFame, setHallOfFame] = useState([]);
  
  // États pour les modals
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showHallOfFameModal, setShowHallOfFameModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  useEffect(() => {
    loadAllData();
  }, []);
  
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSettings(),
        loadCarouselImages(),
        loadTeamMembers(),
        loadHallOfFame()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  const loadCarouselImages = async () => {
    try {
      const data = await settingsService.getCarouselImages();
      setCarouselImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading carousel images:', error);
    }
  };
  
  const loadTeamMembers = async () => {
    try {
      const data = await settingsService.getAllTeamMembers();
      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };
  
  const loadHallOfFame = async () => {
    try {
      const data = await settingsService.getAllHallOfFame();
      setHallOfFame(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading hall of fame:', error);
    }
  };
  
  const handleSaveSettings = async (section = null, localData = null) => {
    setSaving(true);
    try {
      if (section === 'countdown') {
        // Sauvegarder uniquement le chronomètre
        // Utiliser localData si fourni, sinon utiliser settings
        const dataToSave = localData || {
          countdown_enabled: settings.countdown_enabled,
          countdown_target_date: settings.countdown_target_date
        };
        
        await settingsService.updateCountdown({
          countdown_enabled: dataToSave.countdown_enabled,
          countdown_target_date: dataToSave.countdown_target_date
        });
        toast({
          title: "Succès",
          description: "Chronomètre enregistré avec succès",
        });
      } else if (section === 'general') {
        // Sauvegarder uniquement les paramètres généraux
        await settingsService.updateGeneralSettings({
          site_title: settings.site_title,
          site_description: settings.site_description,
          contact_email: settings.contact_email,
          contact_phone: settings.contact_phone,
          facebook_url: settings.facebook_url,
          instagram_url: settings.instagram_url,
          twitter_url: settings.twitter_url,
          youtube_url: settings.youtube_url,
          linkedin_url: settings.linkedin_url
        });
        toast({
          title: "Succès",
          description: "Paramètres généraux enregistrés avec succès",
        });
      } else if (section === 'carousel-settings') {
        // Sauvegarder uniquement les paramètres du carousel
        await settingsService.updateCarouselSettings({
          hero_carousel_enabled: settings.hero_carousel_enabled,
          hero_carousel_auto_play: settings.hero_carousel_auto_play,
          hero_carousel_interval: settings.hero_carousel_interval
        });
        toast({
          title: "Succès",
          description: "Paramètres du carousel enregistrés avec succès",
        });
      } else {
        // Sauvegarder tous les paramètres (fallback)
        await settingsService.patchSettings(settings);
        toast({
          title: "Succès",
          description: "Paramètres enregistrés avec succès",
        });
      }
      
      // Recharger les données après sauvegarde
      await loadSettings();
      
      // Mettre à jour les settings avec les données rechargées
      const refreshedData = await settingsService.getSettings();
      setSettings(refreshedData);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const sections = [
    { id: 'countdown', label: 'Chronomètre', icon: Clock },
    { id: 'carousel', label: 'Carousel Hero', icon: Image },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'halloffame', label: 'Hall of Fame', icon: Award },
    { id: 'general', label: 'Général', icon: Globe },
  ];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Paramètres de la Plateforme</h2>
          <p className="text-gray-400">Configurez tous les aspects de votre plateforme</p>
        </div>
      </div>
      
      {/* Navigation par onglets */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700/50 pb-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Contenu des sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeSection === 'countdown' && <CountdownSection settings={settings} setSettings={setSettings} onSave={handleSaveSettings} saving={saving} />}
          {activeSection === 'carousel' && (
            <CarouselSection 
              images={carouselImages}
              onRefresh={loadCarouselImages}
            />
          )}
          {activeSection === 'team' && (
            <TeamSection 
              members={teamMembers}
              onRefresh={loadTeamMembers}
            />
          )}
          {activeSection === 'halloffame' && (
            <HallOfFameSection 
              entries={hallOfFame}
              onRefresh={loadHallOfFame}
            />
          )}
          {activeSection === 'general' && <GeneralSection settings={settings} setSettings={setSettings} onSave={handleSaveSettings} saving={saving} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Section Chronomètre
const CountdownSection = ({ settings, setSettings, onSave, saving }) => {
  // Fonction de formatage de date (définie avant useEffect)
  const formatDateTime = (isoString) => {
    if (!isoString) {
      return '';
    }
    
    try {
      // Vérifier si la date semble invalide (année < 1900 ou > 2100)
      const dateStr = String(isoString);
      const yearMatch = dateStr.match(/(\d{4})/);
      if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        if (year < 1900 || year > 2100) {
          // Ne pas spammer la console - juste retourner vide
          return ''; // Retourner vide pour forcer l'utilisateur à saisir une nouvelle date
        }
      }
      
      // Convertir la date ISO en date locale pour l'input datetime-local
      const date = new Date(isoString);
      
      // Vérifier que la date est valide
      if (isNaN(date.getTime())) {
        // Ne pas spammer la console - juste retourner vide
        return ''; // Retourner vide pour forcer l'utilisateur à saisir une nouvelle date
      }
      
      // Pour datetime-local, on doit utiliser les valeurs UTC de la date
      // car datetime-local attend une date sans timezone (qu'on interprète comme UTC)
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      
      const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      return formatted;
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error, isoString);
      return ''; // Retourner vide pour forcer l'utilisateur à saisir une nouvelle date
    }
  };
  
  const [localSettings, setLocalSettings] = useState({
    countdown_enabled: settings.countdown_enabled ?? true,
    countdown_target_date: settings.countdown_target_date ?? null
  });
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    setLocalSettings({
      countdown_enabled: settings.countdown_enabled ?? true,
      countdown_target_date: settings.countdown_target_date ?? null
    });
  }, [settings]);
  
  // Décompteur en temps réel
  useEffect(() => {
    if (!localSettings.countdown_enabled || !localSettings.countdown_target_date) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    const targetDate = new Date(localSettings.countdown_target_date).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };
    
    // Mise à jour immédiate
    updateCountdown();
    
    // Mise à jour toutes les secondes
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [localSettings.countdown_enabled, localSettings.countdown_target_date]);
  
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    
    if (!dateValue) {
      setLocalSettings({ ...localSettings, countdown_target_date: null });
      return;
    }
    
    // Convertir la date locale en ISO string
    // datetime-local donne une date locale sans timezone au format "YYYY-MM-DDTHH:mm"
    // On doit la convertir en ISO 8601 avec timezone UTC
    
    // Parser la date locale directement
    const [datePart, timePart] = dateValue.split('T');
    if (!datePart || !timePart) {
      console.error('Format de date invalide:', dateValue);
      return;
    }
    
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Vérifier que tous les composants sont valides
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
      console.error('Composants de date invalides');
      return;
    }
    
    // Créer une date UTC (month est 0-indexé dans JavaScript)
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
    
    // Vérifier que la date est valide
    if (isNaN(utcDate.getTime())) {
      console.error('Date UTC invalide créée');
      return;
    }
    
    // Convertir en ISO string
    const isoString = utcDate.toISOString();
    
    setLocalSettings({ ...localSettings, countdown_target_date: isoString });
  };
  
  const handleSave = async () => {
    // Mettre à jour l'état local des settings AVANT d'appeler onSave
    const updatedSettings = { ...settings, ...localSettings };
    setSettings(updatedSettings);
    
    // Appeler onSave avec la section 'countdown'
    // onSave va utiliser les nouvelles valeurs via updatedSettings
    // On doit passer les valeurs locales à onSave
    await onSave('countdown', localSettings);
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Configuration du Chronomètre</h3>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="countdown_enabled" className="text-white">
            Activer le chronomètre
          </Label>
          <Switch
            id="countdown_enabled"
            checked={localSettings.countdown_enabled}
            onCheckedChange={(checked) => setLocalSettings({ ...localSettings, countdown_enabled: checked })}
          />
        </div>
        
        {localSettings.countdown_enabled && (
          <div className="space-y-2">
            <Label htmlFor="countdown_target_date" className="text-white">
              Date cible du chronomètre
            </Label>
            <Input
              id="countdown_target_date"
              type="datetime-local"
              value={formatDateTime(localSettings.countdown_target_date) || ''}
              onChange={handleDateChange}
              className="bg-slate-800/50 border-gray-600 text-white"
              placeholder="Sélectionnez une date et une heure"
            />
            {/* Avertissement si la date actuelle est invalide */}
            {settings.countdown_target_date && !formatDateTime(settings.countdown_target_date) && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                <p className="text-xs text-red-300 font-bold mb-1">⚠️ Date invalide détectée</p>
                <p className="text-xs text-red-400 mb-2">
                  La date enregistrée dans la base de données est invalide : <code className="bg-red-950/50 px-1 rounded">{String(settings.countdown_target_date)}</code>
                </p>
                <p className="text-xs text-yellow-400 mb-2">
                  Veuillez saisir une nouvelle date valide dans le champ ci-dessus et cliquer sur "Enregistrer" pour corriger le problème.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setLocalSettings({ ...localSettings, countdown_target_date: null });
                    // Mettre à jour les settings aussi pour que la sauvegarde envoie null
                    setSettings({ ...settings, countdown_target_date: null });
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-red-800/50 border-red-700 text-red-300 hover:bg-red-800"
                >
                  Réinitialiser la date
                </Button>
              </div>
            )}
            
            {/* Décompteur en temps réel */}
            {localSettings.countdown_enabled && localSettings.countdown_target_date && (
              <div className="mt-4 p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Décompteur en temps réel
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(localSettings.countdown_target_date).getTime() > new Date().getTime() 
                      ? 'Chronomètre actif' 
                      : 'Date passée'}
                  </p>
                </div>
                
                {new Date(localSettings.countdown_target_date).getTime() > new Date().getTime() ? (
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Jours', value: timeLeft.days },
                      { label: 'Heures', value: timeLeft.hours },
                      { label: 'Minutes', value: timeLeft.minutes },
                      { label: 'Secondes', value: timeLeft.seconds }
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 text-center backdrop-blur-sm">
                        <div className="font-bold text-yellow-400 text-2xl mb-1">
                          {String(item.value || 0).padStart(2, '0')}
                        </div>
                        <div className="text-gray-400 text-xs uppercase">{item.label}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-red-400 font-semibold">⚠️ La date cible est passée</p>
                    <p className="text-gray-400 text-xs mt-1">Le chronomètre affichera "Voter" sur la page d'accueil</p>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <p className="text-xs text-gray-400 text-center">
                    Date cible : {new Date(localSettings.countdown_target_date).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short'
                    })}
                  </p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-400">
              Le chronomètre affichera "Participer" avant cette date et "Voter" après.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Section Carousel
const CarouselSection = ({ images, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    title: '',
    alt_text: '',
    order: 1,
    is_active: true
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const openCreateModal = () => {
    setEditingImage(null);
    setFormData({ image: null, title: '', alt_text: '', order: 1, is_active: true });
    setPreview(null);
    setShowModal(true);
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setFormData({
      image: null,
      title: image.title || '',
      alt_text: image.alt_text || '',
      order: image.order || 1,
      is_active: image.is_active !== undefined ? image.is_active : true
    });
    // Utiliser image_url si disponible, sinon construire depuis image
    const previewUrl = image.image_url || 
                      (image.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/../${image.image}` : null);
    setPreview(previewUrl);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      if (formData.image) submitData.append('image', formData.image);
      submitData.append('title', formData.title);
      submitData.append('alt_text', formData.alt_text);
      submitData.append('order', formData.order);
      submitData.append('is_active', formData.is_active);

      if (editingImage) {
        await settingsService.patchCarouselImage(editingImage.id, submitData);
        toast({ title: "Succès", description: "Image mise à jour avec succès" });
      } else {
        await settingsService.createCarouselImage(submitData);
        toast({ title: "Succès", description: "Image ajoutée avec succès" });
      }
      
      setShowModal(false);
      onRefresh();
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    try {
      await settingsService.deleteCarouselImage(imageId);
      toast({ title: "Succès", description: "Image supprimée avec succès" });
      onRefresh();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Images du Carousel Hero</h3>
          </div>
          <Button onClick={openCreateModal} className="btn-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une image
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center py-8">
              Aucune image dans le carousel
            </p>
          ) : (
            images.map((image) => {
              // Construire l'URL de l'image avec fallback
              let imageUrl = image.image_url;
              
              // Si image_url n'est pas disponible, essayer de construire depuis image
              if (!imageUrl && image.image) {
                const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
                // Enlever /api à la fin si présent pour obtenir le domaine de base
                const baseUrl = apiBase.replace(/\/api$/, '');
                // Construire l'URL en enlevant le / au début du chemin image si présent
                const imagePath = image.image.startsWith('/') ? image.image : `/${image.image}`;
                imageUrl = `${baseUrl}${imagePath}`;
              }
              
              // Log pour débogage
              if (!imageUrl) {
                console.warn('Image URL manquante pour:', image);
              }
              
              return (
              <div key={image.id} className="bg-slate-800/50 rounded-lg p-4">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={image.alt_text || image.title || 'Image du carousel'} 
                    className="w-full h-48 object-cover rounded-lg mb-2"
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', imageUrl, image);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-500" />
                    <span className="ml-2 text-gray-400 text-sm">Aucune image</span>
                  </div>
                )}
                <p className="text-white font-semibold truncate">{image.title || 'Sans titre'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={image.is_active ? "default" : "secondary"} className="text-xs">
                    {image.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-xs text-gray-400">Ordre: {image.order}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(image)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(image.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Carousel */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingImage ? 'Modifier l\'image' : 'Ajouter une image'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="text-white">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
                {preview && (
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-2" />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  placeholder="Titre de l'image"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alt_text" className="text-white">Texte alternatif</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  placeholder="Description de l'image"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-white">Ordre</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-6">
                  <Label htmlFor="is_active" className="text-white">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

// Section Équipe
const TeamSection = ({ members, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    photo: null,
    role: 'member',
    member_type: 'member',
    bio: '',
    order: 0,
    is_active: true,
    facebook_url: '',
    linkedin_url: '',
    twitter_url: ''
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: 'president', label: 'Président' },
    { value: 'vice_president', label: 'Vice-Président' },
    { value: 'secretary', label: 'Secrétaire' },
    { value: 'treasurer', label: 'Trésorier' },
    { value: 'member', label: 'Membre' },
    { value: 'advisor', label: 'Conseiller' }
  ];

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      photo: null,
      role: 'member',
      member_type: 'member',
      bio: '',
      order: 0,
      is_active: true,
      facebook_url: '',
      linkedin_url: '',
      twitter_url: ''
    });
    setPreview(null);
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      email: member.email || '',
      phone: member.phone || '',
      photo: null,
      role: member.role || 'member',
      member_type: member.member_type || 'member',
      bio: member.bio || '',
      order: member.order || 0,
      is_active: member.is_active !== undefined ? member.is_active : true,
      facebook_url: member.facebook_url || '',
      linkedin_url: member.linkedin_url || '',
      twitter_url: member.twitter_url || ''
    });
    setPreview(member.photo_url);
    setShowModal(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      if (formData.photo) submitData.append('photo', formData.photo);
      submitData.append('first_name', formData.first_name);
      submitData.append('last_name', formData.last_name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('role', formData.role);
      submitData.append('member_type', formData.member_type);
      submitData.append('bio', formData.bio);
      submitData.append('order', formData.order);
      submitData.append('is_active', formData.is_active);
      submitData.append('facebook_url', formData.facebook_url);
      submitData.append('linkedin_url', formData.linkedin_url);
      submitData.append('twitter_url', formData.twitter_url);

      if (editingMember) {
        await settingsService.patchTeamMember(editingMember.id, submitData);
        toast({ title: "Succès", description: "Membre mis à jour avec succès" });
      } else {
        await settingsService.createTeamMember(submitData);
        toast({ title: "Succès", description: "Membre ajouté avec succès" });
      }
      
      setShowModal(false);
      onRefresh();
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le membre",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    
    try {
      await settingsService.deleteTeamMember(memberId);
      toast({ title: "Succès", description: "Membre supprimé avec succès" });
      onRefresh();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Membres de l'Équipe</h3>
          </div>
          <Button onClick={openCreateModal} className="btn-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un membre
          </Button>
        </div>
        
        {/* Liste des membres */}
        <div className="space-y-4">
          {members.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Aucun membre dans l'équipe
            </p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-4">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.full_name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white font-semibold">{member.full_name}</p>
                  <p className="text-gray-400 text-sm">{roleOptions.find(r => r.value === member.role)?.label || member.role}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={member.member_type === 'active_bureau' ? "default" : "secondary"} className="text-xs">
                      {member.member_type === 'active_bureau' ? 'Bureau Actif' : 'Membre'}
                    </Badge>
                    {!member.is_active && (
                      <Badge variant="outline" className="text-xs">Inactif</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(member)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Équipe */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingMember ? 'Modifier le membre' : 'Ajouter un membre'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-white">Prénom *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-white">Nom *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo" className="text-white">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
                {preview && (
                  <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="bg-slate-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="member_type" className="text-white">Type</Label>
                  <Select value={formData.member_type} onValueChange={(value) => setFormData({ ...formData, member_type: value })}>
                    <SelectTrigger className="bg-slate-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Membre</SelectItem>
                      <SelectItem value="active_bureau">Bureau Actif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Biographie</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-white">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-6">
                  <Label htmlFor="is_active" className="text-white">Actif</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Réseaux sociaux (optionnels)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Facebook URL"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white text-sm"
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white text-sm"
                  />
                  <Input
                    placeholder="Twitter URL"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

// Section Hall of Fame
const HallOfFameSection = ({ entries, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    category_name: '',
    winner_name: '',
    winner_photo: null,
    description: '',
    award_type: '',
    order: 0,
    is_featured: false
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const openCreateModal = () => {
    setEditingEntry(null);
    setFormData({
      year: new Date().getFullYear(),
      category_name: '',
      winner_name: '',
      winner_photo: null,
      description: '',
      award_type: '',
      order: 0,
      is_featured: false
    });
    setPreview(null);
    setShowModal(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({
      year: entry.year || new Date().getFullYear(),
      category_name: entry.category_name || '',
      winner_name: entry.winner_name || '',
      winner_photo: null,
      description: entry.description || '',
      award_type: entry.award_type || '',
      order: entry.order || 0,
      is_featured: entry.is_featured || false
    });
    setPreview(entry.winner_photo_url);
    setShowModal(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, winner_photo: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      if (formData.winner_photo) submitData.append('winner_photo', formData.winner_photo);
      submitData.append('year', formData.year);
      submitData.append('category_name', formData.category_name);
      submitData.append('winner_name', formData.winner_name);
      submitData.append('description', formData.description);
      submitData.append('award_type', formData.award_type);
      submitData.append('order', formData.order);
      submitData.append('is_featured', formData.is_featured);

      if (editingEntry) {
        await settingsService.patchHallOfFameEntry(editingEntry.id, submitData);
        toast({ title: "Succès", description: "Entrée mise à jour avec succès" });
      } else {
        await settingsService.createHallOfFameEntry(submitData);
        toast({ title: "Succès", description: "Entrée ajoutée avec succès" });
      }
      
      setShowModal(false);
      onRefresh();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'entrée",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) return;
    
    try {
      await settingsService.deleteHallOfFameEntry(entryId);
      toast({ title: "Succès", description: "Entrée supprimée avec succès" });
      onRefresh();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Hall of Fame</h3>
          </div>
          <Button onClick={openCreateModal} className="btn-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une entrée
          </Button>
        </div>
        
        {/* Liste des entrées */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Aucune entrée dans le Hall of Fame
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-4">
                {entry.winner_photo_url ? (
                  <img src={entry.winner_photo_url} alt={entry.winner_name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <Award className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white font-semibold">{entry.winner_name}</p>
                  <p className="text-gray-400 text-sm">{entry.category_name} ({entry.year})</p>
                  {entry.award_type && <p className="text-yellow-400 text-xs">{entry.award_type}</p>}
                  <div className="flex gap-2 mt-1">
                    {entry.is_featured && (
                      <Badge variant="default" className="text-xs">Mis en avant</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(entry)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Hall of Fame */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingEntry ? 'Modifier l\'entrée' : 'Ajouter une entrée'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white">Année *</Label>
                  <Select value={formData.year.toString()} onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}>
                    <SelectTrigger className="bg-slate-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-white">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category_name" className="text-white">Catégorie/Prix *</Label>
                <Input
                  id="category_name"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="winner_name" className="text-white">Nom du lauréat *</Label>
                <Input
                  id="winner_name"
                  value={formData.winner_name}
                  onChange={(e) => setFormData({ ...formData, winner_name: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="winner_photo" className="text-white">Photo du lauréat</Label>
                <Input
                  id="winner_photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
                {preview && (
                  <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2" />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="award_type" className="text-white">Type de récompense</Label>
                <Input
                  id="award_type"
                  value={formData.award_type}
                  onChange={(e) => setFormData({ ...formData, award_type: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  placeholder="Ex: 1er Prix, Meilleur Performance, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured" className="text-white">Mis en avant</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

// Section Général
const GeneralSection = ({ settings, setSettings, onSave, saving }) => {
  const [localSettings, setLocalSettings] = useState({
    site_title: settings.site_title ?? '',
    site_description: settings.site_description ?? '',
    contact_email: settings.contact_email ?? '',
    contact_phone: settings.contact_phone ?? '',
    facebook_url: settings.facebook_url ?? '',
    instagram_url: settings.instagram_url ?? '',
    twitter_url: settings.twitter_url ?? '',
    youtube_url: settings.youtube_url ?? '',
    linkedin_url: settings.linkedin_url ?? '',
    hero_carousel_enabled: settings.hero_carousel_enabled ?? true,
    hero_carousel_auto_play: settings.hero_carousel_auto_play ?? true,
    hero_carousel_interval: settings.hero_carousel_interval ?? 5000
  });
  
  useEffect(() => {
    setLocalSettings({
      site_title: settings.site_title ?? '',
      site_description: settings.site_description ?? '',
      contact_email: settings.contact_email ?? '',
      contact_phone: settings.contact_phone ?? '',
      facebook_url: settings.facebook_url ?? '',
      instagram_url: settings.instagram_url ?? '',
      twitter_url: settings.twitter_url ?? '',
      youtube_url: settings.youtube_url ?? '',
      linkedin_url: settings.linkedin_url ?? '',
      hero_carousel_enabled: settings.hero_carousel_enabled ?? true,
      hero_carousel_auto_play: settings.hero_carousel_auto_play ?? true,
      hero_carousel_interval: settings.hero_carousel_interval ?? 5000
    });
  }, [settings]);
  
  const handleSave = async () => {
    // Mettre à jour l'état local des settings
    setSettings({ ...settings, ...localSettings });
    // Appeler onSave avec la section 'general'
    await onSave('general');
  };
  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Informations Générales</h3>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
                  <Label htmlFor="site_title" className="text-white">Titre du site</Label>
                  <Input
                    id="site_title"
                    value={localSettings.site_title}
                    onChange={(e) => setLocalSettings({ ...localSettings, site_title: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                    placeholder="Makona Awards 2025"
                  />
          </div>
          
          <div className="space-y-2">
                  <Label htmlFor="site_description" className="text-white">Description du site</Label>
                  <Textarea
                    id="site_description"
                    value={localSettings.site_description}
                    onChange={(e) => setLocalSettings({ ...localSettings, site_description: e.target.value })}
                    className="bg-slate-800/50 border-gray-600 text-white"
                    rows={4}
                    placeholder="Description du site pour le SEO"
                  />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email de contact
              </Label>
              <Input
                id="contact_email"
                type="email"
                    value={localSettings.contact_email}
                    onChange={(e) => setLocalSettings({ ...localSettings, contact_email: e.target.value })}
                className="bg-slate-800/50 border-gray-600 text-white"
                placeholder="contact@makona-awards.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_phone" className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone de contact
              </Label>
              <Input
                id="contact_phone"
                    value={localSettings.contact_phone}
                    onChange={(e) => setLocalSettings({ ...localSettings, contact_phone: e.target.value })}
                className="bg-slate-800/50 border-gray-600 text-white"
                placeholder="+224 XXX XXX XXX"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Réseaux sociaux */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Réseaux Sociaux</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'facebook_url', label: 'Facebook', icon: Facebook },
            { key: 'instagram_url', label: 'Instagram', icon: Instagram },
            { key: 'twitter_url', label: 'Twitter/X', icon: Twitter },
            { key: 'youtube_url', label: 'YouTube', icon: Youtube },
            { key: 'linkedin_url', label: 'LinkedIn', icon: Linkedin },
          ].map((social) => {
            const Icon = social.icon;
            return (
              <div key={social.key} className="space-y-2">
                <Label htmlFor={social.key} className="text-white flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {social.label}
                </Label>
                <Input
                  id={social.key}
                  type="url"
                    value={localSettings[social.key]}
                    onChange={(e) => setLocalSettings({ ...localSettings, [social.key]: e.target.value })}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  placeholder={`https://...`}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Carousel Settings */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Paramètres du Carousel</h3>
          </div>
          <Button 
            onClick={async () => {
              setSettings({ ...settings, ...localSettings });
              await onSave('carousel-settings');
            }}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
                  <Label htmlFor="hero_carousel_enabled" className="text-white">
                    Activer le carousel
                  </Label>
                  <Switch
                    id="hero_carousel_enabled"
                    checked={localSettings.hero_carousel_enabled}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, hero_carousel_enabled: checked })}
                  />
                </div>
                
                {localSettings.hero_carousel_enabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hero_carousel_auto_play" className="text-white">
                        Lecture automatique
                      </Label>
                      <Switch
                        id="hero_carousel_auto_play"
                        checked={localSettings.hero_carousel_auto_play}
                        onCheckedChange={(checked) => setLocalSettings({ ...localSettings, hero_carousel_auto_play: checked })}
                      />
                    </div>
                    
                    {localSettings.hero_carousel_auto_play && (
                      <div className="space-y-2">
                        <Label htmlFor="hero_carousel_interval" className="text-white">
                          Intervalle entre les slides (ms)
                        </Label>
                        <Input
                          id="hero_carousel_interval"
                          type="number"
                          min="1000"
                          max="30000"
                          step="1000"
                          value={localSettings.hero_carousel_interval}
                          onChange={(e) => setLocalSettings({ ...localSettings, hero_carousel_interval: parseInt(e.target.value) })}
                          className="bg-slate-800/50 border-gray-600 text-white"
                        />
                  <p className="text-sm text-gray-400">
                    Durée entre chaque transition (1000-30000 millisecondes)
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;

