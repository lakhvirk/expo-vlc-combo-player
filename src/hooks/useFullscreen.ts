import { useState, useCallback, useEffect } from 'react';
import { Dimensions, StatusBar, Platform } from 'react-native';
import type { UseFullscreenOptions } from '../ExpoVlcComboPlayer.types';

// Try to import ScreenOrientation from expo if available
let ScreenOrientation: typeof import('expo-screen-orientation') | null = null;
try {
  ScreenOrientation = require('expo-screen-orientation');
} catch {
  // expo-screen-orientation not available
}

export function useFullscreen(options: UseFullscreenOptions = {}) {
  const {
    orientation = 'landscape',
    autoRotate = true,
    onEnter,
    onExit,
  } = options;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [originalOrientation, setOriginalOrientation] = useState<number | null>(null);

  // Lock orientation on enter
  const lockOrientation = useCallback(async () => {
    if (!ScreenOrientation || !autoRotate) return;

    try {
      // Save original orientation
      const current = await ScreenOrientation.getOrientationAsync();
      setOriginalOrientation(current);

      // Lock to desired orientation
      switch (orientation) {
        case 'landscape':
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          );
          break;
        case 'portrait':
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
          );
          break;
        case 'all':
        default:
          await ScreenOrientation.unlockAsync();
          break;
      }
    } catch (error) {
      console.warn('Failed to lock orientation:', error);
    }
  }, [orientation, autoRotate]);

  // Unlock orientation on exit
  const unlockOrientation = useCallback(async () => {
    if (!ScreenOrientation || !autoRotate) return;

    try {
      // Restore original orientation or unlock
      if (originalOrientation !== null) {
        await ScreenOrientation.unlockAsync();
      }
    } catch (error) {
      console.warn('Failed to unlock orientation:', error);
    }
  }, [originalOrientation, autoRotate]);

  // Enter fullscreen
  const enterFullscreen = useCallback(async () => {
    setIsFullscreen(true);

    // Hide status bar
    if (Platform.OS !== 'web') {
      StatusBar.setHidden(true, 'fade');
    }

    // Lock orientation
    await lockOrientation();

    onEnter?.();
  }, [lockOrientation, onEnter]);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    setIsFullscreen(false);

    // Show status bar
    if (Platform.OS !== 'web') {
      StatusBar.setHidden(false, 'fade');
    }

    // Unlock orientation
    await unlockOrientation();

    onExit?.();
  }, [unlockOrientation, onExit]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Get screen dimensions for fullscreen
  const getFullscreenDimensions = useCallback(() => {
    const { width, height } = Dimensions.get('window');
    if (orientation === 'landscape' && width < height) {
      return { width: height, height: width };
    }
    return { width, height };
  }, [orientation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isFullscreen && Platform.OS !== 'web') {
        StatusBar.setHidden(false, 'fade');
      }
    };
  }, [isFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    getFullscreenDimensions,
  };
}

export default useFullscreen;
