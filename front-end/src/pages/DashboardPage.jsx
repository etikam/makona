
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Vote, Trophy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = ({ user, onNavigate }) => {
  const userVotes = JSON.parse(localStorage.getItem('makonaVotes') || '[]');

  const stats = [
    { icon: Vote, label: 'Votes effectués', value: userVotes.length, color: 'from-blue-500 to-cyan-500' },
    { icon: Trophy, label: 'Catégories votées', value: `${userVotes.length}/6`, color: 'from-yellow-500 to-amber-500' },
    { icon: Calendar, label: 'Membre depuis', value: 'Déc 2024', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <>
      <Helmet>
        <title>Mon Profil - Makona Awards 2025</title>
        <meta name="description" content="Gérez votre profil et suivez vos votes pour Makona Awards 2025" />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card-glass p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/20">
                  {user?.profile_picture_url || user?.profile_picture ? (
                    <img 
                      src={user.profile_picture_url || `http://localhost:8000/media/${user.profile_picture}`} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-900" />
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user?.name || 'Utilisateur'
                    }
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onNavigate('vote')}
                  className="btn-primary"
                >
                  Continuer à Voter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-glass p-6"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gradient-gold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="card-glass p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Historique des Votes</h2>
              
              {userVotes.length > 0 ? (
                <div className="space-y-4">
                  {userVotes.map((vote, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-white font-semibold">{vote.category}</div>
                          <div className="text-sm text-gray-400">{vote.candidate}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(vote.timestamp).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Vote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Vous n'avez pas encore voté</p>
                  <Button
                    onClick={() => onNavigate('vote')}
                    className="btn-primary"
                  >
                    Commencer à Voter
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
  