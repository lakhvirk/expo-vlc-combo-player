import { useRef, useCallback } from 'react';
import { GestureResponderEvent, Dimensions } from 'react-native';

type DoubleTapZone = 'left' | 'center' | 'right';

type UseDoubleTapOptions = {
  onSingleTap?: () => void;
  onDoubleTapLeft?: () => void;
  onDoubleTapRight?: () => void;
  onDoubleTapCenter?: () => void;
  doubleTapDelay?: number;
  leftZoneWidth?: number;
  rightZoneWidth?: number;
};

export function useDoubleTap(options: UseDoubleTapOptions = {}) {
  const {
    onSingleTap,
    onDoubleTapLeft,
    onDoubleTapRight,
    onDoubleTapCenter,
    doubleTapDelay = 300,
    leftZoneWidth = 0.3, // 30% of width
    rightZoneWidth = 0.3, // 30% of width
  } = options;

  const lastTapRef = useRef<number>(0);
  const lastTapXRef = useRef<number>(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerWidthRef = useRef<number>(Dimensions.get('window').width);

  const setContainerWidth = useCallback((width: number) => {
    containerWidthRef.current = width;
  }, []);

  const getTapZone = useCallback(
    (x: number): DoubleTapZone => {
      const width = containerWidthRef.current;
      const leftBoundary = width * leftZoneWidth;
      const rightBoundary = width * (1 - rightZoneWidth);

      if (x < leftBoundary) {
        return 'left';
      } else if (x > rightBoundary) {
        return 'right';
      }
      return 'center';
    },
    [leftZoneWidth, rightZoneWidth]
  );

  const handleTap = useCallback(
    (event: GestureResponderEvent) => {
      const now = Date.now();
      const x = event.nativeEvent.locationX;
      const timeSinceLastTap = now - lastTapRef.current;

      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }

      // Check if this is a double tap (same zone, within delay)
      const currentZone = getTapZone(x);
      const lastZone = getTapZone(lastTapXRef.current);

      if (timeSinceLastTap < doubleTapDelay && currentZone === lastZone) {
        // Double tap detected
        lastTapRef.current = 0;
        lastTapXRef.current = 0;

        switch (currentZone) {
          case 'left':
            onDoubleTapLeft?.();
            break;
          case 'right':
            onDoubleTapRight?.();
            break;
          case 'center':
            onDoubleTapCenter?.();
            break;
        }
      } else {
        // Potential single tap - wait to see if another tap comes
        lastTapRef.current = now;
        lastTapXRef.current = x;

        tapTimeoutRef.current = setTimeout(() => {
          // Single tap confirmed
          lastTapRef.current = 0;
          lastTapXRef.current = 0;
          onSingleTap?.();
        }, doubleTapDelay);
      }
    },
    [
      doubleTapDelay,
      getTapZone,
      onSingleTap,
      onDoubleTapLeft,
      onDoubleTapRight,
      onDoubleTapCenter,
    ]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
    }
  }, []);

  return {
    handleTap,
    setContainerWidth,
    cleanup,
  };
}

export default useDoubleTap;
