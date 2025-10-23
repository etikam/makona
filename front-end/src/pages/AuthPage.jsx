
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import authService from '@/services/authService';

const AuthPage = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "Mot de passe requis",
        description: "Veuillez entrer votre mot de passe.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        // Stocker l'utilisateur
        authService.setStoredUser(result.user);
        
        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${result.user.first_name || result.user.email}`,
        });
        
        onLogin(result.user);
      } else {
        toast({
          title: "Erreur de connexion",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion - Makona Awards 2025</title>
        <meta name="description" content="Connectez-vous pour voter et participer à Makona Awards 2025" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass p-8"
          >
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Connexion
              </h1>
              <p className="text-gray-400">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Votre mot de passe"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? 'Connexion...' : 'Se Connecter'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p>
                  Connectez-vous avec les identifiants fournis par l'administration. 
                  Les candidats accèdent à leur profil, les administrateurs au dashboard.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
  