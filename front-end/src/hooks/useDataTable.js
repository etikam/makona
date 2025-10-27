import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePagination } from './usePagination';
import { useFilters } from './useFilters';
import { useViewMode } from './useViewMode';
import { useLoading } from './useLoading';

export const useDataTable = ({
  fetchFunction,
  initialFilters = {},
  initialPageSize = 20,
  initialViewMode = 'grid',
  storageKey = 'dataTable'
}) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const { loading, error, startLoading, stopLoading, setLoadingError } = useLoading();
  const pagination = usePagination(1, initialPageSize);
  const filters = useFilters(initialFilters);
  const viewMode = useViewMode(initialViewMode, `${storageKey}_viewMode`);

  const fetchData = useCallback(async () => {
    try {
      startLoading();
      
      const params = {
        page: pagination.currentPage,
        page_size: pagination.pageSize,
        search: filters.searchTerm,
        ...filters.filters
      };

      const response = await fetchFunction(params);
      
      if (response.results) {
        setData(response.results);
        setTotalCount(response.count || 0);
        pagination.updateTotalItems(response.count || 0);
      } else if (Array.isArray(response)) {
        setData(response);
        setTotalCount(response.length);
        pagination.updateTotalItems(response.length);
      } else {
        setData([]);
        setTotalCount(0);
        pagination.updateTotalItems(0);
      }
      
      stopLoading();
    } catch (err) {
      setLoadingError(err);
      console.error('Error fetching data:', err);
    }
  }, [
    fetchFunction,
    pagination.currentPage,
    pagination.pageSize,
    filters.searchTerm,
    filters.filters,
    startLoading,
    stopLoading,
    setLoadingError,
    pagination
  ]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((page) => {
    pagination.goToPage(page);
  }, [pagination]);

  const handleFilterChange = useCallback((key, value) => {
    filters.updateFilter(key, value);
    pagination.goToPage(1); // Reset to first page when filtering
  }, [filters, pagination]);

  const handleSearchChange = useCallback((searchTerm) => {
    filters.setSearchTerm(searchTerm);
    pagination.goToPage(1); // Reset to first page when searching
  }, [filters, pagination]);

  const handleViewModeChange = useCallback((mode) => {
    viewMode.setViewMode(mode);
  }, [viewMode]);

  const handlePageSizeChange = useCallback((pageSize) => {
    pagination.changePageSize(pageSize);
  }, [pagination]);

  const resetFilters = useCallback(() => {
    filters.resetFilters();
    pagination.goToPage(1);
  }, [filters, pagination]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tableProps = useMemo(() => ({
    data,
    loading,
    error,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.pageSize,
      hasNextPage: pagination.hasNextPage,
      hasPreviousPage: pagination.hasPreviousPage,
      startItem: pagination.startItem,
      endItem: pagination.endItem
    },
    filters: {
      searchTerm: filters.searchTerm,
      filters: filters.filters,
      hasActiveFilters: filters.hasActiveFilters,
      activeFiltersCount: filters.activeFiltersCount
    },
    viewMode: {
      current: viewMode.viewMode,
      isGridView: viewMode.isGridView,
      isListView: viewMode.isListView
    },
    actions: {
      refresh,
      handlePageChange,
      handleFilterChange,
      handleSearchChange,
      handleViewModeChange,
      handlePageSizeChange,
      resetFilters
    }
  }), [
    data,
    loading,
    error,
    pagination,
    filters,
    viewMode,
    refresh,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    handleViewModeChange,
    handlePageSizeChange,
    resetFilters
  ]);

  return tableProps;
};
