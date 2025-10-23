
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const images = [
  { id: 1, alt: "Logo Makona Awards", text: "Logo officiel des Makona Awards" },
  { id: 2, alt: "Affiche Makona Awards", text: "Affiche officielle de l'édition 2025" },
];

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
  const [timeLeft, setTimeLeft] = useState({});
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = page % images.length;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const targetDate = new Date('2025-12-28T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      if (distance < 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(slideInterval);
  }, [page]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 md:pt-0 md:pb-0">
      <div className="absolute inset-0 bg-slate-900"></div>
      <SeaWaveAnimation />

      <motion.div 
        className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 -translate-x-1/3 -translate-y-1/3 z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="relative w-full h-full">
           <img className="w-full h-full object-cover rounded-full shadow-2xl opacity-40" alt="Affiche Makona Awards" src="/affiche.jpg" />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-900/70 to-slate-900"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">4ème Édition - Guéckédou 2025</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              <span className="text-white">Makona Awards</span>
              <span className="text-gradient-gold"> 2025</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0">
              Célébrer l'excellence, inspirer le changement dans la région de la Makona Union.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-8">
              <div className="flex items-center gap-2 text-gray-300"><Calendar className="w-5 h-5 text-yellow-400" /><span>28-30 Décembre 2025</span></div>
              <div className="flex items-center gap-2 text-gray-300"><MapPin className="w-5 h-5 text-green-400" /><span>Guéckédou, Guinée</span></div>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button onClick={() => onNavigate('vote')} className="btn-primary group">
                    Voter Maintenant <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button onClick={() => onNavigate('results')} className="btn-secondary">
                    Voir les Résultats
                </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-full max-w-lg h-[25rem] card-glass overflow-hidden mb-6">
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
                        <img className="w-full h-full object-cover" alt={images[imageIndex].alt} src={imageIndex === 0 ? "/logo.jpg" : "/affiche.jpg"} />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-semibold">{images[imageIndex].text}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <button onClick={() => paginate(-1)} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors z-20">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button onClick={() => paginate(1)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors z-20">
                    <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 w-full max-w-lg">
              {[{ label: 'Jours', value: timeLeft.days }, { label: 'Heures', value: timeLeft.hours }, { label: 'Minutes', value: timeLeft.minutes }, { label: 'Secondes', value: timeLeft.seconds }].map((item) => (
                <div key={item.label} className="card-glass p-3 text-center">
                  <div className="text-3xl font-bold text-gradient-gold">{(item.value || 0).toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400 uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
