
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Zap, Shield, Target } from 'lucide-react';

    const AboutSection = () => {
      return (
        <section className="py-20 relative bg-slate-950/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Contexte et</span>{' '}
                <span className="text-gradient-gold">Justification</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto">
                Les Makona Awards sont nés d'une volonté de transformer les défis historiques de la région — conflits, crises sanitaires et tensions — en une opportunité de renaissance culturelle et sociale.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="card-glass p-8"
              >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Les Défis</h3>
                  <p className="text-gray-400">
                    La région a surmonté des conflits armés, la crise Ébola et des difficultés socio-économiques.
                  </p>
              </motion.div>
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="card-glass p-8"
              >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">La Réponse</h3>
                  <p className="text-gray-400">
                    Une initiative pour restaurer la fierté, stimuler le développement et renforcer la cohésion par la culture.
                  </p>
              </motion.div>
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="card-glass p-8"
              >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">La Vision</h3>
                  <p className="text-gray-400">
                    Pérenniser un événement qui célèbre l'excellence et inspire les générations futures.
                  </p>
              </motion.div>
            </div>
          </div>
        </section>
      );
    };

    export default AboutSection;
  