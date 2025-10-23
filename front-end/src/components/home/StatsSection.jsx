
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Users, Award, Eye, FileText } from 'lucide-react';

    const StatsSection = () => {
      const stats = [
        { icon: FileText, value: '50+', label: 'Candidatures Attendues' },
        { icon: Award, value: '32', label: 'Lauréats Récompensés' },
        { icon: Users, value: '500+', label: 'Participants à la cérémonie' },
        { icon: Eye, value: '100k+', label: 'Vues sur les réseaux' }
      ];

      return (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">L'Édition 2025</span>{' '}
                <span className="text-gradient-gold">en Chiffres</span>
              </h2>
               <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Nos objectifs quantitatifs pour une édition mémorable et impactante.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="card-glass p-8 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-slate-900" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 uppercase tracking-wider text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default StatsSection;
  