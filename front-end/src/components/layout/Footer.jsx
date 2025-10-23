
import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-bold text-gradient-gold">Makona Awards</span>
            <p className="text-gray-400 mt-4 text-sm">
              Célébrer l'excellence, inspirer le changement dans la région de la Makona Union.
            </p>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Navigation</span>
            <div className="space-y-2">
              <button onClick={() => onNavigate('home')} className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Accueil
              </button>
              <button onClick={() => onNavigate('vote')} className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Voter
              </button>
              <button onClick={() => onNavigate('results')} className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Résultats
              </button>
            </div>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Contact</span>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                contact@makonaawards.org
              </p>
              <p className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                Guéckédou, Guinée
              </p>
            </div>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Suivez-nous</span>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-yellow-500/20 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-yellow-500/20 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-yellow-500/20 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Makona Awards. Tous droits réservés. | 4ème Édition - 28-30 Décembre 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  