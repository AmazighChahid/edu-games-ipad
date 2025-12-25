/**
 * Digit Recognition using TensorFlow.js
 * Works on iOS, Android, and Web with Expo
 */

import * as tf from '@tensorflow/tfjs';
import type { DrawingPath, RecognitionResult } from '../types';

// Model URL - Using a pre-trained MNIST model
const MODEL_URL = 'https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json';

let model: tf.LayersModel | null = null;
let isLoading = false;

/**
 * Initialize TensorFlow.js and load the model
 */
export async function initializeRecognition(): Promise<boolean> {
  if (model) return true;
  if (isLoading) return false;

  isLoading = true;

  try {
    // Initialize TensorFlow.js backend
    await tf.ready();
    console.log('TensorFlow.js backend:', tf.getBackend());

    // Try to load the pre-trained model
    try {
      model = await tf.loadLayersModel(MODEL_URL);
      console.log('MNIST model loaded successfully');
    } catch (err) {
      // If model loading fails, we'll use heuristic approach
      console.log('Model loading failed, using fallback recognition:', err);
      model = null;
    }

    isLoading = false;
    return true;
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    isLoading = false;
    return false;
  }
}

/**
 * Convert drawing paths to a centered, normalized 28x28 grayscale image tensor
 * MNIST expects white digits on black background
 */
function pathsToImageTensor(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): tf.Tensor4D {
  const imageSize = 28;
  const pixels = new Float32Array(imageSize * imageSize);

  // Get all points to find bounding box
  const allPoints = paths.flatMap(p => p.points);
  if (allPoints.length === 0) {
    return tf.tensor4d(pixels, [1, imageSize, imageSize, 1]);
  }

  // Find bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const p of allPoints) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const drawWidth = maxX - minX;
  const drawHeight = maxY - minY;

  // Add padding and calculate scale to fit in 20x20 area (centered in 28x28)
  const padding = 4;
  const targetSize = imageSize - 2 * padding; // 20x20
  const scale = Math.min(targetSize / (drawWidth || 1), targetSize / (drawHeight || 1));

  // Center offset
  const scaledWidth = drawWidth * scale;
  const scaledHeight = drawHeight * scale;
  const offsetX = (imageSize - scaledWidth) / 2;
  const offsetY = (imageSize - scaledHeight) / 2;

  // Draw paths onto the pixel array (white on black for MNIST)
  for (const path of paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const p1 = path.points[i];
      const p2 = path.points[i + 1];

      // Transform to centered 28x28 space
      const x1 = Math.floor((p1.x - minX) * scale + offsetX);
      const y1 = Math.floor((p1.y - minY) * scale + offsetY);
      const x2 = Math.floor((p2.x - minX) * scale + offsetX);
      const y2 = Math.floor((p2.y - minY) * scale + offsetY);

      drawLine(pixels, imageSize, x1, y1, x2, y2, 2.0);
    }
  }

  // Normalize to 0-1 range
  return tf.tensor4d(pixels, [1, imageSize, imageSize, 1]);
}

/**
 * Draw a line on the pixel array using Bresenham's algorithm
 */
function drawLine(
  pixels: Float32Array,
  size: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness: number
): void {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let x = x1;
  let y = y1;

  while (true) {
    setPixelWithRadius(pixels, size, x, y, thickness);

    if (x === x2 && y === y2) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

/**
 * Set a pixel with some radius for thicker lines
 */
function setPixelWithRadius(
  pixels: Float32Array,
  size: number,
  x: number,
  y: number,
  radius: number
): void {
  const r = Math.ceil(radius);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const px = x + dx;
      const py = y + dy;
      if (px >= 0 && px < size && py >= 0 && py < size) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          const idx = py * size + px;
          // White on black (1.0 = white)
          pixels[idx] = Math.min(1, pixels[idx] + (1 - dist / (radius + 0.5)));
        }
      }
    }
  }
}

/**
 * Recognize digit from drawing paths using TensorFlow model
 */
async function recognizeWithModel(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): Promise<RecognitionResult> {
  if (!model) {
    return { digit: -1, confidence: 0 };
  }

  const imageTensor = pathsToImageTensor(paths, canvasWidth, canvasHeight);

  try {
    const prediction = model.predict(imageTensor) as tf.Tensor;
    const probabilities = await prediction.data();

    // Find the digit with highest probability
    let maxProb = 0;
    let maxDigit = 0;
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i];
        maxDigit = i;
      }
    }

    // Log for debugging
    console.log('Model prediction:', maxDigit, 'confidence:', maxProb.toFixed(3));

    // Cleanup tensors
    imageTensor.dispose();
    prediction.dispose();

    return { digit: maxDigit, confidence: maxProb };
  } catch (err) {
    console.error('Model prediction error:', err);
    imageTensor.dispose();
    return { digit: -1, confidence: 0 };
  }
}

/**
 * Improved heuristic-based digit recognition
 * Analyzes stroke patterns to guess the digit
 */
function recognizeWithHeuristics(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): RecognitionResult {
  if (paths.length === 0) {
    return { digit: -1, confidence: 0 };
  }

  const allPoints = paths.flatMap(p => p.points);
  if (allPoints.length < 5) {
    return { digit: -1, confidence: 0 };
  }

  // Calculate bounding box
  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));
  const minY = Math.min(...allPoints.map(p => p.y));
  const maxY = Math.max(...allPoints.map(p => p.y));

  const width = maxX - minX;
  const height = maxY - minY;
  const aspectRatio = width / (height || 1);

  // Normalize points to 0-1 range
  const normalizedPoints = allPoints.map(p => ({
    x: (p.x - minX) / (width || 1),
    y: (p.y - minY) / (height || 1),
  }));

  // Calculate center of mass
  const centerX = normalizedPoints.reduce((sum, p) => sum + p.x, 0) / normalizedPoints.length;
  const centerY = normalizedPoints.reduce((sum, p) => sum + p.y, 0) / normalizedPoints.length;

  const strokeCount = paths.length;

  // Analyze path characteristics
  const firstPoint = paths[0].points[0];
  const lastPoint = paths[0].points[paths[0].points.length - 1];

  // Check if the path is closed (start and end points are close)
  const closureDistance = Math.sqrt(
    Math.pow((lastPoint.x - firstPoint.x) / (width || 1), 2) +
    Math.pow((lastPoint.y - firstPoint.y) / (height || 1), 2)
  );
  const isClosed = closureDistance < 0.25;

  // Check where the stroke ends relative to the bounding box
  const endPointRelY = (lastPoint.y - minY) / (height || 1);
  const startPointRelY = (firstPoint.y - minY) / (height || 1);

  // Count direction changes and analyze stroke patterns
  let directionChangesX = 0;
  let directionChangesY = 0;
  let totalLength = 0;
  let topHalfLength = 0;
  let bottomHalfLength = 0;

  for (const path of paths) {
    let lastDx = 0;
    let lastDy = 0;
    for (let i = 0; i < path.points.length - 1; i++) {
      const dx = path.points[i + 1].x - path.points[i].x;
      const dy = path.points[i + 1].y - path.points[i].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      totalLength += segmentLength;

      const midY = (path.points[i].y + path.points[i + 1].y) / 2;
      const relMidY = (midY - minY) / (height || 1);
      if (relMidY < 0.5) {
        topHalfLength += segmentLength;
      } else {
        bottomHalfLength += segmentLength;
      }

      if (i > 0) {
        if (Math.sign(dx) !== Math.sign(lastDx) && Math.abs(dx) > 2 && Math.abs(lastDx) > 2) {
          directionChangesX++;
        }
        if (Math.sign(dy) !== Math.sign(lastDy) && Math.abs(dy) > 2 && Math.abs(lastDy) > 2) {
          directionChangesY++;
        }
      }
      lastDx = dx;
      lastDy = dy;
    }
  }

  const topBottomRatio = topHalfLength / (bottomHalfLength || 1);

  // Analyze horizontal segments in different regions
  let horizontalTop = 0;
  let horizontalBottom = 0;
  let verticalSegments = 0;

  for (const path of paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const dx = Math.abs(path.points[i + 1].x - path.points[i].x);
      const dy = Math.abs(path.points[i + 1].y - path.points[i].y);
      const midY = (path.points[i].y + path.points[i + 1].y) / 2;
      const relMidY = (midY - minY) / (height || 1);

      if (dx > dy * 2) {
        // Horizontal segment
        if (relMidY < 0.3) horizontalTop++;
        else if (relMidY > 0.7) horizontalBottom++;
      } else if (dy > dx * 2) {
        verticalSegments++;
      }
    }
  }

  // Decision tree for digit recognition
  let digit = 0;
  let confidence = 0.5;

  // 1: Very narrow, mostly vertical
  if (strokeCount === 1 && aspectRatio < 0.35 && directionChangesX < 3) {
    digit = 1;
    confidence = 0.8;
  }
  // 7: Horizontal at top, then diagonal/vertical down
  else if (strokeCount <= 2 && horizontalTop > 3 && aspectRatio > 0.4 && centerY > 0.4) {
    digit = 7;
    confidence = 0.7;
  }
  // 4: Usually 2-3 strokes, or one stroke with angles
  else if ((strokeCount >= 2 || directionChangesX >= 2) && aspectRatio > 0.5 && aspectRatio < 1.0) {
    digit = 4;
    confidence = 0.55;
  }
  // 0 vs 9: Both can be closed loops
  else if (strokeCount === 1 && isClosed && aspectRatio > 0.5) {
    // 0 is more oval, center of mass is middle
    // 9 would have center of mass higher (loop at top)
    if (centerY > 0.4 && centerY < 0.6 && topBottomRatio > 0.7 && topBottomRatio < 1.4) {
      digit = 0;
      confidence = 0.7;
    } else if (centerY < 0.45 || topBottomRatio > 1.3) {
      digit = 9;
      confidence = 0.6;
    } else {
      digit = 0;
      confidence = 0.5;
    }
  }
  // 9: Loop at top with tail going down (not closed)
  else if (strokeCount === 1 && !isClosed && endPointRelY > 0.7 && topBottomRatio > 1.2) {
    digit = 9;
    confidence = 0.75;
  }
  // 6: Loop at bottom with stem going up
  else if (strokeCount === 1 && !isClosed && startPointRelY < 0.3 && topBottomRatio < 0.8) {
    digit = 6;
    confidence = 0.7;
  }
  // 8: Two loops stacked, center of mass in middle
  else if (strokeCount === 1 && centerY > 0.4 && centerY < 0.6 && directionChangesY >= 3) {
    digit = 8;
    confidence = 0.6;
  }
  // 2: Curved at top, horizontal at bottom
  else if (strokeCount === 1 && horizontalBottom > 2 && directionChangesY >= 2) {
    digit = 2;
    confidence = 0.6;
  }
  // 3: Two curves on right side
  else if (strokeCount === 1 && directionChangesY >= 2 && centerX > 0.5) {
    digit = 3;
    confidence = 0.55;
  }
  // 5: Horizontal at top, curved at bottom
  else if (strokeCount <= 2 && horizontalTop > 2 && centerY > 0.45) {
    digit = 5;
    confidence = 0.55;
  }
  // Default: analyze more carefully
  else {
    // Use aspect ratio and center of mass as final heuristics
    if (aspectRatio < 0.5) {
      digit = 1;
      confidence = 0.4;
    } else if (centerY < 0.45) {
      digit = 9;
      confidence = 0.4;
    } else if (centerY > 0.55) {
      digit = 6;
      confidence = 0.4;
    } else {
      digit = 0;
      confidence = 0.3;
    }
  }

  console.log('Heuristic:', {
    digit,
    confidence,
    aspectRatio: aspectRatio.toFixed(2),
    centerY: centerY.toFixed(2),
    isClosed,
    topBottomRatio: topBottomRatio.toFixed(2),
    endPointRelY: endPointRelY.toFixed(2),
  });

  return { digit, confidence };
}

/**
 * Main recognition function
 * Uses TensorFlow model if available, falls back to heuristics
 */
export async function recognizeDigit(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): Promise<RecognitionResult> {
  if (paths.length === 0) {
    return { digit: -1, confidence: 0 };
  }

  // Try model first
  if (model) {
    const result = await recognizeWithModel(paths, canvasWidth, canvasHeight);
    if (result.confidence > 0.6) {
      return result;
    }
    // If model is not confident, try heuristics
    const heuristicResult = recognizeWithHeuristics(paths, canvasWidth, canvasHeight);
    // Return the one with higher confidence
    return heuristicResult.confidence > result.confidence ? heuristicResult : result;
  }

  // Fallback to heuristics only
  return recognizeWithHeuristics(paths, canvasWidth, canvasHeight);
}

/**
 * Check if recognition is ready
 */
export function isRecognitionReady(): boolean {
  return model !== null || !isLoading;
}
