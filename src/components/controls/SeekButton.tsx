import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { ForwardIcon, BackwardIcon } from '../icons';
import type { SeekButtonProps } from '../../ExpoVlcComboPlayer.types';

export const SeekButton: React.FC<SeekButtonProps> = ({
  direction,
  seconds,
  onPress,
  size = 40,
  color = '#FFFFFF',
  style,
  disabled = false,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const rotationValue = React.useRef(new Animated.Value(0)).current;

  const handlePress = useCallback(() => {
    // Animate scale down and rotate slightly
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
      Animated.sequence([
        Animated.timing(rotationValue, {
          toValue: direction === 'forward' ? 1 : -1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotationValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onPress();
  }, [onPress, scaleValue, rotationValue, direction]);

  const rotation = rotationValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  const Icon = direction === 'forward' ? ForwardIcon : BackwardIcon;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, style]}
      accessibilityLabel={`Seek ${direction} ${seconds} seconds`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: size,
            height: size,
            transform: [{ scale: scaleValue }, { rotate: rotation }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Icon size={size} color={color} seconds={seconds} />
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
  },
});

export default SeekButton;
