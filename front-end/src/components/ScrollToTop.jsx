import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant qui remonte automatiquement en haut de la page lors des changements de route
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remonter en haut de la page lors du changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Animation fluide
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

