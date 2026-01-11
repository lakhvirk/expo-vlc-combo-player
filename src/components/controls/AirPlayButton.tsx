import React, { useCallback, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { AirPlayIcon } from '../icons';
import type { AirPlayButtonProps } from '../../ExpoVlcComboPlayer.types';

export const AirPlayButton: React.FC<AirPlayButtonProps> = ({
  isConnected,
  onPress,
  size = 24,
  activeColor = '#007AFF',
  inactiveColor = '#FFFFFF',
  style,
  disabled = false,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when connected
  React.useEffect(() => {
    if (isConnected) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isConnected, pulseAnim]);

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

  const color = isConnected ? activeColor : inactiveColor;

  // Note: On iOS, you would typically use the native AVRoutePickerView
  // This component provides a visual button that can trigger native AirPlay picker

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, style]}
      accessibilityLabel={isConnected ? 'AirPlay connected' : 'AirPlay'}
      accessibilityRole="button"
      accessibilityState={{ selected: isConnected }}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: scaleValue },
              { scale: isConnected ? pulseAnim : 1 },
            ],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <AirPlayIcon size={size} color={color} isActive={isConnected} />
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

export default AirPlayButton;
