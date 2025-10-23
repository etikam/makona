
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Award, Users, Globe, HeartHandshake } from 'lucide-react';

    const ObjectivesSection = () => {
      const objectives = [
        {
          icon: Award,
          title: "Identifier les Talents",
          description: "Repérer et primer les acteurs d'excellence dans nos 6 domaines clés."
        },
        {
          icon: Users,
          title: "Créer une Plateforme",
          description: "Offrir un espace de visibilité et de reconnaissance de haut niveau pour les lauréats."
        },
        {
          icon: HeartHandshake,
          title: "Promouvoir l'Inclusion",
          description: "Stimuler l'engagement équitable des jeunes, des femmes et des différentes communautés."
        },
        {
          icon: Globe,
          title: "Renforcer la Coopération",
          description: "Resserrer les liens entre la Guinée, le Liberia et la Sierra Leone au sein de la Makona Union."
        }
      ];

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
                <span className="text-white">Notre</span>{' '}
                <span className="text-gradient-gold">Mission</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                identifier, célébrer et récompenser les talents, les parcours inspirants, et les initiatives de développement durables 
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {objectives.map((objective, index) => (
                <motion.div
                  key={objective.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="card-glass p-8 text-center hover:border-yellow-500/50 transition-colors"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <objective.icon className="w-8 h-8 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{objective.title}</h3>
                  <p className="text-gray-400">{objective.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default ObjectivesSection;
  