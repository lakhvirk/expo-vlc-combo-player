import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { PlayIcon, PauseIcon } from '../icons';
import type { PlayPauseButtonProps } from '../../ExpoVlcComboPlayer.types';

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onPress,
  size = 48,
  color = '#FFFFFF',
  style,
  disabled = false,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [scaleValue]);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, style]}
      accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: size,
            height: size,
            transform: [{ scale: scaleValue }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {isPlaying ? (
          <PauseIcon size={size} color={color} />
        ) : (
          <PlayIcon size={size} color={color} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default PlayPauseButton;
