
    import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, BarChart2, Settings, Users, ThumbsUp, ThumbsDown, Plus, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('validation');
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fonctionnalité à venir !",
      description: "Cette fonctionnalité n'est pas encore implémentée, mais vous pouvez la demander dans votre prochain message ! 🚀",
    });
  };

  const tabs = [
    { id: 'validation', icon: CheckSquare, label: 'Validation Candidatures' },
    { id: 'votes', icon: BarChart2, label: 'Visualisation des Votes' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];
  
  const candidatesToValidate = [
    { id: 1, name: 'Jean Dupont', category: 'Musique', date: '2025-10-15' },
    { id: 2, name: 'Amina Sagna', category: 'Danse', date: '2025-10-14' },
    { id: 3, name: 'Mamadou Keita', category: 'Slam', date: '2025-10-14' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'validation':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-white mb-6">Candidatures en attente</h2>
            <div className="card-glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-4">Nom</th>
                                <th className="p-4">Catégorie</th>
                                <th className="p-4">Date de soumission</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatesToValidate.map((candidate, index) => (
                                <tr key={candidate.id} className={`border-b border-white/10 ${index === candidatesToValidate.length - 1 ? 'border-none' : ''}`}>
                                    <td className="p-4 font-semibold">{candidate.name}</td>
                                    <td className="p-4 text-gray-400">{candidate.category}</td>
                                    <td className="p-4 text-gray-400">{candidate.date}</td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <Button onClick={handleNotImplemented} size="icon" variant="ghost" className="text-green-400 hover:bg-green-500/10 hover:text-green-300"><ThumbsUp className="w-5 h-5"/></Button>
                                        <Button onClick={handleNotImplemented} size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-300"><ThumbsDown className="w-5 h-5"/></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </motion.div>
        );
      case 'votes':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-white mb-6">Visualisation des Votes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-glass p-6">
                <h3 className="text-xl font-bold mb-4">Votes par Catégorie</h3>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center text-gray-500">Graphique à barres</div>
              </div>
              <div className="card-glass p-6">
                <h3 className="text-xl font-bold mb-4">Progression des votes en temps réel</h3>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center text-gray-500">Graphique linéaire</div>
              </div>
            </div>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-white mb-6">Paramètres de la Plateforme</h2>
            <div className="space-y-6">
                <div className="card-glass p-6">
                    <h3 className="text-xl font-bold mb-4">Gestion des Catégories</h3>
                    <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                        <p>Musique</p>
                        <div className="flex gap-2">
                           <Button onClick={handleNotImplemented} size="icon" variant="ghost"><Edit className="w-4 h-4"/></Button>
                           <Button onClick={handleNotImplemented} size="icon" variant="ghost" className="text-red-400"><Trash2 className="w-4 h-4"/></Button>
                        </div>
                    </div>
                     <Button onClick={handleNotImplemented} className="btn-secondary mt-4 w-full"><Plus className="w-4 h-4 mr-2"/> Ajouter une catégorie</Button>
                </div>
                <div className="card-glass p-6">
                    <h3 className="text-xl font-bold mb-4">Chronomètre</h3>
                    <p className="text-gray-400 mb-2">Date de fin : 30 Décembre 2025, 23:59</p>
                    <Button onClick={handleNotImplemented} className="btn-secondary w-full">Modifier le chronomètre</Button>
                </div>
                 <div className="card-glass p-6">
                    <h3 className="text-xl font-bold mb-4">Gestion des Résultats</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                       <Button onClick={handleNotImplemented} className="btn-primary flex-1">Annoncer les résultats</Button>
                       <Button onClick={handleNotImplemented} className="btn-secondary flex-1"><Download className="w-4 h-4 mr-2"/> Exporter les résultats (CSV)</Button>
                    </div>
                </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - Makona Awards 2025</title>
        <meta name="description" content="Gestion de la plateforme Makona Awards 2025." />
      </Helmet>
      <div className="min-h-screen flex">
        <aside className="w-16 md:w-64 bg-slate-900/80 backdrop-blur-xl p-2 md:p-4 flex flex-col">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 p-3 rounded-lg w-full text-left transition-colors ${
                activeTab === tab.id ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-6 h-6 shrink-0" />
              <span className="hidden md:block font-semibold">{tab.label}</span>
            </button>
          ))}
        </aside>
        <main className="flex-1 p-6 md:p-10 bg-makona-pattern">
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
  