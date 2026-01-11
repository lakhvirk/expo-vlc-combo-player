import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { VolumeHighIcon, VolumeMutedIcon } from '../icons';
import type { VolumeControlProps } from '../../ExpoVlcComboPlayer.types';
import { clamp } from '../../utils/time';

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  iconSize = 24,
  iconColor = '#FFFFFF',
  sliderColor = '#FFFFFF',
  sliderBackgroundColor = 'rgba(255, 255, 255, 0.3)',
  style,
  disabled = false,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const sliderOpacity = useRef(new Animated.Value(0)).current;
  const sliderScale = useRef(new Animated.Value(0.8)).current;

  const showSlider = useCallback(() => {
    setIsSliderVisible(true);
    Animated.parallel([
      Animated.timing(sliderOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(sliderScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [sliderOpacity, sliderScale]);

  const hideSlider = useCallback(() => {
    Animated.parallel([
      Animated.timing(sliderOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sliderScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSliderVisible(false);
    });
  }, [sliderOpacity, sliderScale]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {},
      onPanResponderMove: (event) => {
        const x = event.nativeEvent.locationX;
        const newVolume = clamp(x / sliderWidth, 0, 1);
        onVolumeChange(newVolume);
      },
      onPanResponderRelease: (event) => {
        const x = event.nativeEvent.locationX;
        const newVolume = clamp(x / sliderWidth, 0, 1);
        onVolumeChange(newVolume);
      },
    })
  ).current;

  const handleIconPress = useCallback(() => {
    if (disabled) return;
    onMuteToggle();
  }, [disabled, onMuteToggle]);

  const handleIconLongPress = useCallback(() => {
    if (disabled) return;
    if (isSliderVisible) {
      hideSlider();
    } else {
      showSlider();
    }
  }, [disabled, isSliderVisible, showSlider, hideSlider]);

  const displayVolume = isMuted ? 0 : volume;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleIconPress}
        onLongPress={handleIconLongPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={styles.iconButton}
        accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
        accessibilityRole="button"
      >
        {isMuted || volume === 0 ? (
          <VolumeMutedIcon
            size={iconSize}
            color={iconColor}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
        ) : (
          <VolumeHighIcon
            size={iconSize}
            color={iconColor}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
        )}
      </TouchableOpacity>

      {isSliderVisible && (
        <Animated.View
          style={[
            styles.sliderContainer,
            {
              opacity: sliderOpacity,
              transform: [{ scale: sliderScale }],
            },
          ]}
          onLayout={handleLayout}
          {...panResponder.panHandlers}
        >
          <View
            style={[
              styles.sliderTrack,
              { backgroundColor: sliderBackgroundColor },
            ]}
          >
            <View
              style={[
                styles.sliderFill,
                {
                  backgroundColor: sliderColor,
                  width: `${displayVolume * 100}%`,
                },
              ]}
            />
          </View>
          <View
            style={[
              styles.sliderThumb,
              {
                backgroundColor: sliderColor,
                left: `${displayVolume * 100}%`,
                marginLeft: -6,
              },
            ]}
          />
        </Animated.View>
      )}
    </View>
  );
};

// Horizontal volume slider (always visible)
export const VolumeSlider: React.FC<VolumeControlProps & { width?: number }> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  iconSize = 20,
  iconColor = '#FFFFFF',
  sliderColor = '#FFFFFF',
  sliderBackgroundColor = 'rgba(255, 255, 255, 0.3)',
  style,
  disabled = false,
  width = 80,
}) => {
  const [sliderWidth, setSliderWidth] = useState(width);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderMove: (event) => {
        const x = event.nativeEvent.locationX;
        const newVolume = clamp(x / sliderWidth, 0, 1);
        onVolumeChange(newVolume);
      },
      onPanResponderRelease: (event) => {
        const x = event.nativeEvent.locationX;
        const newVolume = clamp(x / sliderWidth, 0, 1);
        onVolumeChange(newVolume);
      },
    })
  ).current;

  const displayVolume = isMuted ? 0 : volume;

  return (
    <View style={[styles.horizontalContainer, style]}>
      <TouchableOpacity
        onPress={onMuteToggle}
        disabled={disabled}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        {isMuted || volume === 0 ? (
          <VolumeMutedIcon
            size={iconSize}
            color={iconColor}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
        ) : (
          <VolumeHighIcon
            size={iconSize}
            color={iconColor}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
        )}
      </TouchableOpacity>

      <View
        style={[styles.horizontalSlider, { width }]}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.horizontalTrack,
            { backgroundColor: sliderBackgroundColor },
          ]}
        >
          <View
            style={[
              styles.horizontalFill,
              {
                backgroundColor: sliderColor,
                width: `${displayVolume * 100}%`,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.horizontalThumb,
            {
              backgroundColor: sliderColor,
              left: `${displayVolume * 100}%`,
              marginLeft: -5,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  sliderContainer: {
    width: 100,
    height: 24,
    marginLeft: 8,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 6,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalSlider: {
    height: 20,
    marginLeft: 8,
    justifyContent: 'center',
  },
  horizontalTrack: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  horizontalFill: {
    height: '100%',
  },
  horizontalThumb: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 5,
  },
});

export default VolumeControl;
