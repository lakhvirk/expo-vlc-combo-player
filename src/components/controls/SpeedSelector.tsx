import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import type { SpeedSelectorProps, PlaybackSpeed } from '../../ExpoVlcComboPlayer.types';
import { PLAYBACK_SPEEDS } from '../../ExpoVlcComboPlayer.types';
import { formatSpeed } from '../../utils/time';

export const SpeedSelector: React.FC<SpeedSelectorProps> = ({
  currentSpeed,
  onSpeedChange,
  speeds = PLAYBACK_SPEEDS,
  activeColor = '#FF0000',
  inactiveColor = '#FFFFFF',
  backgroundColor = 'rgba(0, 0, 0, 0.9)',
  style,
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const openModal = useCallback(() => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  }, [fadeAnim, scaleAnim]);

  const handleSpeedSelect = useCallback(
    (speed: PlaybackSpeed) => {
      onSpeedChange(speed);
      closeModal();
    },
    [onSpeedChange, closeModal]
  );

  const handleButtonPress = useCallback(() => {
    if (disabled) return;
    openModal();
  }, [disabled, openModal]);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleButtonPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[styles.button, buttonStyle]}
        accessibilityLabel={`Playback speed ${formatSpeed(currentSpeed)}`}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.buttonText,
            { color: inactiveColor, opacity: disabled ? 0.5 : 1 },
            textStyle,
          ]}
        >
          {formatSpeed(currentSpeed)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.modalTitle}>Playback Speed</Text>
            <View style={styles.speedGrid}>
              {speeds.map((speed) => {
                const isActive = speed === currentSpeed;
                return (
                  <TouchableOpacity
                    key={speed}
                    onPress={() => handleSpeedSelect(speed)}
                    style={[
                      styles.speedButton,
                      isActive && { backgroundColor: `${activeColor}33` },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.speedButtonText,
                        { color: isActive ? activeColor : inactiveColor },
                        isActive && styles.activeSpeedText,
                      ]}
                    >
                      {formatSpeed(speed)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

// Inline speed selector (horizontal buttons) for showing directly in controls
export const InlineSpeedSelector: React.FC<SpeedSelectorProps> = ({
  currentSpeed,
  onSpeedChange,
  speeds = [0.5, 1, 1.5, 2] as PlaybackSpeed[],
  activeColor = '#FF0000',
  inactiveColor = '#FFFFFF',
  style,
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <View style={[styles.inlineContainer, style]}>
      {speeds.map((speed) => {
        const isActive = speed === currentSpeed;
        return (
          <TouchableOpacity
            key={speed}
            onPress={() => onSpeedChange(speed)}
            disabled={disabled}
            style={[
              styles.inlineButton,
              isActive && { backgroundColor: `${activeColor}33`, borderColor: activeColor },
              buttonStyle,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.inlineButtonText,
                { color: isActive ? activeColor : inactiveColor },
                isActive && styles.activeSpeedText,
                { opacity: disabled ? 0.5 : 1 },
                textStyle,
              ]}
            >
              {formatSpeed(speed)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    maxWidth: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  speedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  speedButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  speedButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeSpeedText: {
    fontWeight: '700',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 4 : undefined,
  },
  inlineButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inlineButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SpeedSelector;
