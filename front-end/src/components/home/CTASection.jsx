
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = ({ onNavigate }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-glass p-12 md:p-16 text-center max-w-4xl mx-auto"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Vote className="w-10 h-10 text-slate-900" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Participez à</span>{' '}
            <span className="text-gradient-gold">l'Histoire</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Votre voix compte ! Soutenez les talents exceptionnels de notre région 
            et contribuez à célébrer l'excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('vote')}
              className="btn-primary group"
            >
              Commencer à Voter
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => onNavigate('auth')}
              className="btn-secondary"
            >
              Créer un Compte
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
  