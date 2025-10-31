import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import settingsService from '@/services/settingsService';

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

  return (
    <section className="relative py-8 md:py-12 lg:py-16 bg-gradient-to-b from-slate-900 via-blue-950/50 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-900/70 to-slate-900"></div>
      <div className="pointer-events-none absolute -left-32 top-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-yellow-500/10 via-amber-400/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-400/5 to-transparent blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Titre */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center drop-shadow-lg"
          >
            Participer aux Makona Awards 2025
          </motion.p>

          {/* Chronomètre */}
          <div className="grid grid-cols-4 gap-3 md:gap-4 lg:gap-6 w-full max-w-4xl xl:max-w-5xl px-4 mb-6 md:mb-8">
            {[{ label: 'Jours', value: timeLeft.days }, { label: 'Heures', value: timeLeft.hours }, { label: 'Minutes', value: timeLeft.minutes }, { label: 'Secondes', value: timeLeft.seconds }].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                className="card-glass p-4 md:p-6 lg:p-8 text-center backdrop-blur-xl bg-slate-900/70 border-2 border-yellow-500/30 shadow-2xl hover:shadow-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300"
              >
                <div className="font-bold text-gradient-gold text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 drop-shadow-lg">
                  {(item.value || 0).toString().padStart(2, '0')}
                </div>
                <div className="text-white uppercase text-xs md:text-sm lg:text-base font-semibold tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton Participer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button 
              onClick={() => onNavigate('results')} 
              className="btn-secondary w-fit px-6 md:px-8 py-3 md:py-4 rounded-full sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-base md:text-lg font-semibold">Participer</span>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;

