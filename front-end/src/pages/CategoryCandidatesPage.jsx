
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Vote, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import candidatureService from '@/services/candidatureService';
import authService from '@/services/authService';

const mockCandidates = {
  danse: [
    { id: 'd1', name: 'Aïcha Keïta', photoAlt: 'Portrait of Aïcha Keïta', photoText: 'Aïcha Keïta, a graceful dancer' },
    { id: 'd2', name: 'Mory Fofana', photoAlt: 'Portrait of Mory Fofana', photoText: 'Mory Fofana, a powerful dancer' },
  ],
  musique: [
    { id: 'm1', name: 'Salif Konaté', photoAlt: 'Portrait of Salif Konaté', photoText: 'Salif Konaté, talented musician' },
    { id: 'm2', name: 'Binta Diallo', photoAlt: 'Portrait of Binta Diallo', photoText: 'Binta Diallo, soulful singer' },
    { id: 'm3', name: 'Alpha Bah', photoAlt: 'Portrait of Alpha Bah', photoText: 'Alpha Bah, modern beatmaker' },
  ],
};

const CategoryCandidatesPage = ({ category, onNavigateToCandidate, onNavigate }) => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category?.slug) {
      loadCandidates();
    }
  }, [category?.slug]);

  const loadCandidates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await candidatureService.getCandidaturesByCategory(category.slug);
      
      if (result.success) {
        setCandidates(result.candidatures);
      } else {
        setError(result.error);
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      setError("Une erreur est survenue lors du chargement des candidats");
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidats",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteClick = async (candidatureId) => {
    // Vérifier si l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour voter",
        variant: "destructive"
      });
      onNavigate('auth');
      return;
    }

    // Créer un fingerprint de device
    const fingerprintResult = await authService.createDeviceFingerprint();
    
    if (!fingerprintResult.success) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'empreinte du device",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implémenter le vote avec l'API
    toast({
      title: "🚧 Bientôt disponible !",
      description: "Le système de vote sera ouvert prochainement. Restez connectés ! 🚀",
    });
  };

  if (!category) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-400">Veuillez sélectionner une catégorie.</p>
        <Button onClick={() => onNavigate('home')} className="mt-4">Retour à l'accueil</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Candidats - {category.title} | Makona Awards 2025</title>
        <meta name="description" content={`Découvrez et votez pour les candidats de la catégorie ${category.title}.`} />
      </Helmet>
      <div className="container mx-auto px-4 py-12 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button onClick={() => onNavigate('home')} variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <category.icon className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400">Catégorie</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{category.title}</h1>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-400">Chargement des candidats...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={loadCandidates} variant="outline">
                Réessayer
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {candidates.map((candidature, index) => {
              const candidate = candidature.candidate;
              const photoFile = candidature.files?.find(file => file.file_type === 'photo');
              
              return (
                <motion.div
                  key={candidature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="card-glass group text-center overflow-hidden"
                >
                  <div className="relative h-64">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      alt={`Portrait de ${candidate.first_name} ${candidate.last_name}`}
                      src={photoFile ? candidatureService.getFileUrl(photoFile.file) : "https://images.unsplash.com/photo-1662911044124-8373f681d50f"}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1662911044124-8373f681d50f";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {candidate.first_name} {candidate.last_name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {candidate.country === 'guinea' && 'Guinée'}
                      {candidate.country === 'liberia' && 'Libéria'}
                      {candidate.country === 'sierra_leone' && 'Sierra Leone'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={() => onNavigateToCandidate({ 
                          ...candidature, 
                          category,
                          name: `${candidate.first_name} ${candidate.last_name}`,
                          photoAlt: `Portrait de ${candidate.first_name} ${candidate.last_name}`
                        })} 
                        className="flex-1 btn-secondary"
                      >
                        <User className="w-4 h-4 mr-2"/>
                        Voir Profil
                      </Button>
                      <Button 
                        onClick={() => handleVoteClick(candidature.id)} 
                        className="flex-1 btn-primary"
                      >
                        <Vote className="w-4 h-4 mr-2"/>
                        Voter
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {!isLoading && !error && candidates.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center col-span-full py-16">
            <p className="text-2xl text-gray-400">Les candidats pour cette catégorie seront bientôt annoncés.</p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default CategoryCandidatesPage;
