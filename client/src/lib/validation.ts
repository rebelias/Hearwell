/**
 * Input validation and sanitization utilities
 * Prevents XSS and invalid data injection
 */

import { z } from 'zod';

// URL parameter schemas
export const frequencySchema = z.number().int().min(50).max(20000);
export const volumeSchema = z.number().int().min(0).max(100);
export const volumeDbSchema = z.number().int().min(-10).max(100);
export const waveformSchema = z.enum([
  'sine',
  'square',
  'triangle',
  'sawtooth',
  'filtered',
  'noise',
]);
export const noiseColorSchema = z.enum([
  'white',
  'pink',
  'brown',
  'violet',
  'blue',
  'grey',
]);
export const notchNoiseTypeSchema = z.enum(['white', 'pink', 'purple']);
export const earSelectionSchema = z.enum(['both', 'left', 'right']);

/**
 * Sanitize and validate frequency from URL parameter
 */
export function validateFrequency(value: string | null): number | null {
  if (!value) return null;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return null;

  try {
    return frequencySchema.parse(parsed);
  } catch {
    return null;
  }
}

/**
 * Sanitize and validate volume from URL parameter
 */
export function validateVolume(value: string | null): number | null {
  if (!value) return null;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return null;

  try {
    return volumeSchema.parse(parsed);
  } catch {
    return null;
  }
}

/**
 * Sanitize and validate waveform from URL parameter
 */
export function validateWaveform(
  value: string | null
): 'sine' | 'square' | 'triangle' | 'sawtooth' | 'filtered' | 'noise' | null {
  if (!value) return null;

  try {
    return waveformSchema.parse(value);
  } catch {
    return null;
  }
}

/**
 * Sanitize and validate noise color from URL parameter
 */
export function validateNoiseColor(
  value: string | null
): 'white' | 'pink' | 'brown' | 'violet' | 'blue' | 'grey' | null {
  if (!value) return null;

  try {
    return noiseColorSchema.parse(value);
  } catch {
    return null;
  }
}

/**
 * Sanitize and validate notch noise type from URL parameter
 */
export function validateNotchNoiseType(
  value: string | null
): 'white' | 'pink' | 'purple' | null {
  if (!value) return null;

  try {
    return notchNoiseTypeSchema.parse(value);
  } catch {
    return null;
  }
}

/**
 * Sanitize and validate ear selection from URL parameter
 */
export function validateEarSelection(
  value: string | null
): 'both' | 'left' | 'right' | null {
  if (!value) return null;

  try {
    return earSelectionSchema.parse(value);
  } catch {
    return null;
  }
}

/**
 * Sanitize string to prevent XSS
 * Removes potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize localStorage data
 * Returns null if data is invalid or corrupted
 */
export function validateLocalStorageData<T>(
  key: string,
  schema: z.ZodSchema<T>
): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return schema.parse(parsed);
  } catch {
    // Invalid or corrupted data - remove it
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
    return null;
  }
}

/**
 * Safe localStorage setter with validation
 */
export function setLocalStorageData<T>(
  key: string,
  data: T,
  schema: z.ZodSchema<T>
): boolean {
  try {
    // Validate data before storing
    const validated = schema.parse(data);
    localStorage.setItem(key, JSON.stringify(validated));
    return true;
  } catch {
    return false;
  }
}

// Schemas for localStorage data
export const tinnitusSettingsSchema = z.object({
  frequency: frequencySchema,
  volume: volumeSchema,
  waveform: waveformSchema,
  timestamp: z.string().optional(),
});

export const audiometerCalibrationSchema = z.object({
  calibrationOffset: z.number().min(0.1).max(2.0),
  timestamp: z.string().optional(),
});
