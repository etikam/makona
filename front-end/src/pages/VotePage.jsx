
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Music, GraduationCap, Briefcase, Tv, Leaf, Users, ChevronRight, Vote, Loader2, AlertCircle } from 'lucide-react';
import CategoryVoting from '@/components/vote/CategoryVoting';
import categoryService from '@/services/categoryService';
import authService from '@/services/authService';

const VotePage = ({ user, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votedCategories, setVotedCategories] = useState([]);

  // Charger les catégories depuis l'API
  useEffect(() => {
    loadCategories();
    loadUserVotes();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.getCategories();
      
      if (result.success) {
        const transformedCategories = categoryService.transformCategoriesForFrontend(result.categories);
        setCategories(transformedCategories);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Erreur de chargement des catégories");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserVotes = () => {
    // TODO: Charger les votes depuis l'API
    const userVotes = JSON.parse(localStorage.getItem('makonaVotes') || '[]');
    setVotedCategories(userVotes.map(v => v.categoryId));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-glass p-8 text-center max-w-md">
          <Vote className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connexion Requise</h2>
          <p className="text-gray-400 mb-6">
            Vous devez être connecté pour voter
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="btn-primary w-full"
          >
            Se Connecter
          </button>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <CategoryVoting
        category={selectedCategory}
        user={user}
        onBack={() => setSelectedCategory(null)}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Voter - Makona Awards 2025</title>
        <meta name="description" content="Votez pour vos candidats préférés dans chaque catégorie de Makona Awards 2025" />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Choisissez une</span>{' '}
              <span className="text-gradient-gold">Catégorie</span>
            </h1>
            <p className="text-xl text-gray-300">
              Votez pour vos candidats préférés dans chaque catégorie
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-2">
              <span className="text-yellow-400 font-semibold">
                {votedCategories.length}/6 catégories votées
              </span>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-400">Chargement des catégories...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={loadCategories}
                  className="btn-secondary"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
              const hasVoted = votedCategories.includes(category.id);
              
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedCategory(category)}
                  className="card-glass p-8 text-left group relative overflow-hidden"
                >
                  {hasVoted && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Vote className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-yellow-400 transition-colors">
                    <span>{hasVoted ? 'Vote enregistré' : 'Voter maintenant'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VotePage;
  