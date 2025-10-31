
import React from 'react';
    import { Helmet } from 'react-helmet';
import CountdownSection from '@/components/home/CountdownSection';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
    import StatsSection from '@/components/home/StatsSection';
    import CTASection from '@/components/home/CTASection';
    import ObjectivesSection from '@/components/home/ObjectivesSection';
    import TargetAudienceSection from '@/components/home/TargetAudienceSection';
    import HallOfFameSection from '@/components/home/HallOfFameSection';
    import WinnersSection from '@/components/home/WinnersSection';

    const HomePage = ({ onNavigate }) => {
      return (
        <>
          <Helmet>
            <title>Accueil - Makona Awards 2025</title>
            <meta name="description" content="Bienvenue à Makona Awards 2025 - Célébrez l'excellence dans la région de la Makona Union. Votez maintenant pour vos candidats préférés !" />
          </Helmet>
          
          <div>
            <HeroSection onNavigate={onNavigate} />
            <CountdownSection onNavigate={onNavigate} />
            <CategoriesSection onNavigateToCategory={(category) => onNavigate(`/vote/${category.id}`)} />
            <WinnersSection />
            <HallOfFameSection />
            <StatsSection />
            <TargetAudienceSection />
            <CTASection onNavigate={() => onNavigate('/auth')} />
          </div>
        </>
      );
    };

    export default HomePage;
