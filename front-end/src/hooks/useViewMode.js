import { useState, useCallback, useEffect } from 'react';

const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const useViewMode = (initialMode = VIEW_MODES.GRID, storageKey = 'viewMode') => {
  const [viewMode, setViewMode] = useState(() => {
    // Try to get from localStorage on initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      return stored && Object.values(VIEW_MODES).includes(stored) ? stored : initialMode;
    }
    return initialMode;
  });

  const setViewModeAndPersist = useCallback((mode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, mode);
    }
  }, [storageKey]);

  const toggleViewMode = useCallback(() => {
    setViewModeAndPersist(
      viewMode === VIEW_MODES.GRID ? VIEW_MODES.LIST : VIEW_MODES.GRID
    );
  }, [viewMode, setViewModeAndPersist]);

  const setGridView = useCallback(() => {
    setViewModeAndPersist(VIEW_MODES.GRID);
  }, [setViewModeAndPersist]);

  const setListView = useCallback(() => {
    setViewModeAndPersist(VIEW_MODES.LIST);
  }, [setViewModeAndPersist]);

  const isGridView = viewMode === VIEW_MODES.GRID;
  const isListView = viewMode === VIEW_MODES.LIST;

  return {
    viewMode,
    setViewMode: setViewModeAndPersist,
    toggleViewMode,
    setGridView,
    setListView,
    isGridView,
    isListView,
    VIEW_MODES
  };
};
