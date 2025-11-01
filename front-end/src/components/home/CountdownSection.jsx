
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import settingsService from '@/services/settingsService';

// Composant pour un chiffre avec effet de chute
const FlipDigit = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value && value !== undefined) {
      setIsFlipping(true);
      setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 150);
      prevValueRef.current = value;
    }
  }, [value]);

  return (
      <div className="relative w-full">
      <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-yellow-500/20 rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 overflow-hidden transition-all duration-300 hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/20 group">
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
        
        {/* Gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-yellow-500/20 via-amber-500/10 to-transparent" />
        
        {/* Contenu */}
        <div className="relative z-10 text-center">
          {/* Valeur avec effet de chute - taille adaptative */}
          <div className="relative h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 flex items-center justify-center mb-1.5 md:mb-2 lg:mb-3 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayValue}
                initial={{ y: -50, opacity: 0, rotateX: -90 }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
                exit={{ 
                  y: 50, 
                  opacity: 0, 
                  rotateX: 90,
                  transition: { duration: 0.3 }
                }}
                className="font-bold text-gradient-gold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl drop-shadow-lg leading-tight absolute inset-0 flex items-center justify-center"
              >
                {(displayValue || 0).toString().padStart(2, '0')}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Label - complet et adaptatif */}
          <div className="flex items-center justify-center gap-1 md:gap-2">
            <div className="h-px w-2 sm:w-3 md:w-4 lg:w-6 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
            <span className="text-gray-300 uppercase text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-semibold tracking-tight sm:tracking-wide md:tracking-wider lg:tracking-widest leading-tight">
              {label}
            </span>
            <div className="h-px w-2 sm:w-3 md:w-4 lg:w-6 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          </div>
        </div>
        
        {/* Points décoratifs aux coins */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400/40 rounded-full blur-sm" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400/40 rounded-full blur-sm" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-yellow-400/40 rounded-full blur-sm" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-amber-400/40 rounded-full blur-sm" />
      </div>
      
      {/* Lueur au hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10" />
    </div>
  );
};

const CountdownSection = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [settings, setSettings] = useState(null);
  const [isCountdownActive, setIsCountdownActive] = useState(true);

  // Charger les paramètres
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await settingsService.getPublicSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Chronomètre dynamique basé sur les paramètres
  useEffect(() => {
    if (!settings || !settings.countdown_enabled || !settings.countdown_target_date) {
      setIsCountdownActive(false);
      return;
    }

    const targetDate = new Date(settings.countdown_target_date).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance <= 0) {
        setIsCountdownActive(false);
        clearInterval(interval);
        return;
      }
      
      setIsCountdownActive(true);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [settings]);

  // Afficher la section uniquement si le chronomètre est activé
  if (!settings?.countdown_enabled || !isCountdownActive) {
    return null;
  }

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days, shortLabel: 'J' },
    { label: 'Heures', value: timeLeft.hours, shortLabel: 'H' },
    { label: 'Minutes', value: timeLeft.minutes, shortLabel: 'M' },
    { label: 'Secondes', value: timeLeft.seconds, shortLabel: 'S' }
  ];

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background sans parallaxe */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/80" />
      
      {/* Orbes animés sans parallaxe */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl"
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
        className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-500/12 rounded-full blur-3xl"
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
        className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
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
      
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Overlay avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Header avec icônes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              <Clock className="w-5 h-5 md:w-7 md:h-7 text-amber-400" />
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          </motion.div>

          {/* Titre */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-center"
          >
            <span className="text-white">Temps restant</span>
            <br />
            <span className="text-gradient-gold">Makona Awards 2025</span>
          </motion.h2>

          {/* Chronomètre avec effet de chute des chiffres - toujours sur une ligne */}
          <div className="w-full max-w-6xl px-2 md:px-4 mb-8 md:mb-10">
            <div className="grid grid-cols-4 gap-2 md:gap-3 lg:gap-4 xl:gap-6">
              {timeUnits.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <FlipDigit 
                    value={item.value} 
                    label={item.label}
                    shortLabel={item.shortLabel}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bouton Participer avec style moderne */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button 
              onClick={() => onNavigate('/candidature')} 
              className="group relative bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-400 text-slate-900 font-bold px-8 md:px-12 py-4 md:py-5 text-base md:text-lg rounded-full shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Participer maintenant
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;
