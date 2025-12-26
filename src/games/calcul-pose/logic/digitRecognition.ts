/**
 * Digit Recognition using TensorFlow.js
 * Creates and trains a CNN model locally, caches it in IndexedDB
 */

import * as tf from '@tensorflow/tfjs';
import type { DrawingPath, RecognitionResult } from '../types';

const GRID_SIZE = 28;
const MODEL_KEY = 'mnist-digit-model-v1';

// MNIST data from Google Storage
const MNIST_IMAGES_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

let model: tf.LayersModel | null = null;
let isInitializing = false;
let initPromise: Promise<boolean> | null = null;
let trainingProgress = '';

/**
 * Create CNN model architecture
 */
function createModel(): tf.Sequential {
  const m = tf.sequential();

  m.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 3,
    filters: 8,
    activation: 'relu',
  }));
  m.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  m.add(tf.layers.conv2d({
    kernelSize: 3,
    filters: 16,
    activation: 'relu',
  }));
  m.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  m.add(tf.layers.flatten());
  m.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  m.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

  m.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return m;
}

/**
 * Load MNIST images from sprite
 */
async function loadMnistImages(): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const NUM_IMAGES = 65000;
      const data = new Float32Array(NUM_IMAGES * 784);

      for (let i = 0; i < NUM_IMAGES; i++) {
        const row = Math.floor(i / (img.width / 28));
        const col = i % (img.width / 28);
        const imgData = ctx.getImageData(col * 28, row * 28, 28, 28);

        for (let j = 0; j < 784; j++) {
          data[i * 784 + j] = imgData.data[j * 4] / 255;
        }
      }

      resolve(data);
    };

    img.onerror = () => reject(new Error('Failed to load MNIST images'));
    img.src = MNIST_IMAGES_PATH;
  });
}

/**
 * Load MNIST labels
 */
async function loadMnistLabels(): Promise<Uint8Array> {
  const resp = await fetch(MNIST_LABELS_PATH);
  const buffer = await resp.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Train model on MNIST data
 */
async function trainModel(m: tf.Sequential): Promise<void> {
  trainingProgress = 'Loading MNIST data...';
  console.log(trainingProgress);

  const [images, labels] = await Promise.all([
    loadMnistImages(),
    loadMnistLabels(),
  ]);

  trainingProgress = 'Preparing training data...';
  console.log(trainingProgress);

  // Use subset for faster training
  const NUM_TRAIN = 5000;

  const trainX = tf.tensor4d(
    images.slice(0, NUM_TRAIN * 784),
    [NUM_TRAIN, 28, 28, 1]
  );

  const trainY = tf.oneHot(
    tf.tensor1d(Array.from(labels.slice(0, NUM_TRAIN)), 'int32'),
    10
  );

  trainingProgress = 'Training neural network...';
  console.log(trainingProgress);

  await m.fit(trainX, trainY, {
    epochs: 3,
    batchSize: 64,
    validationSplit: 0.1,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        trainingProgress = `Epoch ${epoch + 1}/3 - accuracy: ${(logs?.acc ?? 0 * 100).toFixed(1)}%`;
        console.log(trainingProgress);
      },
    },
  });

  // Cleanup
  trainX.dispose();
  trainY.dispose();

  trainingProgress = 'Training complete!';
  console.log(trainingProgress);
}

/**
 * Initialize TensorFlow and model
 */
export async function initializeRecognition(): Promise<boolean> {
  if (model) return true;
  if (initPromise) return initPromise;

  isInitializing = true;

  initPromise = (async () => {
    try {
      console.log('Initializing TensorFlow.js...');
      await tf.ready();
      console.log('Backend:', tf.getBackend());

      // Try loading cached model
      try {
        trainingProgress = 'Loading cached model...';
        model = await tf.loadLayersModel(`indexeddb://${MODEL_KEY}`);
        console.log('Loaded model from cache');
        trainingProgress = 'Ready!';
        isInitializing = false;
        return true;
      } catch {
        console.log('No cached model, will train new one');
      }

      // Check if in browser
      if (typeof document === 'undefined') {
        console.log('Not in browser, skipping training');
        isInitializing = false;
        return false;
      }

      // Create and train
      const newModel = createModel();

      try {
        await trainModel(newModel);
        model = newModel;

        // Cache model
        await model.save(`indexeddb://${MODEL_KEY}`);
        console.log('Model cached');
      } catch (e) {
        console.error('Training failed:', e);
        model = newModel; // Use untrained as fallback
      }

      isInitializing = false;
      return model !== null;
    } catch (e) {
      console.error('Init failed:', e);
      isInitializing = false;
      return false;
    }
  })();

  return initPromise;
}

/**
 * Rasterize strokes to 28x28 grid
 */
function rasterize(paths: DrawingPath[]): Float32Array {
  const grid = new Float32Array(784);

  const points = paths.flatMap(p => p.points);
  if (points.length === 0) return grid;

  // Bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const pad = 4;
  const size = GRID_SIZE - 2 * pad;
  const scale = size / Math.max(w, h);
  const offX = pad + (size - w * scale) / 2;
  const offY = pad + (size - h * scale) / 2;

  // Draw
  for (const path of paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const p1 = path.points[i];
      const p2 = path.points[i + 1];

      const x1 = (p1.x - minX) * scale + offX;
      const y1 = (p1.y - minY) * scale + offY;
      const x2 = (p2.x - minX) * scale + offX;
      const y2 = (p2.y - minY) * scale + offY;

      const d = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(Math.ceil(d * 2), 1);

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t;

        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const gx = Math.floor(cx + dx);
            const gy = Math.floor(cy + dy);
            if (gx >= 0 && gx < 28 && gy >= 0 && gy < 28) {
              const dist = Math.hypot(dx, dy);
              const intensity = Math.max(0, 1 - dist / 2);
              grid[gy * 28 + gx] = Math.min(1, grid[gy * 28 + gx] + intensity);
            }
          }
        }
      }
    }
  }

  return grid;
}

/**
 * Simple heuristic fallback
 */
function heuristicRecognition(grid: Float32Array): RecognitionResult {
  let mass = 0, cX = 0, cY = 0;
  let top = 0, bot = 0, left = 0, right = 0;

  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const v = grid[y * 28 + x];
      mass += v;
      cX += x * v;
      cY += y * v;
      if (y < 14) top += v; else bot += v;
      if (x < 14) left += v; else right += v;
    }
  }

  if (mass < 5) return { digit: -1, confidence: 0 };

  cY /= mass;
  const topR = top / mass;
  const rightR = right / mass;

  // Aspect ratio
  let mX = 28, MX = 0, mY = 28, MY = 0;
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      if (grid[y * 28 + x] > 0.2) {
        mX = Math.min(mX, x); MX = Math.max(MX, x);
        mY = Math.min(mY, y); MY = Math.max(MY, y);
      }
    }
  }
  const ar = (MX - mX + 1) / Math.max(MY - mY + 1, 1);

  // Score
  const s = [0,0,0,0,0,0,0,0,0,0];
  if (ar < 0.4) s[1] += 5;
  if (topR > 0.55) s[7] += 3;
  if (rightR > 0.55) s[3] += 2;
  if (cY / 28 > 0.55) s[6] += 2;
  if (cY / 28 < 0.45) s[9] += 2;

  let best = 0;
  for (let i = 1; i < 10; i++) if (s[i] > s[best]) best = i;

  return { digit: best, confidence: Math.min(s[best] / 5, 0.6) };
}

/**
 * Recognize digit
 */
export async function recognizeDigit(
  paths: DrawingPath[],
  canvasWidth: number,
  canvasHeight: number
): Promise<RecognitionResult> {
  if (paths.length === 0 || paths[0].points.length < 5) {
    return { digit: -1, confidence: 0 };
  }

  const grid = rasterize(paths);

  if (!model) {
    console.log('Model not ready, using heuristics');
    return heuristicRecognition(grid);
  }

  try {
    const input = tf.tensor4d(Array.from(grid), [1, 28, 28, 1]);
    const pred = model.predict(input) as tf.Tensor;
    const probs = await pred.data();

    input.dispose();
    pred.dispose();

    let best = 0;
    for (let i = 1; i < 10; i++) {
      if (probs[i] > probs[best]) best = i;
    }

    console.log('TensorFlow prediction:', {
      digit: best,
      confidence: (probs[best] * 100).toFixed(1) + '%',
      probs: Array.from(probs).map(p => (p * 100).toFixed(0) + '%'),
    });

    return { digit: best, confidence: probs[best] };
  } catch (e) {
    console.error('Prediction error:', e);
    return heuristicRecognition(grid);
  }
}

/**
 * Check if ready
 */
export function isRecognitionReady(): boolean {
  return model !== null;
}

/**
 * Get status
 */
export function getModelStatus(): string {
  if (model) return 'tensorflow-ready';
  if (isInitializing) return trainingProgress || 'initializing';
  return 'not-initialized';
}
