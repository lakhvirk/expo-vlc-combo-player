import React, { useCallback, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { FullscreenEnterIcon, FullscreenExitIcon } from '../icons';
import type { FullscreenButtonProps } from '../../ExpoVlcComboPlayer.types';

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen,
  onPress,
  size = 24,
  color = '#FFFFFF',
  style,
  disabled = false,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  const handlePress = useCallback(() => {
    // Animate the button press with scale and rotation
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 0.85,
          useNativeDriver: true,
          friction: 5,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
      ]),
      Animated.timing(rotateValue, {
        toValue: isFullscreen ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  }, [onPress, scaleValue, rotateValue, isFullscreen]);

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, style]}
      accessibilityLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleValue }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {isFullscreen ? (
          <FullscreenExitIcon size={size} color={color} />
        ) : (
          <FullscreenEnterIcon size={size} color={color} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullscreenButton;
