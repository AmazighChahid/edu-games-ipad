/**
 * Types for ProgressStatsPanel component
 */

import { ViewStyle } from 'react-native';

/**
 * Configuration for a single stat item
 */
export interface StatConfig {
  /** Unique identifier */
  id: string;
  /** Label displayed above the value (e.g., "COUPS", "OBJECTIF") */
  label: string;
  /** Value to display (string or number) */
  value: string | number;
  /** Color for the value text */
  color?: string;
  /** Icon/emoji displayed before the value */
  icon?: string;
  /** Whether to show this stat (for conditional rendering) */
  visible?: boolean;
}

/**
 * Configuration for the progress bar section
 */
export interface ProgressBarConfig {
  /** Current progress (0-1) */
  progress: number;
  /** Encouragement message (auto-calculated if not provided) */
  message?: string;
  /** Whether to show the progress bar. Default: true */
  visible?: boolean;
  /** Progress bar color. Default: success green */
  color?: string;
  /** Width of the progress bar. Default: 80 */
  width?: number;
}

/**
 * Props for the ProgressStatsPanel component
 */
export interface ProgressStatsPanelProps {
  /** List of stats to display */
  stats: StatConfig[];
  /** Optional progress bar configuration */
  progressBar?: ProgressBarConfig;
  /** Whether the panel is visible. Default: true */
  visible?: boolean;
  /** Use glass effect background. Default: true */
  useGlassEffect?: boolean;
  /** Additional container style */
  style?: ViewStyle;
  /** Animation delay when appearing (ms). Default: 0 */
  enterDelay?: number;
}

/**
 * Helper function return types
 */
export type StatConfigCreator = (value: number | string, options?: Partial<StatConfig>) => StatConfig;
