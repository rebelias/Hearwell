/**
 * Client-side error logger
 * Stores errors in localStorage for debugging (no network transmission)
 * Maximum 50 errors stored to prevent localStorage bloat
 */

const STORAGE_KEY = 'hearwell_errors';
const MAX_ERRORS = 50;

export interface ErrorLog {
  timestamp: string;
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  context?: Record<string, unknown>;
  userAgent: string;
  url: string;
}

/**
 * Log an error to console and localStorage
 * @param error - The error object
 * @param context - Additional context about where the error occurred
 */
export function logError(
  error: Error | unknown,
  context?: Record<string, unknown>
): void {
  // Always log to console
  console.error('Error logged:', error, context);

  try {
    // Get existing errors
    const existingErrors = getStoredErrors();

    // Create error log entry
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'UnknownError',
      },
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Add new error to the beginning
    existingErrors.unshift(errorLog);

    // Keep only the most recent MAX_ERRORS errors
    const trimmedErrors = existingErrors.slice(0, MAX_ERRORS);

    // Store back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedErrors));
  } catch (storageError) {
    // If localStorage is unavailable or full, just log to console
    console.warn('Failed to store error in localStorage:', storageError);
  }
}

/**
 * Get all stored errors from localStorage
 * @returns Array of error logs
 */
export function getStoredErrors(): ErrorLog[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as ErrorLog[];
    // Validate it's an array
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to read errors from localStorage:', error);
    return [];
  }
}

/**
 * Clear all stored errors from localStorage
 */
export function clearStoredErrors(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear errors from localStorage:', error);
  }
}

/**
 * Get error count
 * @returns Number of stored errors
 */
export function getErrorCount(): number {
  return getStoredErrors().length;
}
