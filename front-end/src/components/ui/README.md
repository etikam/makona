# Composants UI Réutilisables

Cette collection de composants UI offre une interface moderne et responsive pour le dashboard admin de Makona Awards.

## 🎨 Design System

### Couleurs
- **Primaire**: Bleu (#3B82F6) avec dégradés vers violet (#8B5CF6)
- **Arrière-plan**: Gris foncé (#1F2937) avec effets de glassmorphism
- **Texte**: Blanc (#FFFFFF) avec nuances de gris pour la hiérarchie
- **États**: Vert (succès), Rouge (erreur), Jaune (avertissement)

### Effets Visuels
- **Glassmorphism**: Arrière-plans semi-transparents avec flou
- **Animations**: Transitions fluides avec Framer Motion
- **Hover**: Effets de survol avec transformation et ombres
- **Responsive**: Adaptation automatique à toutes les tailles d'écran

## 📦 Composants Disponibles

### Base Components
- `Button` - Boutons avec variantes et tailles
- `Input` - Champs de saisie stylisés
- `Label` - Étiquettes de formulaire
- `Textarea` - Zones de texte multi-lignes
- `Badge` - Badges de statut et d'information
- `Card` - Cartes de contenu
- `Switch` - Interrupteurs on/off
- `Select` - Listes déroulantes

### Modal Components
- `Modal` - Modale de base
- `EnhancedModal` - Modale améliorée avec opacité
- `ConfirmationModal` - Modale de confirmation personnalisée

### Toast Components
- `Toast` - Notifications toast individuelles
- `ToastContainer` - Conteneur de notifications

### Responsive Components
- `ResponsiveFilters` - Barre de filtres responsive
- `ResponsiveHeader` - En-tête avec actions
- `ResponsiveSidebar` - Barre latérale responsive
- `ResponsiveLayout` - Layout principal responsive
- `ResponsiveNavigation` - Navigation responsive
- `ResponsiveTable` - Tableau responsive
- `ResponsivePagination` - Pagination responsive
- `ResponsiveCard` - Cartes responsive avec composants

### Form Components
- `ResponsiveForm` - Formulaire responsive
- `FormField` - Champ de formulaire avec label et erreur
- `FormGroup` - Groupe de champs
- `FormRow` - Ligne de champs (2 colonnes)
- `FormActions` - Actions de formulaire
- `FormInput` - Input de formulaire stylisé
- `FormTextarea` - Textarea de formulaire stylisé
- `FormSelect` - Select de formulaire stylisé
- `FormSwitch` - Switch de formulaire stylisé

### Stats Components
- `StatsGrid` - Grille de statistiques
- `StatsDashboard` - Dashboard de statistiques
- `StatCard` - Carte de statistique individuelle
- `QuickStats` - Statistiques rapides
- `MetricCard` - Carte de métrique

### Chart Components
- `Chart` - Graphiques (bar, line, pie, area)

### Data Components
- `DataTable` - Tableau de données complet
- `ResponsiveTable` - Tableau responsive de base

### Dashboard Components
- `Dashboard` - Dashboard principal
- `DashboardSection` - Section de dashboard
- `DashboardCard` - Carte de dashboard
- `DashboardLayout` - Layout de dashboard

### Loading Components
- `LoadingSpinner` - Spinner de chargement
- `LoadingCard` - Carte de chargement
- `LoadingGrid` - Grille de chargement
- `LoadingTable` - Tableau de chargement
- `LoadingStats` - Statistiques de chargement
- `LoadingPage` - Page de chargement
- `Skeleton` - Skeleton de chargement

## 🎯 Hooks Disponibles

### useLoading
Gestion des états de chargement et d'erreur.

```javascript
const { loading, error, startLoading, stopLoading, setLoadingError } = useLoading();
```

### useFilters
Gestion des filtres et de la recherche.

```javascript
const { 
  filters, 
  searchTerm, 
  updateFilter, 
  resetFilters, 
  hasActiveFilters 
} = useFilters();
```

### usePagination
Gestion de la pagination.

```javascript
const { 
  currentPage, 
  totalPages, 
  goToPage, 
  nextPage, 
  previousPage 
} = usePagination();
```

### useViewMode
Gestion des modes d'affichage (grid/list).

```javascript
const { 
  viewMode, 
  setViewMode, 
  isGridView, 
  isListView 
} = useViewMode();
```

### useModal
Gestion des modales.

```javascript
const { 
  isOpen, 
  openModal, 
  closeModal, 
  toggleModal 
} = useModal();
```

### useToast
Gestion des notifications toast.

```javascript
const { 
  success, 
  error, 
  warning, 
  info 
} = useToast();
```

### useDataTable
Hook complet pour les tableaux de données.

```javascript
const tableProps = useDataTable({
  fetchFunction: myFetchFunction,
  initialFilters: {},
  initialPageSize: 20
});
```

## 🚀 Utilisation

### Import des composants
```javascript
import { 
  Button, 
  Input, 
  Modal, 
  StatsDashboard,
  useToast 
} from '@/components/ui';
```

### Exemple d'utilisation
```javascript
const MyComponent = () => {
  const { success, error } = useToast();

  const handleClick = () => {
    success('Succès', 'Opération réussie !');
  };

  return (
    <div>
      <Button onClick={handleClick}>
        Cliquer ici
      </Button>
    </div>
  );
};
```

## 📱 Responsive Design

Tous les composants sont conçus pour être responsive :
- **Mobile**: Layout en colonne unique
- **Tablet**: Layout adaptatif avec grilles
- **Desktop**: Layout complet avec sidebar

## 🎨 Personnalisation

Les composants utilisent Tailwind CSS et peuvent être personnalisés via les props `className` ou en modifiant les styles de base.

## 🔧 Maintenance

- Tous les composants sont TypeScript-ready
- Tests unitaires recommandés
- Documentation à jour
- Versioning sémantique
