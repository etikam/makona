
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Trophy, ArrowLeft, Loader2, AlertCircle, Sparkles, Award, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import categoryService from '@/services/categoryService';
import categoryClassService from '@/services/categoryClassService';

// Carte de prix moderne avec design premium
const CategoryCard = memo(({ award, onClick, onApply, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative h-full"
    >
      <div className="h-full bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-yellow-500/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/10">
        {/* Header avec gradient animé */}
        <div className="relative h-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-yellow-600/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Effet de brillance animé */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
          
          {/* Icône trophée */}
          <div className="relative h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            >
              <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
            </motion.div>
            
            {/* Badge de prix */}
            <div className="absolute top-3 right-3">
              <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-3 py-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-300">Prix</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5 flex flex-col flex-grow">
          <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {award.name}
          </h4>
          
          <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-grow leading-relaxed">
            {award.description || 'Un prix prestigieux pour récompenser l\'excellence.'}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="w-full bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 border border-slate-600/50 text-white font-medium py-2 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
            >
              Voir les candidats
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-semibold py-2 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Postuler
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

const CategoriesPage = ({ onNavigate }) => {
  const { toast } = useToast();
  const [groupedAwards, setGroupedAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const loadAwards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [classesRes, categoriesRes] = await Promise.all([
        categoryClassService.getCategoryClasses(),
        categoryService.getActiveCategories()
      ]);

      const classes = Array.isArray(classesRes) ? classesRes : (classesRes.results || classesRes || []);
      const categories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.results || categoriesRes || []);

      // Regrouper: classes = catégories de prix, catégories = prix
      const byClassId = new Map();
      classes.forEach(cls => byClassId.set(cls.id, { classInfo: cls, awards: [] }));
      categories.forEach(cat => {
        const key = typeof cat.category_class === 'object' ? cat.category_class.id : cat.category_class;
        if (!byClassId.has(key)) {
          byClassId.set(key, { classInfo: { id: key, name: 'Autres prix' }, awards: [] });
        }
        byClassId.get(key).awards.push(cat);
      });

      const groups = Array.from(byClassId.values()).filter(g => g.awards.length > 0);
      setGroupedAwards(groups);
      
      // Développer tous les groupes par défaut
      if (groups.length > 0) {
        setExpandedGroups(new Set(groups.map(g => g.classInfo.id)));
      }
    } catch (err) {
      setError("Erreur de chargement");
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAwards();
  }, [loadAwards]);

  // Filtrer et rechercher les catégories
  const filteredGroups = useMemo(() => {
    let filtered = groupedAwards;

    // Filtrer par catégorie de prix
    if (selectedClass !== 'all') {
      filtered = filtered.filter(group => group.classInfo.id.toString() === selectedClass);
    }

    // Filtrer par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.map(group => {
        const filteredAwards = group.awards.filter(award => {
          const nameMatch = award.name?.toLowerCase().includes(searchLower);
          const descMatch = award.description?.toLowerCase().includes(searchLower);
          const classMatch = group.classInfo.name?.toLowerCase().includes(searchLower);
          return nameMatch || descMatch || classMatch;
        });
        return { ...group, awards: filteredAwards };
      }).filter(group => group.awards.length > 0);
    }

    return filtered;
  }, [groupedAwards, searchTerm, selectedClass]);

  const toggleGroup = (classId) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  const handleCardClick = (award) => {
    onNavigate(`/vote/${award.id}`);
  };

  const handleApplyClick = (award) => {
    onNavigate('/candidature', { state: { categoryId: award.id } });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClass('all');
  };

  const hasActiveFilters = searchTerm.trim() || selectedClass !== 'all';
  const uniqueClasses = Array.from(new Set(groupedAwards.map(g => g.classInfo)));
  const totalResults = filteredGroups.reduce((total, group) => total + group.awards.length, 0);

  return (
    <>
      <Helmet>
        <title>Catégories de Prix - Makona Awards 2025</title>
        <meta name="description" content="Découvrez toutes les catégories de prix disponibles pour Makona Awards 2025. Recherchez et filtrez selon vos préférences." />
      </Helmet>

      <div className="min-h-screen py-12 md:py-16 px-4 bg-slate-950 relative overflow-hidden">
        {/* Background avec effets */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header avec bouton retour */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              onClick={() => onNavigate('/')}
              variant="ghost"
              className="mb-6 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Toutes les</span>{' '}
                <span className="text-gradient-gold">Catégories de Prix</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explorez toutes les catégories disponibles, recherchez par nom ou filtrez par type de prix
              </p>
            </div>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-2xl p-6 md:p-8 mb-8 hover:border-yellow-500/20 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher une catégorie ou un prix..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-400 h-14 text-base focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>

              {/* Filtre par catégorie de prix */}
              <div className="flex gap-3 flex-shrink-0">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[220px] h-14 bg-slate-900/50 border-slate-700/50 text-white focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20">
                    <Filter className="w-4 h-4 mr-2 text-yellow-400" />
                    <SelectValue placeholder="Catégorie de prix" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all" className="text-white hover:bg-slate-800">
                      Toutes les catégories
                    </SelectItem>
                    {uniqueClasses.map(cls => (
                      <SelectItem 
                        key={cls.id} 
                        value={cls.id.toString()} 
                        className="text-white hover:bg-slate-800"
                      >
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Bouton réinitialiser les filtres */}
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="h-14 border-slate-700/50 text-gray-300 hover:text-white hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>

            {/* Résultats */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2 text-sm text-gray-400"
              >
                <span className="text-yellow-400 font-semibold">{totalResults}</span>
                <span>prix trouvé{totalResults > 1 ? 's' : ''}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Contenu */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-24"
            >
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Chargement des catégories...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center py-24"
            >
              <div className="text-center max-w-md">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-6 text-lg">{error}</p>
                <Button onClick={loadAwards} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  Réessayer
                </Button>
              </div>
            </motion.div>
          ) : filteredGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-24"
            >
              <div className="text-center max-w-md">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2 font-semibold">Aucun résultat trouvé</p>
                <p className="text-gray-500 text-sm mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {filteredGroups.map((group, groupIndex) => {
                const isExpanded = expandedGroups.has(group.classInfo.id);
                
                return (
                  <motion.div
                    key={group.classInfo.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-yellow-500/10 rounded-2xl p-6 md:p-8 hover:border-yellow-500/20 transition-all duration-300"
                  >
                    {/* Header du groupe avec toggle */}
                    <button
                      onClick={() => toggleGroup(group.classInfo.id)}
                      className="w-full flex items-center justify-between mb-6 text-left group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" />
                          <h3 className="text-2xl md:text-3xl font-bold text-white">
                            <span className="text-gray-400">Catégorie:</span>{' '}
                            <span className="text-gradient-gold">{group.classInfo.name}</span>
                          </h3>
                        </div>
                        <p className="text-gray-400 ml-16 text-sm">
                          {group.awards.length} prix disponible{group.awards.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-yellow-400 group-hover:text-yellow-300 transition-colors"
                      >
                        <ChevronDown className="w-6 h-6" />
                      </motion.div>
                    </button>

                    {/* Grille des prix avec animation */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                            {group.awards.map((award, awardIndex) => (
                              <CategoryCard
                                key={award.id}
                                award={award}
                                onClick={() => handleCardClick(award)}
                                onApply={() => handleApplyClick(award)}
                                index={awardIndex}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
