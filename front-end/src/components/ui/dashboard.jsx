import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from './dashboard-layout';
import ResponsiveHeader from './responsive-header';
import { StatsDashboard } from './stats-dashboard';
import DataTable from './data-table';
import Chart from './chart';
import { LoadingGrid } from './loading-states';

const Dashboard = ({
  title,
  subtitle,
  navigationItems = [],
  navigationGroups = [],
  actions = [],
  stats = [],
  charts = [],
  tables = [],
  loading = false,
  className = ""
}) => {
  return (
    <DashboardLayout
      title={title}
      subtitle={subtitle}
      navigationItems={navigationItems}
      navigationGroups={navigationGroups}
      actions={actions}
      className={className}
    >
      {/* Stats Section */}
      {stats.length > 0 && (
        <StatsDashboard
          stats={stats}
          className="mb-8"
        />
      )}

      {/* Charts Section */}
      {charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {charts.map((chart, index) => (
            <Chart
              key={chart.key || index}
              {...chart}
            />
          ))}
        </div>
      )}

      {/* Tables Section */}
      {tables.length > 0 && (
        <div className="space-y-8">
          {tables.map((table, index) => (
            <DataTable
              key={table.key || index}
              {...table}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <LoadingGrid count={6} />
      )}
    </DashboardLayout>
  );
};

const DashboardSection = ({ 
  title, 
  subtitle, 
  children, 
  className = "" 
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      {(title || subtitle) && (
        <div>
          {title && <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.section>
  );
};

const DashboardCard = ({ 
  title, 
  subtitle, 
  children, 
  actions = [],
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 ${className}`}
    >
      {(title || subtitle || actions.length > 0) && (
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            {title && <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
          {actions.length > 0 && (
            <div className="flex items-center gap-2 ml-4">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    action.variant === 'primary' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : action.variant === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export { 
  Dashboard, 
  DashboardSection, 
  DashboardCard 
};
