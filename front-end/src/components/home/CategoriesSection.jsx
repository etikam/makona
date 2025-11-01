
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Loader2, AlertCircle, Sparkles, Award, Image, Video, FileText, Music, Folder, Medal, DollarSign, ScrollText, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import categoryService from '@/services/categoryService';
import categoryClassService from '@/services/categoryClassService';

// Icônes pour les médias requis
const MediaIcon = ({ type }) => {
  const icons = {
    photo: { Icon: Image, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    video: { Icon: Video, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
    portfolio: { Icon: Folder, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    audio: { Icon: Music, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
    documents: { Icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  };
  
  const config = icons[type];
  if (!config) return null;
  
  const { Icon, color, bg, border } = config;
  
  return (
    <div className={`w-4 h-4 rounded-md ${bg} ${border} border flex items-center justify-center flex-shrink-0`} title={type}>
      <Icon className={`w-2.5 h-2.5 ${color}`} />
    </div>
  );
};

// Icônes pour les types de prix
const AwardTypeIcon = ({ type }) => {
  const icons = {
    trophy: { Icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', label: 'Trophée' },
    certificate: { Icon: ScrollText, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', label: 'Satisfecit' },
    monetary: { Icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', label: 'Prime' },
    plaque: { Icon: Medal, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: 'Plaque' },
  };
  
  const config = icons[type];
  if (!config) return null;
  
  const { Icon, color, bg, border, label } = config;
  
  return (
    <div className={`w-4 h-4 rounded-md ${bg} ${border} border flex items-center justify-center flex-shrink-0`} title={label}>
      <Icon className={`w-2.5 h-2.5 ${color}`} />
    </div>
  );
};

// Carte de prix compacte avec informations
const AwardCard = React.memo(({ award, onClick, onApply, index = 0 }) => {
  // Médias requis
  const requiredMedia = [];
  if (award.requires_photo) requiredMedia.push('photo');
  if (award.requires_video) requiredMedia.push('video');
  if (award.requires_portfolio) requiredMedia.push('portfolio');
  if (award.requires_audio) requiredMedia.push('audio');
  if (award.requires_documents) requiredMedia.push('documents');
  
  // Types de prix
  const awardTypes = [];
  if (award.awards_trophy) awardTypes.push('trophy');
  if (award.awards_certificate) awardTypes.push('certificate');
  if (award.awards_monetary) awardTypes.push('monetary');
  if (award.awards_plaque) awardTypes.push('plaque');
  
  // Nombre de candidats
  const candidatesCount = award.candidatures_count || award.approved_candidates_count || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative h-full w-full max-w-[420px] mx-auto"
    >
      <div className="h-full w-full bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/10">
        {/* Header compact avec icône trophée */}
        <div className="relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/25 via-amber-500/15 to-yellow-600/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
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
            <Trophy className="w-12 h-12 text-yellow-400/80 drop-shadow-md" />
          </div>
        </div>

        {/* Contenu compact et centré */}
        <div className="p-4 flex flex-col flex-grow items-center text-center">
          <h4 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {award.name}
          </h4>
          
          <p className="text-xs text-gray-400 mb-3 line-clamp-1 leading-relaxed px-1">
            {award.description ? (award.description.length > 60 ? award.description.substring(0, 57) + '...' : award.description) : 'Prix prestigieux'}
          </p>

          {/* Médias requis et Types de prix - sur une seule ligne séparés par une barre */}
          {(requiredMedia.length > 0 || awardTypes.length > 0) && (
            <div className="mb-2 w-full flex items-center justify-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
              {/* Médias requis */}
              {requiredMedia.length > 0 && (
                <>
                  {requiredMedia.map((media, idx) => (
                    <MediaIcon key={idx} type={media} />
                  ))}
                </>
              )}
              
              {/* Barre verticale de séparation */}
              {(requiredMedia.length > 0 && awardTypes.length > 0) && (
                <div className="h-4 w-px bg-gray-600/50 mx-1 flex-shrink-0" />
              )}
              
              {/* Types de prix */}
              {awardTypes.length > 0 && (
                <>
                  {awardTypes.map((type, idx) => (
                    <AwardTypeIcon key={idx} type={type} />
                  ))}
                </>
              )}
            </div>
          )}

          {/* Nombre de candidats inscrits */}
          <div className="mb-2 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Users className="w-3.5 h-3.5 text-yellow-400" />
            <span>{candidatesCount} candidat{candidatesCount > 1 ? 's' : ''}</span>
          </div>

          {/* Actions - sur une seule ligne */}
          <div className="flex gap-2 mt-auto pt-2 w-full">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex-1 bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 border border-slate-600/50 text-white font-medium py-1.5 text-[10px] transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
            >
              Voir
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-semibold py-1.5 text-[10px] transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 flex items-center justify-center gap-1"
            >
              <Award className="w-3 h-3" />
              Postuler
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

AwardCard.displayName = 'AwardCard';

// Composant de groupe avec grille moderne
const AwardGroup = React.memo(({ group, onNavigateToCategory }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Vérifier si on peut scroller
  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    checkScrollability();
    container.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);
    
    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, group.awards.length]);

  const scroll = useCallback((direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = 400; // Largeur approximative d'une carte + gap
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const handleCardClick = useCallback((award) => {
    onNavigateToCategory(award);
  }, [onNavigateToCategory]);

  const handleApplyClick = useCallback((award) => {
    if (onNavigateToCategory) {
      onNavigateToCategory({ ...award, apply: true });
    }
  }, [onNavigateToCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Header du groupe */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
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

      {/* Conteneur horizontal scrollable pour les prix - mobile et desktop */}
      <div className="relative w-full">
        {/* Flèche gauche */}
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 backdrop-blur-sm border border-yellow-500/30 rounded-full p-2 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all shadow-lg"
            aria-label="Défiler vers la gauche"
          >
            <ChevronLeft className="w-5 h-5 text-yellow-400" />
          </button>
        )}
        
        {/* Gradient de gauche */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none z-[5]" />
        )}
        
        {/* Conteneur scrollable */}
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 scroll-smooth"
          onScroll={checkScrollability}
        >
          <div className="flex gap-4 min-w-max">
            <AnimatePresence>
              {group.awards.map((award, index) => (
                <div key={award.id} className="flex-shrink-0" style={{ width: 'min(420px, calc(100vw - 3rem))' }}>
                  <AwardCard
                    award={award}
                    onClick={() => handleCardClick(award)}
                    onApply={() => handleApplyClick(award)}
                    index={index}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Gradient de droite */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none z-[5]" />
        )}
        
        {/* Flèche droite */}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 backdrop-blur-sm border border-yellow-500/30 rounded-full p-2 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all shadow-lg"
            aria-label="Défiler vers la droite"
          >
            <ChevronRight className="w-5 h-5 text-yellow-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
});

AwardGroup.displayName = 'AwardGroup';

// Composant principal
const CategoriesSection = ({ onNavigateToCategory, onNavigate }) => {
  const { toast } = useToast();
  const [groupedAwards, setGroupedAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

      setGroupedAwards(Array.from(byClassId.values()).filter(g => g.awards.length > 0));
    } catch (err) {
      setError("Erreur de chargement");
      toast({
        title: "Erreur",
        description: "Impossible de charger les prix",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAwards();
  }, [loadAwards]);

  // Limiter à 2 catégories pour l'affichage
  const displayedGroups = useMemo(() => groupedAwards.slice(0, 2), [groupedAwards]);
  const hasMore = groupedAwards.length > 2;

  return (
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Background spécial avec effets animés */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Orbes animés colorés */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      
      {/* Grille de motifs décoratifs */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(234, 179, 8, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(234, 179, 8, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>
      
      {/* Particules flottantes dorées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Rayons de lumière animés */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-yellow-500/20 to-transparent"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent"
          animate={{
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-yellow-600/15 to-transparent"
          animate={{
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      
      {/* Couche de gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header de la section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" />
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div className="h-1 flex-1 bg-gradient-to-r from-yellow-500 to-transparent rounded-full" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            <span className="text-white">Découvrez les</span>{' '}
            <span className="text-gradient-gold">Prix</span>
          </h2>
          
          <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed">
            Explorez notre sélection de prix prestigieux, organisés par catégories. 
            Chaque prix récompense l'excellence dans son domaine.
          </p>
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
        ) : displayedGroups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune catégorie disponible pour le moment</p>
          </motion.div>
        ) : (
          <>
            {/* Grille avec 2 catégories */}
            <div className="space-y-10 md:space-y-12 mb-12">
              {displayedGroups.map((group, index) => (
                <AwardGroup
                  key={group.classInfo.id}
                  group={group}
                  onNavigateToCategory={onNavigateToCategory}
                />
              ))}
            </div>

            {/* Bouton "Voir toutes les catégories" */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-4 mt-12"
              >
                <div className="flex items-center gap-4 w-full max-w-md">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
                </div>
                
                <Button
                  onClick={() => onNavigate && onNavigate('/categories')}
                  className="group relative bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-400 text-slate-900 font-bold px-10 py-6 text-lg rounded-full shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Voir toutes les catégories
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                </Button>
                
                <p className="text-sm text-gray-400 text-center max-w-md">
                  Découvrez toutes les catégories de prix disponibles avec recherche et filtres avancés
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
