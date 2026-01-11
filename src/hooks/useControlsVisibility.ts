import { useState, useCallback, useRef, useEffect } from 'react';
import type { UsePlayerControlsOptions } from '../ExpoVlcComboPlayer.types';

export function useControlsVisibility(options: UsePlayerControlsOptions = {}) {
  const {
    autoHide = true,
    autoHideDelay = 3000,
  } = options;

  const [isVisible, setIsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  // Schedule auto-hide on mount and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    // Schedule auto-hide on mount if controls are visible and autoHide is enabled
    if (autoHide && isVisible && !isLocked) {
      hideTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsVisible(false);
        }
      }, autoHideDelay);
    }

    return () => {
      isMountedRef.current = false;
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []); // Only run on mount/unmount

  // Schedule auto-hide
  const scheduleHide = useCallback(() => {
    if (!autoHide || isLocked) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsVisible(false);
      }
    }, autoHideDelay);
  }, [autoHide, autoHideDelay, isLocked]);

  // Cancel scheduled hide
  const cancelHide = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // Show controls
  const show = useCallback(() => {
    setIsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  // Hide controls
  const hide = useCallback(() => {
    if (!isLocked) {
      cancelHide();
      setIsVisible(false);
    }
  }, [cancelHide, isLocked]);

  // Toggle visibility
  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  // Lock controls (prevent auto-hide)
  const lock = useCallback(() => {
    setIsLocked(true);
    cancelHide();
    setIsVisible(true);
  }, [cancelHide]);

  // Unlock controls (allow auto-hide)
  const unlock = useCallback(() => {
    setIsLocked(false);
    if (isVisible && autoHide) {
      scheduleHide();
    }
  }, [isVisible, autoHide, scheduleHide]);

  // Reset visibility timer (call on user interaction)
  const resetTimer = useCallback(() => {
    if (isVisible && autoHide && !isLocked) {
      scheduleHide();
    }
  }, [isVisible, autoHide, isLocked, scheduleHide]);

  // Keep visible (call when seeking, etc.)
  const keepVisible = useCallback(() => {
    cancelHide();
    setIsVisible(true);
  }, [cancelHide]);

  // Resume auto-hide after keeping visible
  const resumeAutoHide = useCallback(() => {
    if (autoHide && !isLocked) {
      scheduleHide();
    }
  }, [autoHide, isLocked, scheduleHide]);

  return {
    isVisible,
    isLocked,
    show,
    hide,
    toggle,
    lock,
    unlock,
    resetTimer,
    keepVisible,
    resumeAutoHide,
  };
}

export default useControlsVisibility;
