/**
 * Digit Recognition using TensorFlow.js
 * Works on iOS, Android, and Web with Expo
 */

import * as tf from '@tensorflow/tfjs';
import type { DrawingPath, RecognitionResult } from '../types';

// Model URL - Using a pre-trained MNIST model hosted on TensorFlow Hub
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

    // Try to load the pre-trained model
    try {
      model = await tf.loadLayersModel(MODEL_URL);
      console.log('MNIST model loaded successfully');
    } catch {
      // If model loading fails, we'll use a simple heuristic approach
      console.log('Using fallback recognition');
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
 * Convert drawing paths to a 28x28 grayscale image tensor
 */
function pathsToImageTensor(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): tf.Tensor4D {
  // Create a 28x28 pixel array
  const imageSize = 28;
  const pixels = new Float32Array(imageSize * imageSize);

  // Scale factors
  const scaleX = imageSize / canvasWidth;
  const scaleY = imageSize / canvasHeight;

  // Draw paths onto the pixel array
  for (const path of paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const p1 = path.points[i];
      const p2 = path.points[i + 1];

      // Bresenham's line algorithm to draw line between points
      const x1 = Math.floor(p1.x * scaleX);
      const y1 = Math.floor(p1.y * scaleY);
      const x2 = Math.floor(p2.x * scaleX);
      const y2 = Math.floor(p2.y * scaleY);

      drawLine(pixels, imageSize, x1, y1, x2, y2);
    }
  }

  // Normalize and reshape for the model (batch, height, width, channels)
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
  y2: number
): void {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let x = x1;
  let y = y1;

  while (true) {
    // Set pixel with some thickness
    setPixelWithRadius(pixels, size, x, y, 1.5);

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
          pixels[idx] = Math.min(1, pixels[idx] + (1 - dist / radius));
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

    // Cleanup tensors
    imageTensor.dispose();
    prediction.dispose();

    return { digit: maxDigit, confidence: maxProb };
  } catch {
    imageTensor.dispose();
    return { digit: -1, confidence: 0 };
  }
}

/**
 * Simple heuristic-based digit recognition as fallback
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

  // Get all points from all paths
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

  // Calculate center of mass
  const centerX = allPoints.reduce((sum, p) => sum + p.x, 0) / allPoints.length;
  const centerY = allPoints.reduce((sum, p) => sum + p.y, 0) / allPoints.length;
  const relativeCenterX = (centerX - minX) / (width || 1);
  const relativeCenterY = (centerY - minY) / (height || 1);

  // Count strokes
  const strokeCount = paths.length;

  // Analyze stroke directions
  let horizontalSegments = 0;
  let verticalSegments = 0;
  let diagonalSegments = 0;

  for (const path of paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const dx = path.points[i + 1].x - path.points[i].x;
      const dy = path.points[i + 1].y - path.points[i].y;
      const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);

      if (angle < 30 || angle > 150) horizontalSegments++;
      else if (angle > 60 && angle < 120) verticalSegments++;
      else diagonalSegments++;
    }
  }

  const totalSegments = horizontalSegments + verticalSegments + diagonalSegments || 1;
  const horizontalRatio = horizontalSegments / totalSegments;
  const verticalRatio = verticalSegments / totalSegments;

  // Simple heuristics for digit recognition
  let digit = 0;
  let confidence = 0.5;

  // 1: Single vertical stroke, narrow aspect ratio
  if (strokeCount === 1 && aspectRatio < 0.4 && verticalRatio > 0.6) {
    digit = 1;
    confidence = 0.7;
  }
  // 7: One or two strokes, horizontal on top
  else if (strokeCount <= 2 && horizontalRatio > 0.3 && relativeCenterY < 0.4) {
    digit = 7;
    confidence = 0.6;
  }
  // 4: Multiple strokes, angular
  else if (strokeCount >= 2 && aspectRatio > 0.5 && aspectRatio < 1.2) {
    digit = 4;
    confidence = 0.5;
  }
  // 0: Closed loop, roughly square
  else if (strokeCount === 1 && aspectRatio > 0.6 && aspectRatio < 1.4) {
    const firstPoint = paths[0].points[0];
    const lastPoint = paths[0].points[paths[0].points.length - 1];
    const closedLoop = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) +
      Math.pow(lastPoint.y - firstPoint.y, 2)
    ) < width * 0.3;

    if (closedLoop) {
      digit = 0;
      confidence = 0.7;
    }
  }
  // 8: Two loops
  else if (strokeCount === 1 && relativeCenterY > 0.4 && relativeCenterY < 0.6) {
    digit = 8;
    confidence = 0.5;
  }
  // 6 or 9: Loop at top or bottom
  else if (strokeCount === 1) {
    if (relativeCenterY > 0.55) {
      digit = 6;
      confidence = 0.5;
    } else if (relativeCenterY < 0.45) {
      digit = 9;
      confidence = 0.5;
    }
  }
  // 2, 3, 5: Default guesses based on stroke patterns
  else if (strokeCount === 1) {
    if (horizontalRatio > 0.4) {
      digit = 2;
      confidence = 0.4;
    } else {
      digit = 3;
      confidence = 0.4;
    }
  }

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
    if (result.confidence > 0.5) {
      return result;
    }
  }

  // Fallback to heuristics
  return recognizeWithHeuristics(paths, canvasWidth, canvasHeight);
}

/**
 * Check if recognition is ready
 */
export function isRecognitionReady(): boolean {
  return model !== null || !isLoading;
}
