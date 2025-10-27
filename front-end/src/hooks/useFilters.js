import { useState, useCallback, useMemo } from 'react';

export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm('');
  }, [initialFilters]);

  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => 
      value !== '' && value !== null && value !== undefined && value !== 'all'
    ) || searchTerm !== '';
  }, [filters, searchTerm]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (value !== '' && value !== null && value !== undefined && value !== 'all') {
        count++;
      }
    });
    if (searchTerm) count++;
    return count;
  }, [filters, searchTerm]);

  return {
    filters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    activeFiltersCount: getActiveFiltersCount
  };
};
