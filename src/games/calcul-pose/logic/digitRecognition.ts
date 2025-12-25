/**
 * Digit Recognition - Improved heuristics-based approach
 * Analyzes stroke patterns for reliable digit recognition
 */

import * as tf from '@tensorflow/tfjs';
import type { DrawingPath, RecognitionResult } from '../types';

let model: tf.LayersModel | null = null;
let isLoading = false;
let modelLoadAttempted = false;

/**
 * Initialize TensorFlow.js (optional - heuristics work without it)
 */
export async function initializeRecognition(): Promise<boolean> {
  if (modelLoadAttempted) return true;
  modelLoadAttempted = true;

  try {
    await tf.ready();
    console.log('TensorFlow.js ready, backend:', tf.getBackend());
  } catch (err) {
    console.log('TensorFlow.js init failed, using heuristics only');
  }

  return true;
}

interface StrokeAnalysis {
  // Bounding box
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  aspectRatio: number;

  // Points analysis
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  startRelX: number;
  startRelY: number;
  endRelX: number;
  endRelY: number;

  // Center of mass
  centerX: number;
  centerY: number;

  // Stroke characteristics
  isClosed: boolean;
  strokeCount: number;

  // Region analysis (divide into 3x3 grid)
  topLeftDensity: number;
  topCenterDensity: number;
  topRightDensity: number;
  midLeftDensity: number;
  midCenterDensity: number;
  midRightDensity: number;
  botLeftDensity: number;
  botCenterDensity: number;
  botRightDensity: number;

  // Direction analysis
  hasHorizontalTop: boolean;
  hasHorizontalMiddle: boolean;
  hasHorizontalBottom: boolean;
  hasVerticalLeft: boolean;
  hasVerticalCenter: boolean;
  hasVerticalRight: boolean;

  // Curve detection
  topLoopDetected: boolean;
  bottomLoopDetected: boolean;
  middleWaistDetected: boolean;

  // Total points
  totalPoints: number;
}

/**
 * Analyze stroke patterns
 */
function analyzeStrokes(paths: DrawingPath[]): StrokeAnalysis | null {
  const allPoints = paths.flatMap(p => p.points);
  if (allPoints.length < 5) return null;

  // Bounding box
  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));
  const minY = Math.min(...allPoints.map(p => p.y));
  const maxY = Math.max(...allPoints.map(p => p.y));

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  // Start and end points
  const startPoint = paths[0].points[0];
  const lastPath = paths[paths.length - 1];
  const endPoint = lastPath.points[lastPath.points.length - 1];

  // Relative positions (0-1)
  const startRelX = (startPoint.x - minX) / width;
  const startRelY = (startPoint.y - minY) / height;
  const endRelX = (endPoint.x - minX) / width;
  const endRelY = (endPoint.y - minY) / height;

  // Center of mass
  const centerX = allPoints.reduce((s, p) => s + (p.x - minX) / width, 0) / allPoints.length;
  const centerY = allPoints.reduce((s, p) => s + (p.y - minY) / height, 0) / allPoints.length;

  // Closure check
  const closureDist = Math.sqrt(
    Math.pow((endPoint.x - startPoint.x) / width, 2) +
    Math.pow((endPoint.y - startPoint.y) / height, 2)
  );
  const isClosed = closureDist < 0.2;

  // 3x3 grid density analysis
  const gridCounts = Array(9).fill(0);
  for (const p of allPoints) {
    const gx = Math.min(2, Math.floor(((p.x - minX) / width) * 3));
    const gy = Math.min(2, Math.floor(((p.y - minY) / height) * 3));
    gridCounts[gy * 3 + gx]++;
  }
  const totalPoints = allPoints.length;
  const densities = gridCounts.map(c => c / totalPoints);

  // Direction analysis - check for horizontal/vertical segments
  let hTop = 0, hMid = 0, hBot = 0;
  let vLeft = 0, vCenter = 0, vRight = 0;

  for (const path of paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const p1 = path.points[i];
      const p2 = path.points[i + 1];
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const midY = ((p1.y + p2.y) / 2 - minY) / height;
      const midX = ((p1.x + p2.x) / 2 - minX) / width;

      // Horizontal segments (dx > 2*dy)
      if (dx > dy * 2 && dx > 5) {
        if (midY < 0.33) hTop++;
        else if (midY < 0.67) hMid++;
        else hBot++;
      }
      // Vertical segments (dy > 2*dx)
      if (dy > dx * 2 && dy > 5) {
        if (midX < 0.33) vLeft++;
        else if (midX < 0.67) vCenter++;
        else vRight++;
      }
    }
  }

  // Loop detection - look for circular patterns in regions
  const topLoopDetected = detectLoop(paths, minX, minY, width, height, 0, 0.4);
  const bottomLoopDetected = detectLoop(paths, minX, minY, width, height, 0.6, 1.0);

  // Middle waist detection (for 8) - check if middle is narrower
  const middleWaistDetected = detectMiddleWaist(allPoints, minX, minY, width, height);

  return {
    minX, maxX, minY, maxY, width, height,
    aspectRatio: width / height,
    startPoint, endPoint,
    startRelX, startRelY, endRelX, endRelY,
    centerX, centerY,
    isClosed,
    strokeCount: paths.length,
    topLeftDensity: densities[0],
    topCenterDensity: densities[1],
    topRightDensity: densities[2],
    midLeftDensity: densities[3],
    midCenterDensity: densities[4],
    midRightDensity: densities[5],
    botLeftDensity: densities[6],
    botCenterDensity: densities[7],
    botRightDensity: densities[8],
    hasHorizontalTop: hTop > 3,
    hasHorizontalMiddle: hMid > 3,
    hasHorizontalBottom: hBot > 3,
    hasVerticalLeft: vLeft > 3,
    hasVerticalCenter: vCenter > 3,
    hasVerticalRight: vRight > 3,
    topLoopDetected,
    bottomLoopDetected,
    middleWaistDetected,
    totalPoints,
  };
}

/**
 * Detect a loop in a specific vertical region
 */
function detectLoop(
  paths: DrawingPath[],
  minX: number, minY: number,
  width: number, height: number,
  yStart: number, yEnd: number
): boolean {
  // Get points in the region
  const regionPoints: Array<{x: number, y: number}> = [];
  for (const path of paths) {
    for (const p of path.points) {
      const relY = (p.y - minY) / height;
      if (relY >= yStart && relY <= yEnd) {
        regionPoints.push({ x: (p.x - minX) / width, y: relY });
      }
    }
  }

  if (regionPoints.length < 10) return false;

  // Check if points form a rough circle by analyzing variance in angles from center
  const cx = regionPoints.reduce((s, p) => s + p.x, 0) / regionPoints.length;
  const cy = regionPoints.reduce((s, p) => s + p.y, 0) / regionPoints.length;

  // Check if points are distributed around the center
  let leftCount = 0, rightCount = 0, topCount = 0, bottomCount = 0;
  for (const p of regionPoints) {
    if (p.x < cx) leftCount++;
    else rightCount++;
    if (p.y < cy) topCount++;
    else bottomCount++;
  }

  const minRatio = 0.2;
  const total = regionPoints.length;
  return (
    leftCount / total > minRatio &&
    rightCount / total > minRatio &&
    topCount / total > minRatio &&
    bottomCount / total > minRatio
  );
}

/**
 * Detect if there's a waist (narrowing) in the middle (characteristic of 8)
 */
function detectMiddleWaist(
  points: Array<{x: number, y: number}>,
  minX: number, minY: number,
  width: number, height: number
): boolean {
  // Divide into 5 horizontal bands and measure width of each
  const bands = [0, 0, 0, 0, 0];
  const bandMinX = [Infinity, Infinity, Infinity, Infinity, Infinity];
  const bandMaxX = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity];

  for (const p of points) {
    const relY = (p.y - minY) / height;
    const band = Math.min(4, Math.floor(relY * 5));
    const relX = (p.x - minX) / width;
    bandMinX[band] = Math.min(bandMinX[band], relX);
    bandMaxX[band] = Math.max(bandMaxX[band], relX);
    bands[band]++;
  }

  const bandWidths = bands.map((_, i) =>
    bands[i] > 3 ? bandMaxX[i] - bandMinX[i] : 1
  );

  // Check if middle band (index 2) is narrower than top and bottom
  const topWidth = Math.max(bandWidths[0], bandWidths[1]);
  const midWidth = bandWidths[2];
  const botWidth = Math.max(bandWidths[3], bandWidths[4]);

  return midWidth < topWidth * 0.8 && midWidth < botWidth * 0.8;
}

/**
 * Main heuristic-based digit recognition
 */
function recognizeWithHeuristics(paths: DrawingPath[]): RecognitionResult {
  const analysis = analyzeStrokes(paths);
  if (!analysis) return { digit: -1, confidence: 0 };

  const {
    aspectRatio, centerX, centerY, isClosed, strokeCount,
    startRelX, startRelY, endRelX, endRelY,
    hasHorizontalTop, hasHorizontalMiddle, hasHorizontalBottom,
    hasVerticalLeft, hasVerticalCenter, hasVerticalRight,
    topLoopDetected, bottomLoopDetected, middleWaistDetected,
    topLeftDensity, topCenterDensity, topRightDensity,
    midLeftDensity, midRightDensity,
    botLeftDensity, botCenterDensity, botRightDensity,
  } = analysis;

  // Scores for each digit
  const scores: number[] = Array(10).fill(0);

  // === 0: Closed oval, balanced density ===
  if (isClosed && aspectRatio > 0.5 && aspectRatio < 1.5) {
    scores[0] += 3;
    if (!middleWaistDetected) scores[0] += 2;
    if (centerY > 0.4 && centerY < 0.6) scores[0] += 1;
  }

  // === 1: Very narrow, vertical ===
  if (aspectRatio < 0.4) {
    scores[1] += 4;
    if (hasVerticalCenter) scores[1] += 2;
  }

  // === 2: Starts top-right, curves, ends bottom with horizontal ===
  if (strokeCount === 1 && !isClosed) {
    if (startRelY < 0.4 && startRelX > 0.5) scores[2] += 2; // Starts top-right
    if (endRelY > 0.8 && hasHorizontalBottom) scores[2] += 2; // Ends bottom with horizontal
    if (topRightDensity > 0.1 && botLeftDensity > 0.1) scores[2] += 1;
  }

  // === 3: Two bumps on the right side ===
  if (strokeCount === 1 && !isClosed) {
    if (midRightDensity > midLeftDensity * 1.5) scores[3] += 2;
    if (startRelX > 0.3 && endRelX > 0.3) scores[3] += 1;
    if (topRightDensity > 0.1 && botRightDensity > 0.1) scores[3] += 1;
  }

  // === 4: Has vertical on right + horizontal crossing ===
  if (hasVerticalRight && hasHorizontalMiddle) {
    scores[4] += 3;
    if (strokeCount >= 2) scores[4] += 1;
  }
  if (strokeCount === 1 && aspectRatio > 0.5) {
    if (midLeftDensity > 0.05 && midRightDensity > 0.05) scores[4] += 1;
  }

  // === 5: Horizontal at top, vertical drop, curve at bottom ===
  if (!isClosed && hasHorizontalTop) {
    scores[5] += 2;
    if (startRelX > 0.5 && startRelY < 0.3) scores[5] += 1; // Starts top-right
    if (bottomLoopDetected || botRightDensity > 0.1) scores[5] += 1;
    if (endRelY > 0.6 && endRelX < 0.5) scores[5] += 1; // Ends bottom-left
  }

  // === 6: Starts top, loop at bottom ===
  if (strokeCount === 1 && bottomLoopDetected && !topLoopDetected) {
    scores[6] += 4;
    if (startRelY < 0.3) scores[6] += 2; // Starts at top
  }
  if (!isClosed && startRelY < 0.3 && centerY > 0.5) {
    scores[6] += 1;
  }

  // === 7: Horizontal at top + diagonal/vertical down ===
  if (hasHorizontalTop && !hasHorizontalBottom && !isClosed) {
    scores[7] += 3;
    if (startRelX < 0.5 && startRelY < 0.3) scores[7] += 1; // Starts top-left
    if (endRelY > 0.7) scores[7] += 1; // Ends at bottom
    if (topLeftDensity + topCenterDensity + topRightDensity > 0.3) scores[7] += 1;
  }
  // 7 usually has very little density in bottom-left
  if (botLeftDensity < 0.05 && hasHorizontalTop) {
    scores[7] += 1;
  }

  // === 8: Two stacked loops with waist ===
  if (isClosed && middleWaistDetected) {
    scores[8] += 4;
  }
  if (topLoopDetected && bottomLoopDetected) {
    scores[8] += 3;
  }
  if (isClosed && centerY > 0.4 && centerY < 0.6 && aspectRatio > 0.4) {
    scores[8] += 1;
  }

  // === 9: Loop at top, tail going down ===
  if (topLoopDetected && !bottomLoopDetected) {
    scores[9] += 4;
    if (endRelY > 0.7) scores[9] += 2; // Tail ends at bottom
  }
  if (!isClosed && startRelY > 0.5 && endRelY > 0.7) {
    // Starts mid, ends bottom (tail of 9)
    scores[9] += 2;
  }
  if (centerY < 0.45 && aspectRatio > 0.5) {
    scores[9] += 1;
  }

  // Find best match
  let bestDigit = 0;
  let bestScore = scores[0];
  for (let i = 1; i < 10; i++) {
    if (scores[i] > bestScore) {
      bestScore = scores[i];
      bestDigit = i;
    }
  }

  // Calculate confidence based on score difference
  const sortedScores = [...scores].sort((a, b) => b - a);
  const scoreDiff = sortedScores[0] - sortedScores[1];
  const confidence = Math.min(0.95, 0.4 + scoreDiff * 0.1);

  console.log('Recognition scores:', scores.map((s, i) => `${i}:${s}`).join(' '));
  console.log('Best:', bestDigit, 'conf:', confidence.toFixed(2));
  console.log('Analysis:', {
    aspectRatio: aspectRatio.toFixed(2),
    isClosed,
    hasHTop: hasHorizontalTop,
    hasHBot: hasHorizontalBottom,
    topLoop: topLoopDetected,
    botLoop: bottomLoopDetected,
    waist: middleWaistDetected,
    startY: startRelY.toFixed(2),
    endY: endRelY.toFixed(2),
  });

  return { digit: bestDigit, confidence };
}

/**
 * Main recognition function
 */
export async function recognizeDigit(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): Promise<RecognitionResult> {
  if (paths.length === 0) {
    return { digit: -1, confidence: 0 };
  }

  return recognizeWithHeuristics(paths);
}

/**
 * Check if recognition is ready
 */
export function isRecognitionReady(): boolean {
  return true;
}
