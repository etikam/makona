
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Vote, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CategoryVoting = ({ category, user, onBack, onNavigate }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const mockCandidates = [
    {
      id: 1,
      name: 'Amadou Diallo',
      bio: 'Artiste et musicien reconnu pour son engagement dans la préservation de la culture locale',
      image: 'Portrait of talented African musician with traditional instruments',
      videoUrl: '#'
    },
    {
      id: 2,
      name: 'Fatou Kamara',
      bio: 'Entrepreneure sociale innovante dans le domaine de l\'éducation',
      image: 'Professional African businesswoman in modern office setting',
      videoUrl: '#'
    },
    {
      id: 3,
      name: 'Ibrahim Sesay',
      bio: 'Leader communautaire dédié au développement durable',
      image: 'African community leader speaking at public event',
      videoUrl: '#'
    },
    {
      id: 4,
      name: 'Mariama Koroma',
      bio: 'Journaliste primée pour son travail sur les enjeux sociaux',
      image: 'Professional African journalist with camera equipment',
      videoUrl: '#'
    }
  ];

  const userVotes = JSON.parse(localStorage.getItem('makonaVotes') || '[]');
  const hasVoted = userVotes.some(v => v.categoryId === category.id);
  const existingVote = userVotes.find(v => v.categoryId === category.id);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast({
        title: "Aucun candidat sélectionné",
        description: "Veuillez sélectionner un candidat avant de voter.",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);

    setTimeout(() => {
      const candidate = mockCandidates.find(c => c.id === selectedCandidate);
      const newVote = {
        categoryId: category.id,
        category: category.title,
        candidateId: selectedCandidate,
        candidate: candidate.name,
        timestamp: new Date().toISOString()
      };

      const updatedVotes = hasVoted
        ? userVotes.map(v => v.categoryId === category.id ? newVote : v)
        : [...userVotes, newVote];

      localStorage.setItem('makonaVotes', JSON.stringify(updatedVotes));

      setIsVoting(false);
      
      toast({
        title: "Vote enregistré !",
        description: `Votre vote pour ${candidate.name} a été enregistré avec succès.`,
      });

      setTimeout(() => {
        onBack();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux catégories
          </button>

          <div className="card-glass p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{category.title}</h1>
                {hasVoted && (
                  <div className="flex items-center gap-2 text-green-400 mt-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Vous avez déjà voté dans cette catégorie</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-400">
              Sélectionnez votre candidat préféré et votez pour lui
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {mockCandidates.map((candidate) => {
              const isSelected = selectedCandidate === candidate.id;
              const isCurrentVote = existingVote?.candidateId === candidate.id;

              return (
                <motion.div
                  key={candidate.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCandidate(candidate.id)}
                  className={`card-glass p-6 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-yellow-500 bg-yellow-500/10' : ''
                  } ${isCurrentVote ? 'ring-2 ring-green-500 bg-green-500/10' : ''}`}
                >
                  <div className="relative mb-4 rounded-xl overflow-hidden aspect-video bg-slate-800">
                    <img 
                      className="w-full h-full object-cover"
                      alt={`Photo de ${candidate.name}`}
                     src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors group">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{candidate.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{candidate.bio}</p>

                  <div className="flex items-center justify-between">
                    {isCurrentVote && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Votre vote actuel</span>
                      </div>
                    )}
                    {isSelected && !isCurrentVote && (
                      <div className="flex items-center gap-2 text-yellow-400 text-sm">
                        <Vote className="w-4 h-4" />
                        <span>Sélectionné</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="card-glass p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-white font-semibold mb-1">
                  {selectedCandidate 
                    ? `Candidat sélectionné: ${mockCandidates.find(c => c.id === selectedCandidate)?.name}`
                    : 'Aucun candidat sélectionné'
                  }
                </p>
                <p className="text-sm text-gray-400">
                  {hasVoted ? 'Vous pouvez modifier votre vote' : 'Un seul vote par catégorie'}
                </p>
              </div>
              <Button
                onClick={handleVote}
                disabled={!selectedCandidate || isVoting}
                className="btn-primary w-full sm:w-auto"
              >
                {isVoting ? 'Vote en cours...' : hasVoted ? 'Modifier mon Vote' : 'Confirmer mon Vote'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryVoting;
  