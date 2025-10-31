
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Trophy } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import categoryService from '@/services/categoryService';
import categoryClassService from '@/services/categoryClassService';

// Composant de carte de prix
const AwardCard = React.memo(({ award, onClick, cardRef }) => {
  return (
    <div 
      ref={cardRef}
      className="flex-shrink-0" 
      style={{ width: 'clamp(280px, 30vw, 320px)' }}
      data-award-card
    >
      <div className="card-glass h-full flex flex-col overflow-hidden border-transparent hover:border-yellow-500/20 transition-colors">
        {/* Header avec icône trophée */}
        <div className="relative h-44 md:h-48 flex items-center justify-center bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-yellow-500/20">
          <Trophy className="w-20 h-20 text-yellow-400 opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Contenu */}
        <div className="p-5 md:p-6 flex flex-col flex-grow bg-slate-900/50">
          <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {award.name}
          </h4>
          <p className="text-xs text-gray-400 mb-4 line-clamp-3 flex-grow">
            {award.description || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
          </p>
          <Button 
            onClick={onClick} 
            className="btn-secondary mt-auto bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-800"
          >
            Voir les candidats
          </Button>
        </div>
      </div>
    </div>
  );
});

AwardCard.displayName = 'AwardCard';

// Hook pour gérer le scroll infini
const useInfiniteScroll = (containerRef, cardsCount, cardRefsRef) => {
  const scrollIntervalRef = useRef(null);
  const isUserInteractingRef = useRef(false);
  const userInteractionTimeoutRef = useRef(null);
  const currentCardIndexRef = useRef(0);

  const getCardWidth = useCallback(() => {
    const firstCard = cardRefsRef.current.get(0);
    if (firstCard) {
      return firstCard.offsetWidth + 24; // card width + gap (space-x-6 = 24px)
    }
    return 304; // fallback: 280px + 24px gap
  }, [cardRefsRef]);

  const scrollToCard = useCallback((index) => {
    const container = containerRef.current;
    if (!container || cardsCount <= 1) return;

    const cardElement = cardRefsRef.current.get(index);
    if (!cardElement) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();
    
    // Centrer la carte dans le container
    const scrollLeft = cardRect.left - containerRect.left + container.scrollLeft - (containerRect.width - cardRect.width) / 2;
    
    container.scrollTo({ 
      left: Math.max(0, scrollLeft), 
      behavior: 'smooth' 
    });
  }, [containerRef, cardRefsRef]);

  const scrollToNext = useCallback(() => {
    const container = containerRef.current;
    if (!container || cardsCount <= 1) return;

    const cardWidth = getCardWidth();
    const maxScroll = cardWidth * cardsCount;
    const totalScroll = maxScroll * 2;
    const currentScroll = container.scrollLeft;

    // Déterminer si on est dans les cartes originales ou dupliquées
    const isInDuplicates = currentScroll >= maxScroll;
    
    // Calculer l'index actuel basé sur la position
    let currentIndex = Math.round(currentScroll / cardWidth);
    if (isInDuplicates) {
      currentIndex = currentIndex - cardsCount;
    }
    
    // Calculer le prochain index
    const nextIndex = (currentIndex + 1) % cardsCount;
    currentCardIndexRef.current = nextIndex;

    // Si on va vers la dernière carte (index cardsCount - 1), utiliser les cartes dupliquées
    // Sinon, rester dans les cartes originales si possible
    if (nextIndex === cardsCount - 1 && currentScroll >= maxScroll - cardWidth * 0.5) {
      // Aller vers la dernière carte dans les dupliquées
      scrollToCard(nextIndex + cardsCount);
    } else if (nextIndex === 0 && currentScroll >= maxScroll) {
      // Si on revient à la première carte depuis les dupliquées, utiliser les originales
      scrollToCard(0);
    } else if (currentScroll >= maxScroll) {
      // Rester dans les dupliquées si on y est déjà
      scrollToCard(nextIndex + cardsCount);
    } else {
      // Rester dans les originales
      scrollToCard(nextIndex);
    }
  }, [containerRef, cardsCount, getCardWidth, scrollToCard]);

  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) return;
    
    scrollIntervalRef.current = setInterval(() => {
      if (!isUserInteractingRef.current) {
        scrollToNext();
      }
    }, 4000);
  }, [scrollToNext]);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const handleUserInteraction = useCallback(() => {
    isUserInteractingRef.current = true;
    
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    
    userInteractionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 5000);
  }, []);

  const scroll = useCallback((direction) => {
    const container = containerRef.current;
    if (!container || cardsCount <= 1) return;

    const cardWidth = getCardWidth();
    const maxScroll = cardWidth * cardsCount;
    
    // Trouver la carte la plus proche du centre
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestCardIndex = 0;
    let minDistance = Infinity;
    
    // Vérifier d'abord si on est dans les cartes dupliquées
    const currentScroll = container.scrollLeft;
    const isInDuplicates = currentScroll >= maxScroll;
    
    // Limiter la recherche aux cartes visibles selon la zone de scroll
    const searchStart = isInDuplicates ? cardsCount : 0;
    const searchEnd = isInDuplicates ? cardsCount * 2 : cardsCount;
    
    for (let i = searchStart; i < searchEnd; i++) {
      const card = cardRefsRef.current.get(i);
      if (card) {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCardIndex = i;
        }
      }
    }

    // Convertir l'index dupliqué en index original
    let targetIndex = closestCardIndex;
    if (targetIndex >= cardsCount) {
      targetIndex = targetIndex - cardsCount;
    }

    // Calculer le nouvel index
    let newIndex = targetIndex + direction;
    if (newIndex < 0) newIndex = cardsCount - 1;
    if (newIndex >= cardsCount) newIndex = 0;

    currentCardIndexRef.current = newIndex;
    
    // Si on va vers la dernière carte, utiliser les cartes dupliquées pour permettre le scroll complet
    if (newIndex === cardsCount - 1 && direction === 1) {
      // Aller vers la dernière carte dans les dupliquées
      scrollToCard(newIndex + cardsCount);
    } else {
      // Sinon, utiliser les cartes originales
      scrollToCard(newIndex);
    }
    
    handleUserInteraction();
  }, [containerRef, cardsCount, getCardWidth, cardRefsRef, scrollToCard, handleUserInteraction]);

  useEffect(() => {
    return () => {
      stopAutoScroll();
      if (userInteractionTimeoutRef.current) {
        clearTimeout(userInteractionTimeoutRef.current);
      }
    };
  }, [stopAutoScroll]);

  return { startAutoScroll, stopAutoScroll, scroll, handleUserInteraction };
};

// Composant de groupe de prix
const AwardGroup = React.memo(({ group, onNavigateToCategory }) => {
  const containerRef = useRef(null);
  const cardRefsRef = useRef(new Map());

  const { startAutoScroll, stopAutoScroll, scroll, handleUserInteraction } = useInfiniteScroll(
    containerRef, 
    group.awards.length,
    cardRefsRef
  );

  // Centrer la première carte au démarrage
  useEffect(() => {
    const container = containerRef.current;
    const firstCard = cardRefsRef.current.get(0);
    
    if (container && firstCard && group.awards.length > 0) {
      // Attendre que les cartes soient rendues et que les dimensions soient calculées
      const timer = setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        const cardRect = firstCard.getBoundingClientRect();
        
        if (containerRect.width > 0 && cardRect.width > 0) {
          // Centrer la première carte dans le container visible
          const cardWidth = firstCard.offsetWidth;
          const containerWidth = containerRect.width;
          
          // Position actuelle de la carte par rapport au container
          const cardPosition = cardRect.left - containerRect.left + container.scrollLeft;
          
          // Calculer le scrollLeft nécessaire pour centrer
          const scrollLeft = cardPosition - (containerWidth - cardWidth) / 2;
          
          // S'assurer que le scroll ne dépasse pas les limites
          const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
          const finalScrollLeft = Math.max(0, Math.min(scrollLeft, maxScroll));
          
          container.scrollLeft = finalScrollLeft;
          
          // Démarrer l'auto-scroll après centrage
          if (group.awards.length > 1) {
            setTimeout(() => startAutoScroll(), 1500);
          }
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      stopAutoScroll();
    };
  }, [group.awards.length, startAutoScroll, stopAutoScroll]);

  // Gestion du reset du scroll pour la boucle infinie
  useEffect(() => {
    const container = containerRef.current;
    if (!container || group.awards.length <= 1) return;

    const handleScroll = () => {
      const firstCard = cardRefsRef.current.get(0);
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth + 24; // card + gap
      const maxScroll = cardWidth * group.awards.length;
      const totalScroll = maxScroll * 2; // cartes originales + dupliquées
      
      // Reset silencieux uniquement quand on atteint vraiment la fin des cartes dupliquées
      // On utilise un seuil très proche de la fin pour permettre de voir la dernière carte complètement
      const resetThreshold = totalScroll - (cardWidth * 0.1); // Reset seulement dans les 10% finaux
      if (container.scrollLeft >= resetThreshold) {
        // Reset vers les cartes originales en maintenant la position relative
        const relativePosition = container.scrollLeft - maxScroll;
        container.scrollLeft = relativePosition;
      }
      // Si on revient en arrière et qu'on est avant le début des cartes originales, 
      // on saute vers les cartes dupliquées correspondantes
      else if (container.scrollLeft < 0) {
        container.scrollLeft = container.scrollLeft + maxScroll;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [group.awards.length]);

  const handleCardClick = useCallback((award) => {
    onNavigateToCategory(award);
  }, [onNavigateToCategory]);

  const setCardRef = useCallback((index, element) => {
    if (element) {
      cardRefsRef.current.set(index, element);
    }
  }, []);

  return (
    <div className="mb-12 md:mb-16">
      {/* Header de la catégorie */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
        <h3 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-white text-center sm:text-left">
          <span className="text-gray-400">Catégorie de prix:</span>{' '}
          <span className="text-gradient-gold">{group.classInfo.name}</span>
        </h3>
        <div className="flex gap-2">
          <Button 
            onClick={() => scroll(-1)} 
            variant="outline" 
            size="icon" 
            className="bg-slate-800/50 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500 hover:text-yellow-300 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            onClick={() => scroll(1)} 
            variant="outline" 
            size="icon" 
            className="bg-slate-800/50 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500 hover:text-yellow-300 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Container de défilement avec boucle infinie */}
      <div className="flex justify-center w-full">
        <div 
          ref={containerRef}
          onWheel={handleUserInteraction}
          onTouchStart={handleUserInteraction}
          className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-6 scrollbar-hide w-full max-w-6xl"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
        >
          {/* Cartes originales */}
          {group.awards.map((award, index) => (
            <AwardCard 
              key={`original-${award.id}`} 
              award={award} 
              onClick={() => handleCardClick(award)}
              cardRef={(el) => setCardRef(index, el)}
            />
          ))}
          
          {/* Cartes dupliquées pour la boucle infinie */}
          {group.awards.map((award, index) => (
            <AwardCard 
              key={`duplicate-${award.id}-${index}`} 
              award={award} 
              onClick={() => handleCardClick(award)}
              cardRef={(el) => setCardRef(index + group.awards.length, el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

AwardGroup.displayName = 'AwardGroup';

// Composant principal
const CategoriesSection = ({ onNavigateToCategory }) => {
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

      return (
    <section className="py-20 md:py-24 lg:py-28 bg-slate-950/50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
            >
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4">
                  <span className="text-white">Découvrez les</span>{' '}
            <span className="text-gradient-gold">Prix</span>
                </h2>
          <p className="text-[clamp(1rem,1.8vw,1.25rem)] text-gray-300 max-w-3xl mx-auto">
            Les prix sont regroupés par catégories de prix, faites défiler chaque groupe pour découvrir les candidats.
          </p>
            </motion.div>

        {/* Contenu */}
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
              <Button onClick={loadAwards} variant="outline">
                    Réessayer
                  </Button>
                </div>
              </div>
            ) : (
          <div className="space-y-12 md:space-y-16">
            {groupedAwards.map((group) => (
              <AwardGroup 
                key={group.classInfo.id} 
                group={group} 
                onNavigateToCategory={onNavigateToCategory}
              />
            ))}
                                </div>
            )}
          </div>
        </section>
      );
    };

    export default CategoriesSection;
