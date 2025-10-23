
import React, { useState, useRef, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Music, Mic, Shirt, Smile, Cpu, Users, Tv, Hand, ChevronDown, ChevronUp, ChevronLeft, ChevronRight as ChevronRightIcon, Loader2, AlertCircle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import categoryService from '@/services/categoryService';

    const allCategories = [
      {
        id: 'danse',
        icon: Hand,
        title: 'Danse',
        description: 'Célébration du mouvement et de l\'expression corporelle.',
        image: 'Dynamic contemporary African dancers in motion',
      },
      {
        id: 'musique',
        icon: Music,
        title: 'Musique',
        description: 'Mélodies et rythmes qui font vibrer la région.',
        image: 'Talented musician playing a traditional African instrument',
      },
      {
        id: 'slam',
        icon: Mic,
        title: 'Slam & Poésie',
        description: 'L\'art des mots et de l\'éloquence mis en lumière.',
        image: 'Poet performing spoken word on a dimly lit stage',
      },
      {
        id: 'mode',
        icon: Shirt,
        title: 'Mode & Design',
        description: 'La créativité et le savoir-faire des stylistes locaux.',
        image: 'Stunning African fashion design on a runway model',
      },
      {
        id: 'humour',
        icon: Smile,
        title: 'Humour',
        description: 'Les comédiens qui apportent la joie et le rire.',
        image: 'Comedian on stage making the audience laugh',
      },
      {
        id: 'tech',
        icon: Cpu,
        title: 'Innovation Tech',
        description: 'Les esprits brillants qui construisent le futur.',
        image: 'Young African tech innovator working on a computer',
      },
      {
        id: 'social',
        icon: Users,
        title: 'Entrepreneuriat Social',
        description: 'Les projets qui créent un impact positif durable.',
        image: 'Social entrepreneur working with a local community',
      },
      {
        id: 'media',
        icon: Tv,
        title: 'Média d\'Impact',
        description: 'Le journalisme qui informe et inspire le changement.',
        image: 'Journalist conducting an interview in the field',
      },
    ];

const CategoriesSection = ({ onNavigateToCategory }) => {
  const [showAll, setShowAll] = useState(false);
  const scrollContainerRef = useRef(null);
  const { toast } = useToast();
  
  // États pour l'API
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

      const handleScroll = (direction) => {
        const scrollAmount = 300 * direction;
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      };
      
      const handleCategoryClick = (category) => {
        onNavigateToCategory(category);
      };

  // Charger les catégories depuis l'API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.getCategories();
      
      if (result.success) {
        // Transformer les catégories pour le frontend
        const transformedCategories = categoryService.transformCategoriesForFrontend(result.categories);
        setCategories(transformedCategories);
      } else {
        setError(result.error);
        // Utiliser les catégories par défaut en cas d'erreur
        setCategories(allCategories);
        toast({
          title: "Avertissement",
          description: "Utilisation des catégories par défaut",
          variant: "destructive"
        });
      }
    } catch (error) {
      setError("Erreur de chargement");
      // Utiliser les catégories par défaut en cas d'erreur
      setCategories(allCategories);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(showAll) return;
    
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }, 5000);

    return () => clearInterval(interval);
  }, [showAll]);

      return (
        <section className="py-20 bg-slate-950/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start mb-12"
            >
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-white">Découvrez les</span>{' '}
                  <span className="text-gradient-gold">Catégories</span>
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl">
                  Huit domaines d'excellence pour célébrer les talents qui façonnent notre avenir.
                </p>
              </div>
              <div className="flex gap-4 self-center md:self-auto">
                {!showAll && (
                  <>
                  <Button onClick={() => handleScroll(-1)} variant="outline" size="icon" className="bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 shrink-0">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => handleScroll(1)} variant="outline" size="icon" className="bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 shrink-0">
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                  </>
                )}
                <Button onClick={() => setShowAll(!showAll)} variant="outline" className="bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 shrink-0">
                  {showAll ? 'Voir Moins' : 'Tout Voir'}
                  {showAll ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
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
                  <Button onClick={loadCategories} variant="outline">
                    Réessayer
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {!showAll && (
                      <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          ref={scrollContainerRef}
                          className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-6 scrollbar-hide"
                      >
                          {categories.map((category, index) => (
                              <motion.div
                                  key={category.id}
                                  initial={{ opacity: 0, x: 50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex-shrink-0 w-[280px]"
                              >
                                  <div className="card-glass h-full flex flex-col group overflow-hidden">
                                      <div className="relative h-40">
                                          <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={category.image} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                          <div className="absolute top-3 left-3 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                              <category.icon className="w-6 h-6 text-yellow-400" />
                                          </div>
                                      </div>
                                      <div className="p-5 flex flex-col flex-grow">
                                          <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                                          <p className="text-gray-400 text-sm mb-4 flex-grow">{category.description}</p>
                                          <Button onClick={() => handleCategoryClick(category)} className="w-full btn-secondary mt-auto">Explorer</Button>
                                      </div>
                                  </div>
                              </motion.div>
                          ))}
                      </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                {showAll && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="card-glass group overflow-hidden"
                            >
                                <div className="relative h-40">
                                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={category.image} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-3 left-3 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <category.icon className="w-6 h-6 text-yellow-400" />
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                                    <Button onClick={() => handleCategoryClick(category)} className="w-full btn-secondary">Explorer</Button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
              </AnimatePresence>
              </>
            )}
          </div>
        </section>
      );
    };

    export default CategoriesSection;
