import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const ResponsiveFilters = ({
  searchTerm,
  onSearchChange,
  filters = {},
  onFilterChange,
  viewMode,
  onViewModeChange,
  onCreateClick,
  createButtonText = "Nouveau",
  showViewToggle = true,
  showCreateButton = true,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche et contrôles - Design responsive amélioré */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Recherche - Prend toute la largeur sur mobile */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300 h-12 w-full"
          />
        </div>
        
        {/* Filtres et vues - Responsive */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtres dynamiques */}
          {Object.entries(filters).map(([key, filter]) => (
            <Select 
              key={key}
              value={filter.value || 'all'} 
              onValueChange={(value) => onFilterChange(key, value)}
            >
              <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={filter.placeholder || "Filtrer"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-800">Tous</SelectItem>
                {filter.options?.map(option => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value} 
                    className="text-white hover:bg-gray-800"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          
          {/* Boutons de vue */}
          {showViewToggle && (
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                onClick={() => onViewModeChange('grid')}
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                onClick={() => onViewModeChange('list')}
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de création - Responsive */}
      {showCreateButton && (
        <div className="flex justify-end">
          <Button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2"
          >
            {createButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveFilters;
