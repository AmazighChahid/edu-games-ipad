#!/usr/bin/env node
/**
 * generate-playground-registry.js
 *
 * Script de génération automatique du registre des composants pour le Playground.
 * Scanne TOUS les dossiers du projet pour trouver les composants React.
 *
 * Usage: node scripts/generate-playground-registry.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'playground', 'registry.generated.ts');

// Dossiers à ignorer
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '__tests__', '__mocks__', 'types'];

// Patterns de fichiers à ignorer
const IGNORE_PATTERNS = ['.types.ts', '.types.tsx', '.test.ts', '.test.tsx', '.spec.ts', '.spec.tsx', 'index.ts', 'index.tsx'];

/**
 * Convertit un chemin en nom de catégorie lisible
 */
function pathToCategory(relativePath) {
  // Exemples:
  // src/components/background -> Background
  // src/components/home-v10 -> Home V10
  // src/components/home-v10/layers -> Home V10 Layers
  // src/games/01-hanoi/components -> Hanoi
  // src/games/07-memory/components -> Memory

  const parts = relativePath.split(path.sep);

  // Cas spécial pour les jeux
  if (parts.includes('games')) {
    const gameIndex = parts.indexOf('games');
    if (gameIndex + 1 < parts.length) {
      const gameName = parts[gameIndex + 1];
      // Enlever le préfixe numérique (01-, 02-, etc.)
      const cleanName = gameName.replace(/^\d+-/, '');
      // Convertir en titre
      const title = cleanName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Ajouter le sous-dossier s'il y en a un après "components"
      const compIndex = parts.indexOf('components');
      if (compIndex > 0 && compIndex + 1 < parts.length) {
        const subFolder = parts.slice(compIndex + 1).join(' ');
        if (subFolder) {
          return `${title} - ${subFolder.charAt(0).toUpperCase() + subFolder.slice(1)}`;
        }
      }
      return title;
    }
  }

  // Cas pour les composants généraux
  if (parts.includes('components')) {
    const compIndex = parts.indexOf('components');
    const subParts = parts.slice(compIndex + 1);

    if (subParts.length === 0) {
      return 'Components';
    }

    return subParts
      .map(part => {
        // Convertir home-v10 en Home V10
        return part
          .split('-')
          .map(word => {
            // Garder les versions comme v10, v2, etc.
            if (/^v\d+$/.test(word)) return word.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
      })
      .join(' ');
  }

  // Cas pour les activités
  if (parts.includes('activities')) {
    const actIndex = parts.indexOf('activities');
    const subParts = parts.slice(actIndex + 1);
    if (subParts.length > 0) {
      return subParts[0].charAt(0).toUpperCase() + subParts[0].slice(1);
    }
  }

  return 'Other';
}

/**
 * Extrait les noms des composants exportés depuis un fichier TSX
 */
function extractComponentNames(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const componentNames = new Set();

    // Patterns pour trouver les exports de composants
    const patterns = [
      // export const ComponentName = ...
      /export\s+const\s+([A-Z][a-zA-Z0-9]+)\s*[=:]/g,
      // export function ComponentName
      /export\s+function\s+([A-Z][a-zA-Z0-9]+)\s*[\(<]/g,
      // export { ComponentName }
      /export\s+{\s*([A-Z][a-zA-Z0-9]+)(?:\s+as\s+\w+)?\s*}/g,
      // export default function ComponentName
      /export\s+default\s+function\s+([A-Z][a-zA-Z0-9]+)/g,
      // const ComponentName = memo(... puis export
      /const\s+([A-Z][a-zA-Z0-9]+)\s*=\s*(?:memo|forwardRef|React\.memo)\s*\(/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const name = match[1];
        // Filtrer les noms qui ne sont pas des composants
        if (
          name &&
          /^[A-Z][a-zA-Z0-9]+$/.test(name) &&
          !name.endsWith('Props') &&
          !name.endsWith('Type') &&
          !name.endsWith('Config') &&
          !name.endsWith('Context') &&
          !name.endsWith('Provider') &&
          !name.endsWith('Hook') &&
          !name.startsWith('use') &&
          name !== 'React'
        ) {
          componentNames.add(name);
        }
      }
    }

    // Vérifier que les composants trouvés sont bien exportés
    const exportedNames = [];
    for (const name of componentNames) {
      // Vérifier si le composant est exporté (export const, export { name }, etc.)
      const exportPatterns = [
        new RegExp(`export\\s+const\\s+${name}\\s*[=:]`),
        new RegExp(`export\\s+function\\s+${name}\\s*[\\(<]`),
        new RegExp(`export\\s+{[^}]*\\b${name}\\b[^}]*}`),
        new RegExp(`export\\s+default\\s+${name}\\b`),
        new RegExp(`export\\s+default\\s+function\\s+${name}\\b`),
      ];

      const isExported = exportPatterns.some(p => p.test(content));
      if (isExported) {
        exportedNames.push(name);
      }
    }

    return exportedNames;
  } catch (error) {
    console.warn(`  ⚠️  Could not read file ${filePath}: ${error.message}`);
    return [];
  }
}

/**
 * Parcourt récursivement un dossier pour trouver tous les fichiers TSX
 */
function findTsxFiles(dir, relativeTo = SRC_DIR) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Ignorer certains dossiers
      if (IGNORE_DIRS.includes(item)) continue;

      // Parcourir récursivement
      results.push(...findTsxFiles(fullPath, relativeTo));
    } else if (item.endsWith('.tsx')) {
      // Ignorer certains patterns
      if (IGNORE_PATTERNS.some(pattern => item.includes(pattern))) continue;

      const relativePath = path.relative(relativeTo, fullPath);
      const relativeDir = path.relative(relativeTo, dir);

      results.push({
        fullPath,
        relativePath,
        relativeDir,
        fileName: item,
      });
    }
  }

  return results;
}

/**
 * Génère un ID unique pour un composant
 */
function generateComponentId(name, category) {
  const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const kebabCategory = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${kebabCategory}-${kebabName}`;
}

/**
 * Génère le contenu du fichier TypeScript
 */
function generateRegistryContent(allComponents) {
  const imports = [];
  const registryEntries = [];
  const seenImportNames = new Map();

  // Trier par catégorie puis par nom
  allComponents.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  for (const comp of allComponents) {
    // Gérer les noms en double
    let importName = comp.name;
    if (seenImportNames.has(comp.name)) {
      const count = seenImportNames.get(comp.name) + 1;
      seenImportNames.set(comp.name, count);
      // Créer un alias basé sur la catégorie
      const categoryAlias = comp.category.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      importName = `${comp.name}$${categoryAlias}`;
    } else {
      seenImportNames.set(comp.name, 1);
    }

    comp.importName = importName;

    // Chemin d'import relatif depuis src/playground/
    const importPath = '../' + comp.filePath.replace('.tsx', '');

    // Import
    if (importName !== comp.name) {
      imports.push(`import { ${comp.name} as ${importName} } from '${importPath}';`);
    } else {
      imports.push(`import { ${comp.name} } from '${importPath}';`);
    }

    // Entry du registre
    const id = generateComponentId(comp.name, comp.category);

    registryEntries.push(`  {
    id: '${id}',
    name: '${comp.name}',
    category: '${comp.category}',
    filePath: '${comp.filePath}',
    component: ${importName},
    defaultProps: {},
    description: '${comp.name} component',
  }`);
  }

  const content = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated by: scripts/generate-playground-registry.js
 * Generated at: ${new Date().toISOString()}
 *
 * To regenerate, run: npm run generate:playground
 */

import React from 'react';

// ============================================================
// AUTO-GENERATED IMPORTS (${imports.length} components)
// ============================================================
${imports.join('\n')}

// ============================================================
// TYPE DEFINITIONS
// ============================================================
export interface PlaygroundComponent {
  id: string;
  name: string;
  category: string;
  filePath?: string;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
  description?: string;
}

// ============================================================
// AUTO-GENERATED REGISTRY
// ============================================================
export const COMPONENT_REGISTRY: PlaygroundComponent[] = [
${registryEntries.join(',\n')}
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export const getComponentById = (id: string): PlaygroundComponent | undefined => {
  return COMPONENT_REGISTRY.find((c) => c.id === id);
};

export const getComponentsByCategory = (category: string): PlaygroundComponent[] => {
  return COMPONENT_REGISTRY.filter((c) => c.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = new Set(COMPONENT_REGISTRY.map((c) => c.category));
  return Array.from(categories).sort();
};

export const searchComponents = (query: string): PlaygroundComponent[] => {
  const q = query.toLowerCase();
  return COMPONENT_REGISTRY.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
  );
};
`;

  return content;
}

/**
 * Point d'entrée principal
 */
function main() {
  console.log('🔍 Scanning for React components in src/...\n');

  // Trouver tous les fichiers TSX
  const tsxFiles = findTsxFiles(SRC_DIR);
  console.log(`📄 Found ${tsxFiles.length} .tsx files\n`);

  const allComponents = [];
  const categoryCounts = {};

  for (const file of tsxFiles) {
    const componentNames = extractComponentNames(file.fullPath);

    if (componentNames.length > 0) {
      const category = pathToCategory(file.relativeDir);

      for (const name of componentNames) {
        allComponents.push({
          name,
          category,
          filePath: file.relativePath,
        });

        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    }
  }

  // Afficher le résumé par catégorie
  console.log('📊 Components by category:');
  const sortedCategories = Object.keys(categoryCounts).sort();
  for (const category of sortedCategories) {
    console.log(`   ${category}: ${categoryCounts[category]}`);
  }

  console.log(`\n✅ Total components found: ${allComponents.length}`);

  // Générer le fichier
  const content = generateRegistryContent(allComponents);

  // Créer le dossier si nécessaire
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Écrire le fichier
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`\n📝 Registry generated: ${OUTPUT_FILE}`);
  console.log('\n🎉 Done! Playground registry has been updated.');
}

main();
