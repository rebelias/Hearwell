/**
 * Shared noise generation utilities
 * Extracted from useNoiseGenerator.ts and useNotchedNoise.ts to eliminate duplication
 */

export type NoiseColor =
  | 'white'
  | 'pink'
  | 'brown'
  | 'violet'
  | 'blue'
  | 'grey'
  | 'purple'; // purple is alias for violet

/**
 * Creates an AudioBuffer filled with colored noise
 * @param ctx - AudioContext or OfflineAudioContext to create buffer with
 * @param type - Type of colored noise to generate
 * @param durationSeconds - Duration of the buffer in seconds (default: 2)
 * @returns AudioBuffer filled with the specified noise type
 */
export function createNoiseBuffer(
  ctx: AudioContext | OfflineAudioContext,
  type: NoiseColor = 'white',
  durationSeconds: number = 2
): AudioBuffer {
  const bufferSize = ctx.sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  // Normalize purple to violet (same algorithm)
  const normalizedType = type === 'purple' ? 'violet' : type;

  switch (normalizedType) {
    case 'white':
      fillWhiteNoise(output, bufferSize);
      break;
    case 'pink':
      fillPinkNoise(output, bufferSize);
      break;
    case 'brown':
      fillBrownNoise(output, bufferSize);
      break;
    case 'violet':
      fillVioletNoise(output, bufferSize);
      break;
    case 'blue':
      fillBlueNoise(output, bufferSize);
      break;
    case 'grey':
      fillGreyNoise(output, bufferSize);
      break;
    default:
      fillWhiteNoise(output, bufferSize);
  }

  return buffer;
}

function fillWhiteNoise(output: Float32Array, bufferSize: number): void {
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
}

function fillPinkNoise(output: Float32Array, bufferSize: number): void {
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11;
    b6 = white * 0.115926;
  }
}

function fillBrownNoise(output: Float32Array, bufferSize: number): void {
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }
}

function fillVioletNoise(output: Float32Array, bufferSize: number): void {
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    const current = white - lastOut;
    output[i] = current;
    lastOut = white;
    output[i] *= 0.3;
  }
}

function fillBlueNoise(output: Float32Array, bufferSize: number): void {
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    const current = (white + lastOut) / 2;
    output[i] = current - lastOut;
    lastOut = current;
    output[i] *= 0.5;
  }
}

function fillGreyNoise(output: Float32Array, bufferSize: number): void {
  // Grey noise is white noise with equal loudness curve applied
  // Simplified version - same as white noise
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
}
