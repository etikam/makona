
import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import VotePage from '@/pages/VotePage';
import CategoryCandidatesPage from '@/pages/CategoryCandidatesPage';
import CandidateDetailPage from '@/pages/CandidateDetailPage';
import GalleryPage from '@/pages/GalleryPage';
import CandidateProfile from '@/components/candidate/CandidateProfile';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TestResponsiveAdmin from '@/components/admin/TestResponsiveAdmin';
import authService from '@/services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        // Vérifier si l'utilisateur est toujours connecté via l'API
        try {
          const profileResponse = await authService.getProfile();
          if (profileResponse.success) {
            // Pour les candidats, récupérer les données complètes du dashboard
            if (profileResponse.user.user_type === 'candidate') {
              try {
                const candidateService = (await import('@/services/candidateService')).default;
                const dashboardData = await candidateService.getDashboard();
                setUser(dashboardData.user);
              } catch (error) {
                // Fallback sur les données de base si le dashboard échoue
                setUser(profileResponse.user);
              }
            } else {
              setUser(profileResponse.user);
            }
            setIsAuthenticated(true);
          } else {
            // L'utilisateur n'est plus connecté, nettoyer le localStorage
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Erreur de vérification d\'authentification:', error);
          // En cas d'erreur, nettoyer le localStorage
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (userData) => {
    // Pour les candidats, récupérer les données complètes du dashboard
    if (userData.user_type === 'candidate') {
      try {
        const candidateService = (await import('@/services/candidateService')).default;
        const dashboardData = await candidateService.getDashboard();
        setUser(dashboardData.user);
        setIsAuthenticated(true);
        navigate('/candidate/profile');
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
        // Fallback sur les données de base si le dashboard échoue
        setUser(userData);
        setIsAuthenticated(true);
        navigate('/candidate/profile');
      }
    } else {
      setUser(userData);
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-makona-pattern">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-makona-pattern">
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage onNavigate={handleNavigation} />} />
              <Route path="/auth" element={<AuthPage onLogin={handleLogin} onNavigate={handleNavigation} />} />
              
              {/* Routes publiques */}
              <Route path="/vote" element={<VotePage user={user} onNavigate={handleNavigation} />} />
              <Route path="/vote/:categoryId" element={<CategoryCandidatesPage onNavigate={handleNavigation} />} />
              <Route path="/candidate/:candidateId" element={<CandidateDetailPage onNavigate={handleNavigation} />} />
              <Route path="/gallery" element={<GalleryPage onNavigate={handleNavigation} />} />
              
              {/* Routes authentifiées - Candidat */}
              <Route 
                path="/candidate/profile" 
                element={
                  isAuthenticated && user ? 
                    <CandidateProfile user={user} onLogout={handleLogout} onNavigate={handleNavigation} /> : 
                    <AuthPage onLogin={handleLogin} onNavigate={handleNavigation} />
                } 
              />
              
              {/* Routes authentifiées - Admin */}
              <Route 
                path="/admin" 
                element={
                  isAuthenticated && user?.user_type === 'admin' ? 
                    <AdminDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigation} /> : 
                    <AuthPage onLogin={handleLogin} onNavigate={handleNavigation} />
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  isAuthenticated && user?.user_type === 'admin' ? 
                    <AdminDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigation} /> : 
                    <AuthPage onLogin={handleLogin} onNavigate={handleNavigation} />
                } 
              />
              
              {/* Route de fallback pour l'ancien dashboard */}
              <Route path="/dashboard" element={<DashboardPage user={user} onNavigate={handleNavigation} />} />
              
              {/* Route de test pour le nouveau dashboard responsive */}
              <Route path="/test-admin" element={<TestResponsiveAdmin />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <Footer onNavigate={handleNavigation} />
        <Toaster />
      </div>
    </HelmetProvider>
  );
}

export default App;
