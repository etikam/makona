
    import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, GalleryHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ isAuthenticated, user, onNavigate, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', page: '/' },
    { label: 'Voter', page: '/vote' },
    { label: 'Galerie', page: '/gallery' },
    { label: 'Résultats', page: '/results' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('/')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="Makona Awards Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient-gold">Makona Awards</span>
              <p className="text-xs text-gray-400">Édition 2025</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (user?.user_type === 'admin') {
                      onNavigate('/admin/dashboard');
                    } else {
                      onNavigate('/candidate/profile');
                    }
                  }}
                  className="text-white hover:text-yellow-400"
                >
                  <User className="w-4 h-4 mr-2" />
                  {user?.first_name || user?.name || 'Mon Profil'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="text-white hover:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onNavigate('/auth')}
                className="btn-primary"
              >
                Se Connecter
              </Button>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
          >
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-gray-300 hover:text-yellow-400 transition-colors"
              >
                {item.label}
              </button>
            ))}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    if (user?.user_type === 'admin') {
                      onNavigate('/admin/dashboard');
                    } else {
                      onNavigate('/candidate/profile');
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Mon Profil
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate('/auth');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-yellow-400 font-semibold"
              >
                Se Connecter
              </button>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
  