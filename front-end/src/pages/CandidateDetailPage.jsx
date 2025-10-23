
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Vote, Share2, Youtube, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CandidateDetailPage = ({ candidate, onNavigate }) => {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fonctionnalité à venir !",
      description: "Cette fonctionnalité n'est pas encore implémentée, mais vous pouvez la demander dans votre prochain message ! 🚀",
    });
  };

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-400">Veuillez sélectionner un candidat.</p>
        <Button onClick={() => onNavigate('home')} className="mt-4">Retour à l'accueil</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{candidate.name} | Makona Awards 2025</title>
        <meta name="description" content={`Découvrez le profil de ${candidate.name}, candidat dans la catégorie ${candidate.category.title}.`} />
      </Helmet>
      <div className="container mx-auto px-4 py-12 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={() => onNavigate('vote')} variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux catégories
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="card-glass overflow-hidden sticky top-24">
              <img className="w-full h-auto object-cover" alt={candidate.photoAlt} src="https://images.unsplash.com/photo-1662911044124-8373f681d50f" />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white">{candidate.name}</h1>
                <p className="text-lg text-yellow-400 font-semibold">{candidate.category.title}</p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleNotImplemented} size="icon" variant="ghost"><Youtube /></Button>
                  <Button onClick={handleNotImplemented} size="icon" variant="ghost"><Instagram /></Button>
                  <Button onClick={handleNotImplemented} size="icon" variant="ghost"><Facebook /></Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex flex-col gap-6">
              <div className="card-glass p-6">
                <h2 className="text-2xl font-bold text-gradient-gold mb-4">Biographie</h2>
                <p className="text-gray-300 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  <br/><br/>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              <div className="card-glass p-6">
                <h2 className="text-2xl font-bold text-gradient-gold mb-4">Vidéo de Présentation</h2>
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                  <Button onClick={handleNotImplemented} variant="ghost" className="text-gray-400">
                    <Youtube className="w-12 h-12"/>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button onClick={handleNotImplemented} className="btn-primary flex-1 group">
                    <Vote className="w-5 h-5 mr-2 group-hover:animate-pulse"/> Voter pour {candidate.name}
                </Button>
                <Button onClick={handleNotImplemented} className="btn-secondary flex-1">
                    <Share2 className="w-5 h-5 mr-2"/> Partager ce profil
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CandidateDetailPage;
