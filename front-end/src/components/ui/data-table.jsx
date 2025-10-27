import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import ResponsiveTable from './responsive-table';
import ResponsivePagination from './responsive-pagination';
import { LoadingTable } from './loading-states';

const DataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  pagination = {},
  filters = [],
  searchTerm = '',
  onSearchChange,
  onFilterChange,
  onPageChange,
  onRefresh,
  onExport,
  emptyMessage = "Aucune donnée disponible",
  emptyIcon,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          )}
          
          {onExport && (
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter, index) => (
              <Select
                key={filter.key || index}
                value={filter.value || 'all'}
                onValueChange={(value) => onFilterChange?.(filter.key, value)}
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
          </div>
        </div>
      </div>

      {/* Tableau */}
      {loading ? (
        <LoadingTable rows={5} columns={columns.length} />
      ) : (
        <ResponsiveTable
          columns={columns}
          data={data}
          emptyMessage={emptyMessage}
          emptyIcon={emptyIcon}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <ResponsivePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
