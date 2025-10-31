
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import settingsService from '@/services/settingsService';

const SeaWaveAnimation = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <svg className="absolute bottom-0 left-0 w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(21, 94, 117, 0.8)" />
            <stop offset="100%" stopColor="rgba(30, 64, 175, 0.6)" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.7)" />
            <stop offset="100%" stopColor="rgba(21, 94, 117, 0.5)" />
          </linearGradient>
           <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.6)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#waveGradient1)"
          d="M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,176C672,181,768,139,864,133.3C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,176C672,181,768,139,864,133.3C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,197.3C672,171,768,149,864,160C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,176C672,181,768,139,864,133.3C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.path
          fill="url(#waveGradient2)"
          d="M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,240C672,245,768,203,864,197.3C960,192,1056,224,1152,240C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,240C672,245,768,203,864,197.3C960,192,1056,224,1152,240C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,256L48,240C96,224,192,192,288,192C384,192,480,224,576,218.7C672,213,768,171,864,154.7C960,139,1056,149,1152,176C1248,203,1344,245,1392,266.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,240C672,245,768,203,864,197.3C960,192,1056,224,1152,240C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 1 }}
        />
         <motion.path
          fill="url(#waveGradient3)"
          d="M0,256L48,266.7C96,277,192,299,288,288C384,277,480,235,576,218.7C672,203,768,213,864,229.3C960,245,1056,267,1152,277.3C1248,288,1344,288,1392,288L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,256L48,266.7C96,277,192,299,288,288C384,277,480,235,576,218.7C672,203,768,213,864,229.3C960,245,1056,267,1152,277.3C1248,288,1344,288,1392,288L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,250.7C672,267,768,277,864,261.3C960,245,1056,203,1152,192C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,256L48,266.7C96,277,192,299,288,288C384,277,480,235,576,218.7C672,203,768,213,864,229.3C960,245,1056,267,1152,277.3C1248,288,1344,288,1392,288L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 2 }}
        />
      </svg>
    </div>
  );
};


const HeroSection = ({ onNavigate }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [settings, setSettings] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  
  // Charger les paramètres et images du carousel
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsData, imagesData] = await Promise.all([
          settingsService.getPublicSettings(),
          settingsService.getActiveCarouselImages()
        ]);
        setSettings(settingsData);
        
        // Utiliser les images du backend ou les images par défaut
        if (imagesData && imagesData.length > 0) {
          setCarouselImages(imagesData);
        } else {
          // Images par défaut si aucune image dans le backend
          setCarouselImages([
            { id: 1, image_url: '/affiche.png', alt_text: "Affiche Makona Awards", title: "Affiche officielle de l'édition 2025" },
            { id: 2, image_url: '/affiche2.jpg', alt_text: "Affiche Makona Awards", title: "Affiche officielle de l'édition 2025" },
          ]);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Utiliser les images par défaut en cas d'erreur
        setCarouselImages([
          { id: 1, image_url: '/affiche.png', alt_text: "Affiche Makona Awards", title: "Affiche officielle de l'édition 2025" },
          { id: 2, image_url: '/affiche2.jpg', alt_text: "Affiche Makona Awards", title: "Affiche officielle de l'édition 2025" },
        ]);
      }
    };
    
    loadSettings();
  }, []);

  const imageIndex = page % (carouselImages.length || 1);

  // Decorative particles (non-blocking)
  const particles = useMemo(() => Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: Math.random() * 90 + '%',
    topStart: 10 + Math.random() * 70,
    size: 6 + Math.round(Math.random() * 10),
    delay: Math.random() * 3,
  })), []);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };


  // Auto-play du carousel basé sur les paramètres
  useEffect(() => {
    if (!settings || !settings.hero_carousel_enabled || !settings.hero_carousel_auto_play || carouselImages.length <= 1) {
      return;
    }
    
    const interval = settings.hero_carousel_interval || 5000;
    const slideInterval = setInterval(() => paginate(1), interval);
    return () => clearInterval(slideInterval);
  }, [page, settings, carouselImages.length]);

  // Déterminer quel bouton afficher selon l'état du chronomètre
  const showVoteButton = !settings?.countdown_enabled || !settings?.countdown_target_date || (new Date(settings.countdown_target_date).getTime() <= new Date().getTime());

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 md:pt-0 md:pb-0">
      <div className="absolute inset-0 bg-slate-900"></div>
      <SeaWaveAnimation />

      {/* Soft glow to fill negative space */}
      <div className="pointer-events-none absolute -left-32 top-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-yellow-500/10 via-amber-400/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-400/5 to-transparent blur-3xl" />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map(p => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.25)]"
            style={{ width: p.size, height: p.size, left: p.left }}
            initial={{ opacity: 0, y: p.topStart + 40 }}
            animate={{ opacity: [0, 1, 0.8, 0], y: [p.topStart + 40, p.topStart, p.topStart - 20, p.topStart - 60], scale: [0.8, 1, 1, 0.9] }}
            transition={{ duration: 10 + Math.random() * 6, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </div>

      <motion.div 
        className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 -translate-x-1/3 -translate-y-1/3 z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="relative w-full h-full">
           <img className="w-full h-full object-cover rounded-full shadow-2xl opacity-40" alt="Affiche Makona Awards" src="/affiche.png" />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-900/70 to-slate-900"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left lg:col-span-7 xl:col-span-6"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 md:px-6 py-1.5 md:py-2 mb-5 md:mb-6">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-[clamp(0.75rem,1.6vw,0.95rem)]">4ème Édition - Guéckédou 2025</span>
            </div>
            <motion.h1
              className="font-extrabold mb-5 leading-tight tracking-tight whitespace-normal xl:whitespace-nowrap text-[clamp(1.75rem,4.5vw,5rem)]"
            >
              {"Makona Awards ".split("").map((char, i) => (
                <motion.span
                  key={`ma-${i}`}
                  className="inline-block text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 8] }}
                  transition={{ duration: 6, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              {"2025".split("").map((char, i) => (
                <motion.span
                  key={`year-${i}`}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 8] }}
                  transition={{ duration: 6, repeat: Infinity, delay: ("Makona Awards ".length * 0.12) + i * 0.12, ease: 'easeInOut' }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                className="block h-1 mt-2 w-0 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300"
                initial={{ width: 0 }}
                animate={{ width: "8rem" }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </motion.h1>
            <p className="text-[clamp(1rem,1.6vw,1.25rem)] text-gray-300 mb-7 max-w-3xl mx-auto lg:mx-0">
              Célébrer l'excellence, inspirer le changement dans la région de la Makona Union.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-8">
              <div className="flex items-center gap-2 text-gray-300 text-[clamp(0.85rem,1.4vw,1rem)]"><Calendar className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" /><span>28-30 Décembre 2025</span></div>
              <div className="flex items-center gap-2 text-gray-300 text-[clamp(0.85rem,1.4vw,1rem)]"><MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-400" /><span>Guéckédou, Guinée</span></div>
            </div>
            
            {/* Highlights row - visible en premier sur mobile */}
            <div className="mb-6 lg:mt-6 flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3 max-w-2xl mx-auto lg:mx-0">
              {[
                { icon: Trophy, title: '40+ Prix', subtitle: 'Catégories de prix' },
                { icon: Calendar, title: '28–30 Déc.', subtitle: 'Guéckédou, Guinée' },
                { icon: MapPin, title: 'Makona Union', subtitle: 'Excellence régionale' },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="card-glass px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2.5 sm:gap-3 border border-yellow-500/10 rounded-xl hover:border-yellow-500/20 transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="flex-shrink-0 p-1.5 sm:p-2 bg-yellow-500/10 rounded-lg">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold leading-tight text-xs sm:text-sm truncate">{item.title}</p>
                    <p className="text-[0.65rem] sm:text-xs text-gray-400 truncate">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton Voter */}
            {showVoteButton && (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start mb-6 lg:mb-0">
                <Button 
                  onClick={() => onNavigate('vote')} 
                  className="btn-primary group w-fit px-4 py-2.5 sm:px-6 md:px-8 sm:py-3.5 md:py-4 rounded-full sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base md:text-lg font-semibold">
                      <span className="sm:hidden">Voter</span>
                      <span className="hidden sm:inline">Voter Maintenant</span>
                    </span>
                    <ArrowRight className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:col-span-5 xl:col-span-6"
          >
            <div className="relative w-full h-[26rem] md:h-[32rem] xl:h-[36rem] 3xl:h-[40rem] card-glass overflow-hidden mb-6">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={{
                            enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
                            center: { x: '0%', opacity: 1 },
                            exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="absolute w-full h-full"
                    >
                        {carouselImages.length > 0 && carouselImages[imageIndex] && (
                          <>
                            <img className="w-full h-full object-cover" alt={carouselImages[imageIndex].alt_text || carouselImages[imageIndex].title} src={carouselImages[imageIndex].image_url} />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-semibold">{carouselImages[imageIndex].title || carouselImages[imageIndex].alt_text}</p>
                            </div>
                          </>
                        )}
                    </motion.div>
                </AnimatePresence>
                <button onClick={() => paginate(-1)} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors z-20">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button onClick={() => paginate(1)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors z-20">
                    <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
