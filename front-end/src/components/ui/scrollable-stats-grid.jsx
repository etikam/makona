import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

const ScrollableStatsGrid = ({ 
  stats = [], 
  className = "",
  showScrollButtons = true 
}) => {
  const scrollContainerRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  React.useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [stats]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Pixels à faire défiler
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!stats.length) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Boutons de défilement */}
      {showScrollButtons && (
        <>
          <Button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700/90 text-white border-gray-600 h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700/90 text-white border-gray-600 h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Container scrollable */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.key || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-48 sm:w-56 lg:w-64"
          >
            <div className={`${stat.className || 'bg-gradient-to-br from-gray-800/60 to-gray-900/60'} backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 h-full`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className={`${stat.labelColor || 'text-gray-400'} text-xs sm:text-sm font-medium truncate`}>
                    {stat.label}
                  </p>
                  <p className={`${stat.valueColor || 'text-white'} text-xl sm:text-2xl lg:text-3xl font-bold mt-1`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className={`${stat.subtitleColor || 'text-gray-500'} text-xs mt-1 truncate`}>
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                {stat.icon && (
                  <div className={`${stat.iconColor || 'text-gray-400'} flex-shrink-0 ml-3`}>
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableStatsGrid;
