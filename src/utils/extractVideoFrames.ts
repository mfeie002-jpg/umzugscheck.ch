/**
 * extractVideoFrames - Client-side frame extraction from video files
 * 
 * Extracts N evenly-distributed JPEG frames from a video file using
 * HTMLVideoElement + Canvas (offscreen, not in DOM).
 * 
 * Returns: Promise<string[]> - array of data:image/jpeg;base64,... strings
 */

interface ExtractFramesOptions {
  targetFrames?: number;   // default: 10
  maxWidth?: number;       // default: 1024
  quality?: number;        // default: 0.75 (JPEG quality)
  onProgress?: (current: number, total: number) => void;
}

export async function extractVideoFrames(
  file: File,
  options: ExtractFramesOptions = {}
): Promise<string[]> {
  const {
    targetFrames = 10,
    maxWidth = 1024,
    quality = 0.75,
    onProgress,
  } = options;

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Canvas 2D context not available"));
      return;
    }

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.src = "";
      video.load();
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Video konnte nicht geladen werden. Bitte versuchen Sie ein anderes Format."));
    };

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration) || duration <= 0) {
        cleanup();
        reject(new Error("Video-Dauer konnte nicht ermittelt werden."));
        return;
      }

      const frames: string[] = [];
      const actualFrames = Math.min(targetFrames, Math.floor(duration));
      const interval = duration / (actualFrames + 1);

      for (let i = 1; i <= actualFrames; i++) {
        const timestamp = interval * i;
        
        try {
          const frame = await seekAndCapture(video, canvas, ctx, timestamp, maxWidth, quality);
          frames.push(frame);
          onProgress?.(i, actualFrames);
        } catch (e) {
          console.warn(`Frame ${i} at ${timestamp}s failed, skipping:`, e);
        }
      }

      cleanup();

      if (frames.length === 0) {
        reject(new Error("Keine Frames konnten aus dem Video extrahiert werden."));
        return;
      }

      resolve(frames);
    };

    video.src = objectUrl;
    video.load();
  });
}

function seekAndCapture(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  timestamp: number,
  maxWidth: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Seek timeout at ${timestamp}s`));
    }, 5000);

    video.onseeked = () => {
      clearTimeout(timeout);
      
      // Scale canvas to fit within maxWidth while keeping aspect ratio
      const w = video.videoWidth;
      const h = video.videoHeight;
      
      if (w === 0 || h === 0) {
        reject(new Error("Invalid video dimensions"));
        return;
      }

      const scale = Math.min(1, maxWidth / w);
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl);
    };

    video.currentTime = timestamp;
  });
}

/**
 * Sample frames evenly from an array (used when more frames than max are provided)
 */
export function sampleFrames(frames: string[], maxFrames: number): string[] {
  if (frames.length <= maxFrames) return frames;
  const step = frames.length / maxFrames;
  return Array.from({ length: maxFrames }, (_, i) => frames[Math.floor(i * step)]);
}
