/**
 * extractVideoFrames - Client-side frame extraction from video files
 * 
 * COPY TO: src/utils/extractVideoFrames.ts
 * 
 * UI-agnostisch, kein Framework-Import.
 * Gibt 10 gleichmässig verteilte JPEG-Frames als base64-Strings zurück.
 */

interface ExtractFramesOptions {
  targetFrames?: number;   // default: 10
  maxWidth?: number;       // default: 1024px
  quality?: number;        // default: 0.75 JPEG quality
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
      reject(new Error("Canvas 2D context nicht verfügbar"));
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
      reject(new Error("Video konnte nicht geladen werden. Bitte anderes Format versuchen (MP4, MOV)."));
    };

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration) || duration <= 0) {
        cleanup();
        reject(new Error("Video-Dauer konnte nicht ermittelt werden."));
        return;
      }

      const frames: string[] = [];
      const actualFrames = Math.min(targetFrames, Math.max(1, Math.floor(duration)));
      const interval = duration / (actualFrames + 1);

      for (let i = 1; i <= actualFrames; i++) {
        try {
          const frame = await seekAndCapture(video, canvas, ctx, interval * i, maxWidth, quality);
          frames.push(frame);
          onProgress?.(i, actualFrames);
        } catch (e) {
          console.warn(`Frame ${i} fehlgeschlagen, übersprungen:`, e);
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
    const timeout = setTimeout(() => reject(new Error(`Seek timeout bei ${timestamp}s`)), 5000);

    video.onseeked = () => {
      clearTimeout(timeout);
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w === 0 || h === 0) { reject(new Error("Ungültige Video-Dimensionen")); return; }
      const scale = Math.min(1, maxWidth / w);
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    video.currentTime = timestamp;
  });
}

export function sampleFrames(frames: string[], maxFrames: number): string[] {
  if (frames.length <= maxFrames) return frames;
  const step = frames.length / maxFrames;
  return Array.from({ length: maxFrames }, (_, i) => frames[Math.floor(i * step)]);
}
