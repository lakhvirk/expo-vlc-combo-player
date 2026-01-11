import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import type { ProgressBarProps } from '../../ExpoVlcComboPlayer.types';
import { clamp } from '../../utils/time';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  bufferedTime,
  onSeek,
  onSeekStart,
  onSeekEnd,
  progressColor = '#FF0000',
  bufferColor = 'rgba(255, 255, 255, 0.5)',
  backgroundColor = 'rgba(255, 255, 255, 0.3)',
  thumbColor = '#FFFFFF',
  thumbSize = 16,
  height = 4,
  style,
  disabled = false,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const thumbScale = useRef(new Animated.Value(1)).current;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (bufferedTime / duration) * 100 : 0;
  const displayProgress = isSeeking ? seekPosition : progress;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const calculateTimeFromPosition = useCallback(
    (x: number): number => {
      if (containerWidth <= 0 || duration <= 0) return 0;
      const percentage = clamp(x / containerWidth, 0, 1);
      return percentage * duration;
    },
    [containerWidth, duration]
  );

  const animateThumbIn = useCallback(() => {
    Animated.spring(thumbScale, {
      toValue: 1.5,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [thumbScale]);

  const animateThumbOut = useCallback(() => {
    Animated.spring(thumbScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [thumbScale]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (event: GestureResponderEvent) => {
        setIsSeeking(true);
        animateThumbIn();
        onSeekStart?.();

        const x = event.nativeEvent.locationX;
        const percentage = clamp((x / containerWidth) * 100, 0, 100);
        setSeekPosition(percentage);
      },
      onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const x = event.nativeEvent.pageX - (event.nativeEvent.pageX - event.nativeEvent.locationX) + gestureState.dx;
        const clampedX = clamp(x, 0, containerWidth);
        const percentage = (clampedX / containerWidth) * 100;
        setSeekPosition(clamp(percentage, 0, 100));
      },
      onPanResponderRelease: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setIsSeeking(false);
        animateThumbOut();

        const x = event.nativeEvent.pageX - (event.nativeEvent.pageX - event.nativeEvent.locationX) + gestureState.dx;
        const clampedX = clamp(x, 0, containerWidth);
        const time = calculateTimeFromPosition(clampedX);
        onSeek(time);
        onSeekEnd?.();
      },
      onPanResponderTerminate: () => {
        setIsSeeking(false);
        animateThumbOut();
        onSeekEnd?.();
      },
    })
  ).current;

  // Update panResponder with latest containerWidth
  React.useEffect(() => {
    panResponder.panHandlers.onStartShouldSetResponder = () => !disabled;
    panResponder.panHandlers.onMoveShouldSetResponder = () => !disabled;
  }, [containerWidth, disabled, panResponder]);

  const handleTap = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;
      const x = event.nativeEvent.locationX;
      const time = calculateTimeFromPosition(x);
      onSeek(time);
    },
    [disabled, calculateTimeFromPosition, onSeek]
  );

  return (
    <View
      style={[styles.container, { height: thumbSize + 20 }, style]}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
      onTouchEnd={!isSeeking ? handleTap : undefined}
    >
      {/* Background track */}
      <View
        style={[
          styles.track,
          {
            backgroundColor,
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        {/* Buffered progress */}
        <View
          style={[
            styles.bufferedProgress,
            {
              backgroundColor: bufferColor,
              width: `${bufferedProgress}%`,
              height,
              borderRadius: height / 2,
            },
          ]}
        />

        {/* Current progress */}
        <View
          style={[
            styles.progress,
            {
              backgroundColor: progressColor,
              width: `${displayProgress}%`,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>

      {/* Thumb */}
      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: thumbColor,
            left: `${displayProgress}%`,
            marginLeft: -thumbSize / 2,
            transform: [{ scale: thumbScale }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  bufferedProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ProgressBar;
