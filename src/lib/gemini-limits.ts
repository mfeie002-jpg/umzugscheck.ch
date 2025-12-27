/**
 * Gemini-Apps File Upload Limits
 * Based on official Google documentation
 * @see https://support.google.com/gemini/answer/15096402
 */

// File size limits in bytes
export const GEMINI_LIMITS = {
  // Maximum files per prompt
  MAX_FILES_PER_PROMPT: 10,

  // File size limits
  MAX_VIDEO_SIZE: 2 * 1024 * 1024 * 1024, // 2 GB
  MAX_OTHER_FILE_SIZE: 100 * 1024 * 1024, // 100 MB

  // Duration limits (in seconds)
  MAX_VIDEO_DURATION: 5 * 60, // 5 minutes (free tier)
  MAX_VIDEO_DURATION_PRO: 60 * 60, // 1 hour (Google AI Pro/Ultra)
  MAX_AUDIO_DURATION: 10 * 60, // 10 minutes (free tier)
  MAX_AUDIO_DURATION_PRO: 3 * 60 * 60, // 3 hours (Google AI Pro/Ultra)

  // ZIP file limits
  ZIP_MAX_FILES: 10,
  ZIP_MAX_SIZE: 100 * 1024 * 1024, // 100 MB

  // Code folder/GitHub limits
  CODE_MAX_FILES: 5000,
  CODE_MAX_SIZE: 100 * 1024 * 1024, // 100 MB
} as const;

// File type categories
export const GEMINI_FILE_TYPES = {
  VIDEO: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4'],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/html',
    'text/markdown',
  ],
  CODE: [
    'text/javascript',
    'text/typescript',
    'text/css',
    'text/html',
    'application/json',
    'text/x-python',
    'text/x-java-source',
  ],
  ZIP: ['application/zip', 'application/x-zip-compressed'],
} as const;

// Helper type
export type FileCategory = keyof typeof GEMINI_FILE_TYPES;

/**
 * Get the file category based on MIME type
 */
export function getFileCategory(mimeType: string): FileCategory | 'OTHER' {
  for (const [category, types] of Object.entries(GEMINI_FILE_TYPES)) {
    if (types.some(type => mimeType.startsWith(type.split('/')[0] + '/') || mimeType === type)) {
      return category as FileCategory;
    }
  }
  return 'OTHER';
}

/**
 * Get the maximum file size for a given file type
 */
export function getMaxFileSizeForType(mimeType: string): number {
  const category = getFileCategory(mimeType);
  if (category === 'VIDEO') {
    return GEMINI_LIMITS.MAX_VIDEO_SIZE;
  }
  return GEMINI_LIMITS.MAX_OTHER_FILE_SIZE;
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} Sekunden`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} Minuten`;
  return `${Math.floor(seconds / 3600)} Stunde${seconds >= 7200 ? 'n' : ''}`;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  category: FileCategory | 'OTHER';
  maxSize: number;
}

/**
 * Validate a file against Gemini limits
 */
export function validateFileForGemini(file: File): FileValidationResult {
  const category = getFileCategory(file.type);
  const maxSize = getMaxFileSizeForType(file.type);

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Datei "${file.name}" ist zu gross. Maximum: ${formatBytes(maxSize)}`,
      category,
      maxSize,
    };
  }

  return {
    valid: true,
    category,
    maxSize,
  };
}

/**
 * Validate multiple files for a single prompt
 */
export function validateFilesForGemini(files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check file count
  if (files.length > GEMINI_LIMITS.MAX_FILES_PER_PROMPT) {
    errors.push(`Maximal ${GEMINI_LIMITS.MAX_FILES_PER_PROMPT} Dateien pro Prompt erlaubt`);
  }

  // Validate each file
  for (const file of files) {
    const result = validateFileForGemini(file);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get limit info for display in UI
 */
export function getGeminiLimitInfo(): {
  maxFiles: number;
  maxVideoSize: string;
  maxOtherSize: string;
  maxVideoDuration: string;
  maxAudioDuration: string;
} {
  return {
    maxFiles: GEMINI_LIMITS.MAX_FILES_PER_PROMPT,
    maxVideoSize: formatBytes(GEMINI_LIMITS.MAX_VIDEO_SIZE),
    maxOtherSize: formatBytes(GEMINI_LIMITS.MAX_OTHER_FILE_SIZE),
    maxVideoDuration: formatDuration(GEMINI_LIMITS.MAX_VIDEO_DURATION),
    maxAudioDuration: formatDuration(GEMINI_LIMITS.MAX_AUDIO_DURATION),
  };
}
