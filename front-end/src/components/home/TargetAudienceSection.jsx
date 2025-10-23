
    import React from 'react';
    import { motion } from 'framer-motion';
    import { UserCheck, Users, Briefcase, HeartHandshake as Handshake } from 'lucide-react';

    const TargetAudienceSection = () => {
        const audiences = [
            {
                icon: UserCheck,
                title: "Talents et Acteurs de Changement",
                description: "Les individus et organisations qui sont les potentiels candidats et futurs lauréats."
            },
            {
                icon: Users,
                title: "Jeunes et Femmes",
                description: "Sources d'innovation, futurs leaders et actrices du changement que nous souhaitons inspirer."
            },
            {
                icon: Briefcase,
                title: "Diaspora et Secteur Privé",
                description: "Des partenaires essentiels pour le soutien financier, l'expertise et la viabilité du projet."
            },
            {
                icon: Handshake,
                title: "Partenaires Institutionnels et Médias",
                description: "Acteurs clés pour la légitimité, la visibilité et l'impact de notre événement."
            }
        ];

      return (
        <section className="py-20 bg-slate-950/50">
          <div className="container mx-auto px-4">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">Nos</span>{' '}
                <span className="text-gradient-gold">Publics Cibles</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Makona Awards s'adresse à une diversité d'acteurs, chacun jouant un rôle clé dans le succès et l'impact de notre initiative.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {audiences.map((audience, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="card-glass p-6 text-center"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                                <audience.icon className="w-7 h-7 text-yellow-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{audience.title}</h3>
                        <p className="text-sm text-gray-400">{audience.description}</p>
                    </motion.div>
                ))}
            </div>
          </div>
        </section>
      );
    };

    export default TargetAudienceSection;
  