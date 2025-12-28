/**
 * Home V10 Components - "Forêt Immersive"
 * Export all components for HomeScreen V10
 */

// Main background
export { ForestBackgroundV10 } from './ForestBackgroundV10';

// Floating elements
export { PiouFloating } from './PiouFloating';
export { CollectionFloating } from './CollectionFloating';

// UI Components
export { HomeHeaderV10 } from './HomeHeaderV10';
export { GameCardV10 } from './GameCardV10';
export { CategoryFilterBar } from './CategoryFilterBar';
export type { CategoryFilterId } from './CategoryFilterBar';

// Category Filters (version compacte)
export { CategoryFilters } from './CategoryFilters';
export { CATEGORIES, CATEGORY_MAPPING, getCategoryById } from './categoryFiltersData';
export type { CategoryId, Category } from './categoryFiltersData';

// Layers (for advanced usage)
export * from './layers';

// Animals (for advanced usage)
export * from './animals';
