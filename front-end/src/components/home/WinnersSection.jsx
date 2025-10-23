
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const winners = [
  {
    name: 'Mariam Sylla',
    category: 'Artiste de l\'Année',
    imageAlt: 'Portrait de Mariam Sylla',
    imageText: 'Mariam Sylla, lauréate du prix de l\'artiste de l\'année 2025',
    isMainWinner: true,
  },
  {
    name: 'Kadiatou Barry',
    category: 'Innovation Technologique',
    imageAlt: 'Portrait de Kadiatou Barry',
    imageText: 'Kadiatou Barry, lauréate du prix de l\'innovation technologique 2025',
  },
  {
    name: 'Ahmed Touré',
    category: 'Entrepreneuriat Social',
    imageAlt: 'Portrait de Ahmed Touré',
    imageText: 'Ahmed Touré, lauréat du prix de l\'entrepreneuriat social 2025',
  },
  {
    name: 'Fatoumata Condé',
    category: 'Meilleur Espoir Féminin',
    imageAlt: 'Portrait de Fatoumata Condé',
    imageText: 'Fatoumata Condé, lauréate du prix du meilleur espoir féminin 2025',
  },
];

const mainWinner = winners.find(w => w.isMainWinner);
const otherWinners = winners.filter(w => !w.isMainWinner);

const WinnersSection = () => {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fonctionnalité à venir !",
      description: "Cette fonctionnalité n'est pas encore implémentée, mais vous pouvez la demander dans votre prochain message ! 🚀",
    });
  };

  return (
    <section className="py-20 bg-slate-900/70 relative overflow-hidden">
      <div className="absolute inset-0 bg-makona-pattern opacity-30"></div>
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Les Lauréats</span>{' '}
            <span className="text-gradient-gold">de l'Édition 2025</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Félicitations aux étoiles de cette année qui inspirent le changement et l'excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {mainWinner && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="card-glass p-6 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="relative w-48 h-48 md:w-60 md:h-60 shrink-0">
                <img
                  className="w-full h-full object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                  alt={mainWinner.imageAlt}
                 src="https://images.unsplash.com/photo-1698502744215-6cc8dbc2d606" />
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-full shadow-xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-yellow-400 font-semibold">Gagnant de l'année</p>
                <h3 className="text-3xl font-bold text-white mt-1">{mainWinner.name}</h3>
                <p className="text-xl text-gray-300 mt-1">{mainWinner.category}</p>
                <Button onClick={handleNotImplemented} className="btn-primary mt-6">
                  Lire son histoire
                </Button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherWinners.map((winner, index) => (
              <motion.div
                key={winner.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card-glass p-4 flex items-center gap-4"
              >
                <img
                  className="w-20 h-20 object-cover rounded-full border-2 border-white/20"
                  alt={winner.imageAlt}
                 src="https://images.unsplash.com/photo-1675018875769-87f11eed4790" />
                <div>
                  <h4 className="text-lg font-bold text-white">{winner.name}</h4>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    {winner.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WinnersSection;
