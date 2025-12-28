/**
 * Background components exports
 *
 * NOTE: Ces composants sont une version legacy utilisée par le jeu Hanoi.
 * La version moderne est dans home-v10/layers/ et home-v10/ForestBackgroundV10.
 *
 * Les animaux sont réexportés depuis home-v10/animals pour éviter la duplication.
 * Seul Dragonfly est unique à ce dossier.
 *
 * TODO: Migrer GameBackground de Hanoi vers ForestBackgroundV10
 */

export { ForestBackground } from './ForestBackground';
export { Mountains } from './Mountains';
export { Hills } from './Hills';
export { Trees } from './Trees';
export { Flowers } from './Flowers';
export { Sun } from './Sun';
export { AnimatedClouds } from './AnimatedCloud';
export * from './animals';
