
import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const pastWinners = [
  {
    name: 'Fanta Kourouma',
    award: 'Prix de la Meilleure Artiste Musicale',
    year: '2024',
    imageAlt: 'Portrait de Fanta Kourouma',
    imageText: 'Fanta Kourouma, lauréate du prix de la meilleure artiste musicale en 2024'
  },
  {
    name: 'Moussa Diabaté',
    award: 'Prix de l\'Innovation Sociale',
    year: '2024',
    imageAlt: 'Portrait de Moussa Diabaté',
    imageText: 'Moussa Diabaté, lauréat du prix de l\'innovation sociale en 2024'
  },
  {
    name: 'Aïssata Camara',
    award: 'Prix de la Meilleure Styliste',
    year: '2023',
    imageAlt: 'Portrait d\'Aïssata Camara',
    imageText: 'Aïssata Camara, lauréate du prix de la meilleure styliste en 2023'
  },
  {
    name: 'Sekouba Kandia',
    award: 'Prix du Journaliste d\'Impact',
    year: '2023',
    imageAlt: 'Portrait de Sekouba Kandia',
    imageText: 'Sekouba Kandia, lauréat du prix du journaliste d\'impact en 2023'
  },
];

const HallOfFameSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Hall of Fame:</span>{' '}
            <span className="text-gradient-gold">Nos Anciens Lauréats</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Un hommage aux talents exceptionnels qui ont marqué les éditions précédentes des Makona Awards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pastWinners.map((winner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="card-glass group"
            >
              <div className="relative overflow-hidden rounded-t-2xl">
                <img 
                  className="w-full h-80 object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                  alt={winner.imageAlt}
                 src="https://images.unsplash.com/photo-1675018875769-87f11eed4790" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">{winner.name}</h3>
                  <p className="text-amber-300 font-semibold">{winner.year}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-yellow-400 mt-1 shrink-0" />
                  <p className="text-gray-300">{winner.award}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfFameSection;
