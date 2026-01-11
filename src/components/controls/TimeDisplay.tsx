import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TimeDisplayProps } from '../../ExpoVlcComboPlayer.types';
import { formatTime } from '../../utils/time';

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  currentTime,
  duration,
  textColor = '#FFFFFF',
  fontSize = 12,
  style,
  textStyle,
  separator = ' / ',
}) => {
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
        {formattedCurrentTime}
        <Text style={[styles.separator, { color: textColor, opacity: 0.7 }]}>
          {separator}
        </Text>
        {formattedDuration}
      </Text>
    </View>
  );
};

// Alternative: Separate time displays for current and duration
export const TimeDisplaySeparate: React.FC<
  TimeDisplayProps & { showDuration?: boolean }
> = ({
  currentTime,
  duration,
  textColor = '#FFFFFF',
  fontSize = 12,
  style,
  textStyle,
  showDuration = true,
}) => {
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  return (
    <View style={[styles.separateContainer, style]}>
      <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
        {formattedCurrentTime}
      </Text>
      {showDuration && (
        <Text
          style={[
            styles.text,
            styles.durationText,
            { color: textColor, fontSize, opacity: 0.7 },
            textStyle,
          ]}
        >
          {formattedDuration}
        </Text>
      )}
    </View>
  );
};

// Compact time display showing remaining time
export const RemainingTimeDisplay: React.FC<TimeDisplayProps> = ({
  currentTime,
  duration,
  textColor = '#FFFFFF',
  fontSize = 12,
  style,
  textStyle,
}) => {
  const remainingTime = Math.max(0, duration - currentTime);
  const formattedRemainingTime = formatTime(remainingTime);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
        -{formattedRemainingTime}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
  separator: {},
  durationText: {
    marginLeft: 8,
  },
});

export default TimeDisplay;
