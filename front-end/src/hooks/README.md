# Hooks Personnalisés

Collection de hooks React personnalisés pour simplifier la gestion d'état et les interactions dans le dashboard admin.

## 📦 Hooks Disponibles

### useLoading
Gestion des états de chargement et d'erreur.

```javascript
import { useLoading } from '@/hooks';

const MyComponent = () => {
  const { loading, error, startLoading, stopLoading, setLoadingError } = useLoading();

  const fetchData = async () => {
    try {
      startLoading();
      const data = await api.getData();
      stopLoading();
      return data;
    } catch (err) {
      setLoadingError(err);
    }
  };

  return (
    <div>
      {loading && <div>Chargement...</div>}
      {error && <div>Erreur: {error.message}</div>}
    </div>
  );
};
```

### useAsyncOperation
Hook pour exécuter des opérations asynchrones avec gestion automatique du loading.

```javascript
import { useAsyncOperation } from '@/hooks';

const MyComponent = () => {
  const { loading, error, execute } = useAsyncOperation();

  const handleSubmit = async () => {
    try {
      const result = await execute(() => api.submitData(data));
      console.log('Succès:', result);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Envoi...' : 'Envoyer'}
    </button>
  );
};
```

### useFilters
Gestion des filtres et de la recherche avec état persistant.

```javascript
import { useFilters } from '@/hooks';

const MyComponent = () => {
  const { 
    filters, 
    searchTerm, 
    updateFilter, 
    resetFilters, 
    hasActiveFilters,
    activeFiltersCount 
  } = useFilters({
    status: 'all',
    category: 'all',
    dateRange: null
  });

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher..."
      />
      
      <select 
        value={filters.status}
        onChange={(e) => updateFilter('status', e.target.value)}
      >
        <option value="all">Tous</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>

      {hasActiveFilters && (
        <button onClick={resetFilters}>
          Effacer les filtres ({activeFiltersCount})
        </button>
      )}
    </div>
  );
};
```

### usePagination
Gestion complète de la pagination.

```javascript
import { usePagination } from '@/hooks';

const MyComponent = () => {
  const { 
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    updateTotalItems
  } = usePagination(1, 20);

  useEffect(() => {
    // Mettre à jour le total d'items
    updateTotalItems(100);
  }, []);

  return (
    <div>
      <div>
        Page {currentPage} sur {totalPages}
        ({totalItems} éléments)
      </div>
      
      <button onClick={previousPage} disabled={!hasPreviousPage}>
        Précédent
      </button>
      
      <button onClick={nextPage} disabled={!hasNextPage}>
        Suivant
      </button>
    </div>
  );
};
```

### useViewMode
Gestion des modes d'affichage avec persistance locale.

```javascript
import { useViewMode } from '@/hooks';

const MyComponent = () => {
  const { 
    viewMode, 
    setViewMode, 
    isGridView, 
    isListView,
    toggleViewMode 
  } = useViewMode('grid', 'myComponent_viewMode');

  return (
    <div>
      <button 
        onClick={() => setViewMode('grid')}
        className={isGridView ? 'active' : ''}
      >
        Grille
      </button>
      
      <button 
        onClick={() => setViewMode('list')}
        className={isListView ? 'active' : ''}
      >
        Liste
      </button>
      
      <button onClick={toggleViewMode}>
        Basculer
      </button>
    </div>
  );
};
```

### useModal
Gestion des modales avec état et données.

```javascript
import { useModal } from '@/hooks';

const MyComponent = () => {
  const { 
    isOpen, 
    data, 
    openModal, 
    closeModal, 
    toggleModal 
  } = useModal();

  const handleEdit = (item) => {
    openModal(item); // Ouvre la modale avec les données de l'item
  };

  return (
    <div>
      <button onClick={() => openModal({ id: 1, name: 'Test' })}>
        Ouvrir Modale
      </button>
      
      <button onClick={toggleModal}>
        Basculer Modale
      </button>

      {isOpen && (
        <div className="modal">
          <h2>Modale ouverte</h2>
          <p>Données: {JSON.stringify(data)}</p>
          <button onClick={closeModal}>Fermer</button>
        </div>
      )}
    </div>
  );
};
```

### useMultipleModals
Gestion de plusieurs modales simultanément.

```javascript
import { useMultipleModals } from '@/hooks';

const MyComponent = () => {
  const { 
    openModal, 
    closeModal, 
    getModalState 
  } = useMultipleModals(['create', 'edit', 'delete']);

  const createState = getModalState('create');
  const editState = getModalState('edit');

  return (
    <div>
      <button onClick={() => openModal('create', { type: 'user' })}>
        Créer
      </button>
      
      <button onClick={() => openModal('edit', { id: 1 })}>
        Modifier
      </button>

      {createState.isOpen && (
        <div className="modal">
          <h2>Créer</h2>
          <p>Type: {createState.data?.type}</p>
          <button onClick={() => closeModal('create')}>Fermer</button>
        </div>
      )}

      {editState.isOpen && (
        <div className="modal">
          <h2>Modifier</h2>
          <p>ID: {editState.data?.id}</p>
          <button onClick={() => closeModal('edit')}>Fermer</button>
        </div>
      )}
    </div>
  );
};
```

### useToast
Gestion des notifications toast.

```javascript
import { useToast } from '@/hooks';

const MyComponent = () => {
  const { 
    success, 
    error, 
    warning, 
    info,
    addToast,
    removeToast 
  } = useToast();

  const handleSuccess = () => {
    success('Succès', 'Opération réussie !');
  };

  const handleError = () => {
    error('Erreur', 'Une erreur est survenue');
  };

  const handleCustom = () => {
    const id = addToast({
      title: 'Notification personnalisée',
      description: 'Ceci est une notification personnalisée',
      type: 'info',
      duration: 10000
    });
    
    // Supprimer après 5 secondes
    setTimeout(() => removeToast(id), 5000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Succès</button>
      <button onClick={handleError}>Erreur</button>
      <button onClick={handleCustom}>Personnalisé</button>
    </div>
  );
};
```

### useDataTable
Hook complet pour les tableaux de données avec pagination, filtres et recherche.

```javascript
import { useDataTable } from '@/hooks';

const MyComponent = () => {
  const fetchUsers = async (params) => {
    const response = await api.getUsers(params);
    return response;
  };

  const tableProps = useDataTable({
    fetchFunction: fetchUsers,
    initialFilters: {
      status: 'all',
      role: 'all'
    },
    initialPageSize: 20,
    initialViewMode: 'grid',
    storageKey: 'usersTable'
  });

  return (
    <DataTable
      title="Utilisateurs"
      data={tableProps.data}
      loading={tableProps.loading}
      pagination={tableProps.pagination}
      filters={[
        {
          key: 'status',
          placeholder: 'Statut',
          options: [
            { value: 'active', label: 'Actifs' },
            { value: 'inactive', label: 'Inactifs' }
          ]
        }
      ]}
      searchTerm={tableProps.filters.searchTerm}
      onSearchChange={tableProps.actions.handleSearchChange}
      onFilterChange={tableProps.actions.handleFilterChange}
      onPageChange={tableProps.actions.handlePageChange}
      onRefresh={tableProps.actions.refresh}
    />
  );
};
```

## 🔧 Fonctionnalités

### Persistance
- `useViewMode` sauvegarde automatiquement le mode d'affichage dans localStorage
- `useFilters` peut être configuré pour persister les filtres

### Performance
- Tous les hooks utilisent `useCallback` pour éviter les re-renders inutiles
- `useDataTable` optimise les appels API avec debouncing

### TypeScript
- Tous les hooks sont TypeScript-ready
- Types d'inférence automatique
- Support des génériques

## 🚀 Utilisation

### Import simple
```javascript
import { useLoading, useToast } from '@/hooks';
```

### Import avec alias
```javascript
import { useLoading as useLoadingState } from '@/hooks';
```

### Import spécifique
```javascript
import { useLoading } from '@/hooks/useLoading';
```

## 📝 Notes

- Tous les hooks sont compatibles avec React 16.8+
- Utilisez `useCallback` et `useMemo` dans vos composants pour optimiser les performances
- Les hooks peuvent être combinés pour créer des fonctionnalités complexes
- Testez toujours vos hooks avec des cas d'usage réels
