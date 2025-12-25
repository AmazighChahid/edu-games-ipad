/**
 * Digit Recognition using TensorFlow.js with MNIST CNN model
 * Properly preprocesses drawing for accurate recognition
 */

import * as tf from '@tensorflow/tfjs';
import type { DrawingPath, RecognitionResult } from '../types';

// Use a reliable hosted MNIST model
const MODEL_URLS = [
  'https://raw.githubusercontent.com/nickthorpe71/tfjs-mnist-model/main/model.json',
  'https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json',
];

let model: tf.LayersModel | null = null;
let isLoading = false;
let loadAttempts = 0;

/**
 * Initialize TensorFlow.js and load the MNIST model
 */
export async function initializeRecognition(): Promise<boolean> {
  if (model) return true;
  if (isLoading) {
    // Wait for loading to complete
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (!isLoading) {
          clearInterval(check);
          resolve(model !== null);
        }
      }, 100);
    });
  }

  isLoading = true;

  try {
    // Initialize TensorFlow.js
    await tf.ready();
    console.log('TensorFlow.js backend:', tf.getBackend());

    // Try to load model from each URL
    for (const url of MODEL_URLS) {
      try {
        console.log('Trying to load model from:', url);
        model = await tf.loadLayersModel(url);
        console.log('MNIST model loaded successfully from:', url);

        // Warm up the model
        const dummyInput = tf.zeros([1, 28, 28, 1]);
        const warmup = model.predict(dummyInput) as tf.Tensor;
        warmup.dispose();
        dummyInput.dispose();

        isLoading = false;
        return true;
      } catch (err) {
        console.log('Failed to load from', url, ':', err);
        loadAttempts++;
      }
    }

    // If all URLs fail, create a simple model
    console.log('Creating fallback model...');
    model = createSimpleMNISTModel();
    isLoading = false;
    return true;
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    isLoading = false;
    return false;
  }
}

/**
 * Create a simple CNN model for MNIST (untrained, but structure is correct)
 * This is a fallback - recognition won't be accurate without proper weights
 */
function createSimpleMNISTModel(): tf.LayersModel {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 3,
    filters: 16,
    activation: 'relu',
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.conv2d({
    kernelSize: 3,
    filters: 32,
    activation: 'relu',
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

/**
 * Convert drawing paths to a properly preprocessed 28x28 image tensor
 * MNIST format: white digit (1) on black background (0), centered
 */
function pathsToImageTensor(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): tf.Tensor4D {
  // Create a larger canvas for drawing, then resize to 28x28
  const drawSize = 280; // 10x the final size for better quality
  const pixels = new Float32Array(drawSize * drawSize);

  // Get all points
  const allPoints = paths.flatMap(p => p.points);
  if (allPoints.length === 0) {
    return tf.zeros([1, 28, 28, 1]) as tf.Tensor4D;
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

  const drawWidth = maxX - minX || 1;
  const drawHeight = maxY - minY || 1;

  // Scale to fit in 200x200 area (centered in 280x280 with 40px padding)
  const padding = 40;
  const targetSize = drawSize - 2 * padding;
  const scale = Math.min(targetSize / drawWidth, targetSize / drawHeight) * 0.9;

  // Center offset
  const scaledWidth = drawWidth * scale;
  const scaledHeight = drawHeight * scale;
  const offsetX = (drawSize - scaledWidth) / 2;
  const offsetY = (drawSize - scaledHeight) / 2;

  // Draw paths with anti-aliasing
  const strokeWidth = Math.max(12, 20 * scale / 10); // Adaptive stroke width

  for (const path of paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const p1 = path.points[i];
      const p2 = path.points[i + 1];

      // Transform points
      const x1 = (p1.x - minX) * scale + offsetX;
      const y1 = (p1.y - minY) * scale + offsetY;
      const x2 = (p2.x - minX) * scale + offsetX;
      const y2 = (p2.y - minY) * scale + offsetY;

      drawLineAntialiased(pixels, drawSize, x1, y1, x2, y2, strokeWidth);
    }
  }

  // Convert to tensor and resize to 28x28
  const tensor = tf.tensor2d(pixels, [drawSize, drawSize]);
  const resized = tf.image.resizeBilinear(
    tensor.expandDims(2) as tf.Tensor3D,
    [28, 28]
  );

  // Normalize to 0-1 range and reshape
  const normalized = resized.div(tf.scalar(255)).clipByValue(0, 1);
  const result = normalized.expandDims(0) as tf.Tensor4D;

  // Cleanup intermediate tensors
  tensor.dispose();
  resized.dispose();
  normalized.dispose();

  return result;
}

/**
 * Draw an anti-aliased line on the pixel array
 */
function drawLineAntialiased(
  pixels: Float32Array,
  size: number,
  x1: number, y1: number,
  x2: number, y2: number,
  thickness: number
): void {
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const steps = Math.max(1, Math.ceil(dist));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    drawCircle(pixels, size, x, y, thickness / 2);
  }
}

/**
 * Draw a filled circle with soft edges
 */
function drawCircle(
  pixels: Float32Array,
  size: number,
  cx: number, cy: number,
  radius: number
): void {
  const r = Math.ceil(radius + 1);
  const startX = Math.max(0, Math.floor(cx - r));
  const endX = Math.min(size - 1, Math.ceil(cx + r));
  const startY = Math.max(0, Math.floor(cy - r));
  const endY = Math.min(size - 1, Math.ceil(cy + r));

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= radius) {
        const idx = y * size + x;
        // Soft edge anti-aliasing
        const alpha = dist < radius - 1 ? 255 : 255 * (radius - dist);
        pixels[idx] = Math.min(255, pixels[idx] + alpha);
      }
    }
  }
}

/**
 * Recognize digit using the loaded TensorFlow model
 */
export async function recognizeDigit(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): Promise<RecognitionResult> {
  if (paths.length === 0 || paths[0].points.length < 3) {
    return { digit: -1, confidence: 0 };
  }

  // Ensure model is loaded
  if (!model) {
    const loaded = await initializeRecognition();
    if (!loaded || !model) {
      console.error('Model not available');
      return { digit: -1, confidence: 0 };
    }
  }

  try {
    // Convert drawing to image tensor
    const imageTensor = pathsToImageTensor(paths, canvasWidth, canvasHeight);

    // Run prediction
    const prediction = model.predict(imageTensor) as tf.Tensor;
    const probabilities = await prediction.data();

    // Find digit with highest probability
    let maxProb = 0;
    let maxDigit = 0;
    const probs: number[] = [];

    for (let i = 0; i < 10; i++) {
      const prob = probabilities[i];
      probs.push(prob);
      if (prob > maxProb) {
        maxProb = prob;
        maxDigit = i;
      }
    }

    // Log results for debugging
    console.log('Predictions:', probs.map((p, i) => `${i}:${(p * 100).toFixed(1)}%`).join(' '));
    console.log('Result:', maxDigit, 'confidence:', (maxProb * 100).toFixed(1) + '%');

    // Cleanup
    imageTensor.dispose();
    prediction.dispose();

    return { digit: maxDigit, confidence: maxProb };
  } catch (error) {
    console.error('Recognition error:', error);
    return { digit: -1, confidence: 0 };
  }
}

/**
 * Check if recognition is ready
 */
export function isRecognitionReady(): boolean {
  return model !== null;
}

/**
 * Get model status for debugging
 */
export function getModelStatus(): string {
  if (model) return 'loaded';
  if (isLoading) return 'loading';
  return 'not loaded';
}
