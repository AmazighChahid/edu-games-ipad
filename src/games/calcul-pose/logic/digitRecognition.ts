/**
 * Digit Recognition - Simplified approach
 * Primary input: digit buttons (always reliable)
 * Drawing: educational/fun, recognition is best-effort
 */

import type { DrawingPath, RecognitionResult } from '../types';

/**
 * Initialize recognition (no-op, always ready)
 */
export async function initializeRecognition(): Promise<boolean> {
  console.log('Digit recognition ready (simplified mode)');
  return true;
}

/**
 * Analyze stroke to recognize digit using geometric features
 * This is a simplified approach - digit buttons are the primary input
 */
export async function recognizeDigit(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): Promise<RecognitionResult> {
  if (paths.length === 0 || paths[0].points.length < 5) {
    return { digit: -1, confidence: 0 };
  }

  const allPoints = paths.flatMap(p => p.points);

  // Bounding box
  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));
  const minY = Math.min(...allPoints.map(p => p.y));
  const maxY = Math.max(...allPoints.map(p => p.y));

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const aspectRatio = width / height;

  // Normalize points
  const normalized = allPoints.map(p => ({
    x: (p.x - minX) / width,
    y: (p.y - minY) / height,
  }));

  // Start and end points
  const start = normalized[0];
  const end = normalized[normalized.length - 1];

  // Center of mass
  const centerX = normalized.reduce((s, p) => s + p.x, 0) / normalized.length;
  const centerY = normalized.reduce((s, p) => s + p.y, 0) / normalized.length;

  // Check if closed
  const closeDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  const isClosed = closeDist < 0.25;

  // Density in regions (top/bottom halves)
  let topCount = 0, bottomCount = 0;
  let leftCount = 0, rightCount = 0;
  for (const p of normalized) {
    if (p.y < 0.5) topCount++; else bottomCount++;
    if (p.x < 0.5) leftCount++; else rightCount++;
  }
  const topRatio = topCount / normalized.length;
  const rightRatio = rightCount / normalized.length;

  // Simple decision tree
  let digit = 0;
  let confidence = 0.5;

  // 1: Very narrow
  if (aspectRatio < 0.35) {
    digit = 1;
    confidence = 0.7;
  }
  // 0: Closed oval
  else if (isClosed && aspectRatio > 0.5 && aspectRatio < 1.5 && centerY > 0.4 && centerY < 0.6) {
    digit = 0;
    confidence = 0.6;
  }
  // 8: Closed, center mass in middle
  else if (isClosed && centerY > 0.4 && centerY < 0.6) {
    digit = 8;
    confidence = 0.5;
  }
  // 9: More mass at top, ends at bottom
  else if (topRatio > 0.55 && end.y > 0.7) {
    digit = 9;
    confidence = 0.55;
  }
  // 6: More mass at bottom, starts at top
  else if (topRatio < 0.45 && start.y < 0.3) {
    digit = 6;
    confidence = 0.55;
  }
  // 7: Horizontal at top, ends at bottom
  else if (start.y < 0.2 && end.y > 0.7 && topRatio > 0.4) {
    digit = 7;
    confidence = 0.55;
  }
  // 2: Starts top, ends bottom-right with horizontal
  else if (start.y < 0.3 && end.y > 0.7 && end.x > 0.5) {
    digit = 2;
    confidence = 0.5;
  }
  // 5: Starts top-right, ends bottom-left
  else if (start.x > 0.5 && start.y < 0.3 && end.x < 0.5 && end.y > 0.6) {
    digit = 5;
    confidence = 0.5;
  }
  // 3: Right-heavy
  else if (rightRatio > 0.6) {
    digit = 3;
    confidence = 0.45;
  }
  // 4: Has crossing in middle
  else if (paths.length > 1 || aspectRatio > 0.6) {
    digit = 4;
    confidence = 0.4;
  }

  console.log('Recognition:', { digit, confidence: confidence.toFixed(2), aspectRatio: aspectRatio.toFixed(2) });

  return { digit, confidence };
}

/**
 * Check if recognition is ready
 */
export function isRecognitionReady(): boolean {
  return true;
}

/**
 * Get model status
 */
export function getModelStatus(): string {
  return 'simplified';
}
