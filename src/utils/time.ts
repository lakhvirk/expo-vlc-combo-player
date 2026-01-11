/**
 * Format seconds to MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${pad(minutes)}:${pad(secs)}`;
}

/**
 * Parse time string to seconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':').map(Number);

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return 0;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(currentTime: number, duration: number): number {
  if (!duration || duration <= 0) return 0;
  return Math.min(Math.max((currentTime / duration) * 100, 0), 100);
}

/**
 * Calculate time from progress percentage
 */
export function calculateTimeFromProgress(progress: number, duration: number): number {
  if (!duration || duration <= 0) return 0;
  return Math.min(Math.max((progress / 100) * duration, 0), duration);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format playback speed for display
 */
export function formatSpeed(speed: number): string {
  if (speed === 1) return '1x';
  if (speed === 0.5) return '0.5x';
  if (speed === 0.75) return '0.75x';
  if (speed === 1.25) return '1.25x';
  if (speed === 1.5) return '1.5x';
  if (speed === 1.75) return '1.75x';
  if (speed === 2) return '2x';
  if (speed === 0.25) return '0.25x';
  return `${speed}x`;
}
