import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  CheckCircle, 
  UserPlus,
  User,
  Award,
  Upload,
  FileCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Trophy,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  FileText,
  X,
  Trash2,
  CheckCircle2,
  Mail,
  Shield,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';
import authService from '@/services/authService';
import candidatureService from '@/services/candidatureService';
import categoryService from '@/services/categoryService';

const STEPS = {
  AUTH: 0,
  OTP_VERIFY: 0.5,
  CATEGORY: 1,
  PROFILE: 2,
  FILES: 3,
  REVIEW: 4
};

const STEP_LABELS = [
  { label: 'Authentification', icon: UserPlus },
  { label: 'Catégorie', icon: Award },
  { label: 'Profil', icon: User },
  { label: 'Fichiers', icon: Upload },
  { label: 'Récapitulatif', icon: FileCheck }
];

const MEDIA_TYPES = {
  photo: { label: 'Photo', icon: ImageIcon, bgColor: 'bg-blue-500/20', iconColor: 'text-blue-400' },
  video: { label: 'Vidéo', icon: VideoIcon, bgColor: 'bg-red-500/20', iconColor: 'text-red-400' },
  audio: { label: 'Audio', icon: Music, bgColor: 'bg-green-500/20', iconColor: 'text-green-400' },
  portfolio: { label: 'Portfolio', icon: FileText, bgColor: 'bg-purple-500/20', iconColor: 'text-purple-400' }
};

const CandidaturePage = ({ onNavigate, onLogin }) => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  // États principaux
  const [currentStep, setCurrentStep] = useState(STEPS.AUTH);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Données du formulaire
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [profileData, setProfileData] = useState({
    bio: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    website_url: ''
  });
  const [files, setFiles] = useState([]);
  const [activeMediaTab, setActiveMediaTab] = useState(0);
  
  // États pour l'inscription/connexion
  const [isLogin, setIsLogin] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: 'guinea',
    password: '',
    passwordConfirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour la vérification OTP
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpEmail, setOtpEmail] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    checkAuthentication();
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryId && isAuthenticated && categories.length > 0) {
      loadCategory();
    }
  }, [categoryId, isAuthenticated, categories.length]);

  // Passer automatiquement à l'étape suivante quand la catégorie est chargée et l'utilisateur est authentifié
  useEffect(() => {
    if (selectedCategory && isAuthenticated && currentStep === STEPS.CATEGORY && categoryId) {
      // Petit délai pour une meilleure UX
      const timer = setTimeout(() => {
        nextStep();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, isAuthenticated, currentStep, categoryId]);

  useEffect(() => {
    // Lorsqu'on arrive à l'étape FILES, initialiser le premier onglet actif
    if (currentStep === STEPS.FILES && selectedCategory) {
      const requiredTypes = categoryService.getRequiredFileTypes(selectedCategory);
      if (requiredTypes.length > 0) {
        setActiveMediaTab(0);
      }
    }
  }, [currentStep, selectedCategory]);

  const checkAuthentication = async () => {
    try {
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        const profileResult = await authService.getProfile();
        if (profileResult.success) {
          setIsAuthenticated(true);
          setUser(profileResult.user);
          if (categoryId) {
            setCurrentStep(STEPS.CATEGORY);
          } else {
            setCurrentStep(STEPS.CATEGORY);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentStep(STEPS.AUTH);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentStep(STEPS.AUTH);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentStep(STEPS.AUTH);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await categoryService.getActiveCategories();
      setCategories(Array.isArray(result) ? result : (result.results || []));
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadCategory = async () => {
    try {
      const result = await categoryService.getCategoryById(categoryId);
      if (result.success) {
        setSelectedCategory(result.category);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la catégorie:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await authService.login(authData.email, authData.password);
        if (result.success) {
          setIsAuthenticated(true);
          setUser(result.user);
          onLogin && onLogin(result.user);
          toast({
            title: "Connexion réussie !",
            description: `Bienvenue ${result.user.first_name || result.user.email}`,
          });
          nextStep();
        } else {
          toast({
            title: "Erreur de connexion",
            description: result.error || "Email ou mot de passe incorrect",
            variant: "destructive"
          });
        }
      } else {
        if (!authData.email || !authData.email.includes('@')) {
          toast({
            title: "Email invalide",
            description: "Veuillez entrer une adresse email valide",
            variant: "destructive"
          });
          return;
        }

        if (!authData.password || authData.password.length < 8) {
          toast({
            title: "Mot de passe invalide",
            description: "Le mot de passe doit contenir au moins 8 caractères",
            variant: "destructive"
          });
          return;
        }

        if (authData.password !== authData.passwordConfirm) {
          toast({
            title: "Mots de passe différents",
            description: "Les mots de passe ne correspondent pas",
            variant: "destructive"
          });
          return;
        }

        const result = await authService.register({
          email: authData.email,
          firstName: authData.firstName,
          lastName: authData.lastName,
          phone: authData.phone,
          country: authData.country,
          password: authData.password,
          passwordConfirm: authData.passwordConfirm,
        });

        if (result.success) {
          toast({
            title: "Inscription réussie !",
            description: "Un code de vérification a été envoyé à votre email",
            variant: "success"
          });
          // Passer à l'étape de vérification OTP
          setOtpEmail(authData.email);
          setCurrentStep(STEPS.OTP_VERIFY);
          setResendCooldown(60); // Cooldown de 60 secondes
        } else {
          // Extraire le message d'erreur de manière compréhensible
          let errorMessage = "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
          
          if (result.error) {
            if (typeof result.error === 'string') {
              errorMessage = result.error;
            } else if (result.error.email) {
              errorMessage = Array.isArray(result.error.email) 
                ? result.error.email[0] 
                : result.error.email;
            } else if (result.error.non_field_errors) {
              errorMessage = Array.isArray(result.error.non_field_errors)
                ? result.error.non_field_errors[0]
                : result.error.non_field_errors;
            } else {
              // Prendre le premier message d'erreur disponible
              const firstKey = Object.keys(result.error)[0];
              if (firstKey && result.error[firstKey]) {
                errorMessage = Array.isArray(result.error[firstKey])
                  ? result.error[firstKey][0]
                  : result.error[firstKey];
              }
            }
          }
          
          toast({
            title: "Erreur d'inscription",
            description: errorMessage,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    nextStep();
  };

  const handleFileAdd = (fileType, newFiles) => {
    const processedFiles = Array.from(newFiles).map(file => ({
      file,
      type: fileType,
      title: '',
      order: files.filter(f => f.type === fileType).length,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFiles(prev => [...prev, ...processedFiles]);
    toast({
      title: "Fichiers ajoutés",
      description: `${processedFiles.length} fichier(s) ajouté(s)`,
    });
  };

  const handleFileRemove = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleFileTitleUpdate = (fileId, title) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, title } : file
    ));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (profileData.bio || profileData.facebook_url || profileData.instagram_url || 
          profileData.youtube_url || profileData.website_url) {
        try {
          const candidateService = (await import('@/services/candidateService')).default;
          await candidateService.updateProfile(profileData);
        } catch (error) {
          console.error('Erreur lors de la sauvegarde du profil:', error);
        }
      }

      const result = await candidatureService.submitCandidature({
        categoryId: selectedCategory.id,
        files: files.map(f => ({
          file: f.file,
          type: f.type,
          title: f.title,
          order: f.order
        }))
      });

      if (result.success) {
        toast({
          title: "Candidature soumise !",
          description: "Votre candidature a été soumise avec succès. Elle sera examinée par notre équipe.",
          variant: "success"
        });
        onNavigate('/candidate/profile');
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de la soumission",
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

  // Gestion du cooldown pour le renvoi d'OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Gestion de la saisie OTP
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Un seul caractère par case
    if (!/^\d*$/.test(value)) return; // Seulement des chiffres
    
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);
    
    // Passer automatiquement à la case suivante
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(paste)) {
      setOtpCode(paste.split(''));
      const lastInput = document.getElementById('otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  // Vérifier le code OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const code = otpCode.join('');
    
    if (code.length !== 6) {
      toast({
        title: "Code incomplet",
        description: "Veuillez entrer les 6 chiffres du code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifyingOTP(true);
    try {
      const result = await authService.verifyOTP(otpEmail, code);
      
      if (result.success) {
        toast({
          title: "Email vérifié !",
          description: "Votre compte a été vérifié avec succès",
          variant: "success"
        });
        setIsAuthenticated(true);
        setUser(result.user);
        onLogin && onLogin(result.user);
        setCurrentStep(STEPS.CATEGORY);
      } else {
        toast({
          title: "Code invalide",
          description: result.error || "Le code de vérification est incorrect",
          variant: "destructive"
        });
        // Réinitialiser les champs OTP
        setOtpCode(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  // Renvoyer le code OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    try {
      const result = await authService.requestOTP(otpEmail);
      if (result.success) {
        toast({
          title: "Code renvoyé",
          description: "Un nouveau code a été envoyé à votre email",
          variant: "success"
        });
        setResendCooldown(60);
        setOtpCode(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de renvoyer le code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => {
    if (currentStep < STEP_LABELS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.AUTH:
        return isAuthenticated;
      case STEPS.CATEGORY:
        return selectedCategory !== null;
      case STEPS.PROFILE:
        return true;
      case STEPS.FILES:
        if (!selectedCategory) return false;
        const requirements = categoryService.getFileRequirements(selectedCategory);
        const validation = candidatureService.validateFiles(files, requirements);
        return validation.isValid;
      case STEPS.REVIEW:
        return true;
      default:
        return false;
    }
  };

  const getRequiredMediaTypes = () => {
    if (!selectedCategory) return [];
    return categoryService.getRequiredFileTypes(selectedCategory);
  };

  const getFilesForType = (type) => {
    return files.filter(f => f.type === type);
  };

  const isMediaTabComplete = (type) => {
    const filesForType = getFilesForType(type);
    return filesForType.length > 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-white text-lg font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  const requiredMediaTypes = getRequiredMediaTypes();

  return (
    <>
      <Helmet>
        <title>Postuler - Makona Awards 2025</title>
        <meta name="description" content="Postulez pour participer aux Makona Awards 2025" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 md:py-12 pt-20 md:pt-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header avec retour */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <Button
              onClick={() => onNavigate('/')}
              variant="ghost"
              className="text-gray-300 hover:text-white mb-6 transition-colors"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            {/* Stepper amélioré */}
            <div className="card-glass p-4 md:p-6 overflow-x-auto">
              <div className="flex items-center justify-between min-w-max md:min-w-0">
                {STEP_LABELS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  const isPast = index < currentStep;

                  return (
                    <React.Fragment key={index}>
                      <div className="flex flex-col items-center flex-1 relative min-w-[100px] md:min-w-[120px]">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: isActive ? 1.1 : 1 }}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                              : isActive
                              ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-900 shadow-lg shadow-yellow-500/50'
                              : 'bg-white/10 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                          ) : (
                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                          )}
                        </motion.div>
                        <p className={`mt-2 text-[10px] md:text-xs font-medium text-center hidden sm:block ${
                          isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {index < STEP_LABELS.length - 1 && (
                          <div className={`absolute top-5 md:top-6 left-[55%] w-full h-0.5 hidden sm:block transition-colors ${
                            isPast ? 'bg-green-500' : 'bg-white/10'
                          }`} style={{ width: 'calc(100% - 40px)' }} />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contenu des étapes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="card-glass p-6 md:p-8 lg:p-10"
            >
              {/* Étape OTP: Vérification du code */}
              {currentStep === STEPS.OTP_VERIFY && (
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30"
                    >
                      <Mail className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Vérification de l'email
                    </h2>
                    
                    {/* Message visible indiquant que l'email a été envoyé */}
                    <div className="mb-6 p-4 md:p-6 bg-green-500/20 border-2 border-green-500/50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        <div className="text-left">
                          <p className="text-green-400 font-semibold text-base md:text-lg mb-1">
                            Email envoyé avec succès !
                          </p>
                          <p className="text-gray-300 text-sm md:text-base">
                            Nous avons envoyé un code de vérification à 6 chiffres à votre adresse email :
                          </p>
                          <p className="text-yellow-400 font-bold text-base md:text-lg mt-2">{otpEmail}</p>
                          <p className="text-gray-400 text-xs md:text-sm mt-2">
                            Vérifiez votre boîte de réception et votre dossier spam.
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm md:text-base mb-6">
                      Entrez le code de vérification reçu par email
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    {/* Champs OTP */}
                    <div className="flex justify-center gap-2 md:gap-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={otpCode[index]}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>

                    {/* Bouton de vérification */}
                    <Button
                      type="submit"
                      disabled={isVerifyingOTP || otpCode.join('').length !== 6}
                      className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-bold py-3 md:py-4 text-base md:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifyingOTP ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Vérification...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Vérifier le code
                        </>
                      )}
                    </Button>

                    {/* Lien pour renvoyer le code */}
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-2">
                        Vous n'avez pas reçu le code ?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendCooldown > 0}
                        className="text-yellow-400 hover:text-yellow-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {resendCooldown > 0
                          ? `Renvoyer le code dans ${resendCooldown}s`
                          : 'Renvoyer le code'}
                      </button>
                    </div>

                    {/* Retour à l'inscription */}
                    <div className="text-center pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(STEPS.AUTH);
                          setOtpCode(['', '', '', '', '', '']);
                        }}
                        className="text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-1 mx-auto"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l'inscription
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Étape 0: Authentification */}
              {currentStep === STEPS.AUTH && (
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30"
                    >
                      <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {isLogin ? 'Connexion' : 'Inscription'}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                      {isLogin 
                        ? 'Connectez-vous pour continuer'
                        : 'Créez votre compte pour participer'}
                    </p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4 md:space-y-5">
                    {!isLogin && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Prénom *
                          </label>
                          <input
                            type="text"
                            value={authData.firstName}
                            onChange={(e) => setAuthData({ ...authData, firstName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                            required={!isLogin}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nom *
                          </label>
                          <input
                            type="text"
                            value={authData.lastName}
                            onChange={(e) => setAuthData({ ...authData, lastName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                        required
                      />
                    </div>

                    {!isLogin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={authData.phone}
                            onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Pays *
                          </label>
                          <select
                            value={authData.country}
                            onChange={(e) => setAuthData({ ...authData, country: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                            required
                          >
                            <option value="guinea">Guinée</option>
                            <option value="liberia">Libéria</option>
                            <option value="sierra_leone">Sierra Leone</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={authData.password}
                          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all pr-12"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirmer le mot de passe *
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswordConfirm ? "text" : "password"}
                            value={authData.passwordConfirm}
                            onChange={(e) => setAuthData({ ...authData, passwordConfirm: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all pr-12"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsLogin(!isLogin)}
                        className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                        disabled={isSubmitting}
                      >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isLogin ? "Connexion..." : "Inscription..."}
                          </>
                        ) : (
                          isLogin ? "Se connecter" : "S'inscrire"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Étape 1: Sélection de catégorie */}
              {currentStep === STEPS.CATEGORY && (
                <div>
                  <div className="text-center mb-8 md:mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30"
                    >
                      <Award className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Choisissez une catégorie
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                      Sélectionnez la catégorie pour laquelle vous souhaitez postuler
                    </p>
                  </div>

                  {selectedCategory ? (
                    <div className="mb-6 p-4 md:p-6 bg-green-500/10 border-2 border-green-500/30 rounded-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Trophy className="w-6 h-6 md:w-8 md:h-8 text-green-400 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-white font-semibold text-lg md:text-xl mb-1">{selectedCategory.name}</p>
                            <p className="text-gray-300 text-sm md:text-base">{selectedCategory.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedCategory(null)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                          size="sm"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-h-[500px] overflow-y-auto">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          onClick={() => handleCategorySelect(category)}
                          className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-yellow-500/50 transition-all text-left group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
                          <h3 className="text-white font-semibold text-base md:text-lg mb-2">{category.name}</h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{category.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {selectedCategory && (
                    <div className="flex justify-end mt-8">
                      <Button onClick={nextStep} className="btn-primary px-6">
                        Continuer
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Étape 2: Profil */}
              {currentStep === STEPS.PROFILE && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8 md:mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30"
                    >
                      <User className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Complétez votre profil
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                      Ajoutez des informations supplémentaires (optionnel)
                    </p>
                  </div>

                  <div className="space-y-5 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Biographie
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all resize-none"
                        placeholder="Parlez-nous de vous, vos réalisations, votre parcours..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </label>
                        <input
                          type="url"
                          value={profileData.facebook_url}
                          onChange={(e) => setProfileData({ ...profileData, facebook_url: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={profileData.instagram_url}
                          onChange={(e) => setProfileData({ ...profileData, instagram_url: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                          placeholder="https://instagram.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <Youtube className="w-4 h-4" />
                          YouTube
                        </label>
                        <input
                          type="url"
                          value={profileData.youtube_url}
                          onChange={(e) => setProfileData({ ...profileData, youtube_url: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Site web
                        </label>
                        <input
                          type="url"
                          value={profileData.website_url}
                          onChange={(e) => setProfileData({ ...profileData, website_url: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                          placeholder="https://votre-site.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-10">
                    <Button variant="outline" onClick={prevStep} className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Précédent
                    </Button>
                    <Button onClick={nextStep} className="btn-primary">
                      Continuer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Étape 3: Fichiers avec onglets */}
              {currentStep === STEPS.FILES && selectedCategory && (
                <div>
                  <div className="text-center mb-8 md:mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30"
                    >
                      <Upload className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Téléversez vos fichiers
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                      Ajoutez les fichiers requis pour votre candidature
                    </p>
                  </div>

                  {/* Onglets des médias requis */}
                  {requiredMediaTypes.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2 overflow-x-auto">
                        {requiredMediaTypes.map((mediaType, index) => {
                          const mediaConfig = MEDIA_TYPES[mediaType];
                          const Icon = mediaConfig.icon;
                          const filesForType = getFilesForType(mediaType);
                          const isComplete = filesForType.length > 0;
                          const isActive = activeMediaTab === index;

                          return (
                            <button
                              key={mediaType}
                              onClick={() => setActiveMediaTab(index)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm md:text-base transition-all relative ${
                                isActive
                                  ? 'bg-white/10 text-white border-b-2 border-yellow-500'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-yellow-400' : ''}`} />
                              <span>{mediaConfig.label}</span>
                              {isComplete && (
                                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 ml-1" />
                              )}
                              {!isComplete && (
                                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Contenu de l'onglet actif */}
                      <AnimatePresence mode="wait">
                        {requiredMediaTypes.map((mediaType, index) => {
                          if (index !== activeMediaTab) return null;
                          
                          const mediaConfig = MEDIA_TYPES[mediaType];
                          const Icon = mediaConfig.icon;
                          const filesForType = getFilesForType(mediaType);

                          return (
                            <motion.div
                              key={mediaType}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-6"
                            >
                              <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/10">
                                <div className="flex items-center gap-3 mb-6">
                                  <div className={`w-12 h-12 rounded-xl ${mediaConfig.bgColor} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${mediaConfig.iconColor}`} />
                                  </div>
                                  <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-white">{mediaConfig.label}</h3>
                                    <p className="text-gray-400 text-sm">Fichier requis pour cette catégorie</p>
                                  </div>
                                </div>

                                {/* Zone de drop */}
                                <div
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                      handleFileAdd(mediaType, e.dataTransfer.files);
                                    }
                                  }}
                                  onDragOver={(e) => e.preventDefault()}
                                  className="border-2 border-dashed border-white/20 rounded-xl p-8 md:p-12 text-center hover:border-yellow-500/50 transition-colors mb-6"
                                >
                                  <Upload className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                                  <h4 className="text-lg md:text-xl font-semibold text-white mb-2">
                                    Glissez vos fichiers ici
                                  </h4>
                                  <p className="text-gray-400 text-sm md:text-base mb-4">
                                    ou cliquez pour sélectionner
                                  </p>
                                  <input
                                    type="file"
                                    multiple
                                    accept={mediaType === 'photo' ? 'image/*' : mediaType === 'video' ? 'video/*' : mediaType === 'audio' ? 'audio/*' : '.pdf,.doc,.docx'}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleFileAdd(mediaType, e.target.files);
                                      }
                                    }}
                                    className="hidden"
                                    id={`file-upload-${mediaType}`}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => document.getElementById(`file-upload-${mediaType}`).click()}
                                    variant="outline"
                                    className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Sélectionner des fichiers
                                  </Button>
                                </div>

                                {/* Liste des fichiers */}
                                {filesForType.length > 0 && (
                                  <div className="space-y-3">
                                    {filesForType.map((file) => {
                                      const size = candidatureService.formatFileSize(file.file.size);
                                      
                                      return (
                                        <motion.div
                                          key={file.id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                                        >
                                          <Icon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                              {file.file.name}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                              {size}
                                            </p>
                                            <input
                                              type="text"
                                              placeholder="Titre du fichier (optionnel)"
                                              value={file.title}
                                              onChange={(e) => handleFileTitleUpdate(file.id, e.target.value)}
                                              className="mt-2 w-full bg-white/10 border border-white/20 rounded px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                                            />
                                          </div>
                                          <Button
                                            onClick={() => handleFileRemove(file.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 flex-shrink-0"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  {requiredMediaTypes.length === 0 && (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-gray-400">Aucun fichier requis pour cette catégorie</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-10">
                    <Button variant="outline" onClick={prevStep} className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Précédent
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="btn-primary"
                      disabled={!canProceed()}
                    >
                      Continuer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Étape 4: Récapitulatif */}
              {currentStep === STEPS.REVIEW && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8 md:mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30"
                    >
                      <FileCheck className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Récapitulatif
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                      Vérifiez vos informations avant de soumettre
                    </p>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {/* Catégorie */}
                    <div className="bg-white/5 rounded-xl p-5 md:p-6 border border-white/10">
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                        Catégorie
                      </h3>
                      <p className="text-white font-medium text-base md:text-lg">{selectedCategory?.name}</p>
                      <p className="text-gray-400 text-sm md:text-base mt-1">{selectedCategory?.description}</p>
                    </div>

                    {/* Profil */}
                    {(profileData.bio || profileData.facebook_url || profileData.instagram_url || 
                      profileData.youtube_url || profileData.website_url) && (
                      <div className="bg-white/5 rounded-xl p-5 md:p-6 border border-white/10">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                          <User className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                          Profil
                        </h3>
                        {profileData.bio && (
                          <p className="text-gray-300 text-sm md:text-base mb-3 leading-relaxed">{profileData.bio}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-3">
                          {profileData.facebook_url && (
                            <a href={profileData.facebook_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                              <Facebook className="w-4 h-4" />
                              Facebook
                            </a>
                          )}
                          {profileData.instagram_url && (
                            <a href={profileData.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 text-sm">
                              <Instagram className="w-4 h-4" />
                              Instagram
                            </a>
                          )}
                          {profileData.youtube_url && (
                            <a href={profileData.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm">
                              <Youtube className="w-4 h-4" />
                              YouTube
                            </a>
                          )}
                          {profileData.website_url && (
                            <a href={profileData.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm">
                              <LinkIcon className="w-4 h-4" />
                              Site web
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fichiers */}
                    <div className="bg-white/5 rounded-xl p-5 md:p-6 border border-white/10">
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                        Fichiers ({files.length})
                      </h3>
                      <div className="space-y-3">
                        {requiredMediaTypes.map((mediaType) => {
                          const mediaConfig = MEDIA_TYPES[mediaType];
                          const Icon = mediaConfig.icon;
                          const filesForType = getFilesForType(mediaType);
                          
                          if (filesForType.length === 0) return null;
                          
                          return (
                            <div key={mediaType} className="bg-white/5 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-5 h-5 text-yellow-400" />
                                <span className="text-white font-medium">{mediaConfig.label}</span>
                              </div>
                              {filesForType.map((file) => {
                                const size = candidatureService.formatFileSize(file.file.size);
                                return (
                                  <div key={file.id} className="ml-7 text-sm text-gray-300 py-1">
                                    <span className="font-medium">{file.file.name}</span>
                                    <span className="text-gray-500 mx-2">({size})</span>
                                    {file.title && (
                                      <span className="text-gray-400 italic">- {file.title}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-10">
                    <Button variant="outline" onClick={prevStep} disabled={isSubmitting} className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Précédent
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Soumission...
                        </>
                      ) : (
                        <>
                          Soumettre la candidature
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default CandidaturePage;
