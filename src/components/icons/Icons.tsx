import React from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';

type IconProps = {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

// Play Icon - Triangle pointing right
export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  const triangleSize = size * 0.6;
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View
        style={[
          styles.playTriangle,
          {
            borderLeftWidth: triangleSize,
            borderTopWidth: triangleSize / 2,
            borderBottomWidth: triangleSize / 2,
            borderLeftColor: color,
          },
        ]}
      />
    </View>
  );
};

// Pause Icon - Two vertical bars
export const PauseIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  const barWidth = size * 0.2;
  const barHeight = size * 0.6;
  const gap = size * 0.15;
  return (
    <View style={[styles.iconContainer, styles.pauseContainer, { width: size, height: size }, style]}>
      <View style={[styles.pauseBar, { width: barWidth, height: barHeight, backgroundColor: color, marginRight: gap }]} />
      <View style={[styles.pauseBar, { width: barWidth, height: barHeight, backgroundColor: color }]} />
    </View>
  );
};

// Forward Icon - Two triangles pointing right with number
export const ForwardIcon: React.FC<IconProps & { seconds?: number }> = ({
  size = 24,
  color = '#FFFFFF',
  style,
  seconds = 10,
}) => {
  const triangleSize = size * 0.3;
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View style={styles.seekIconContainer}>
        <View style={styles.seekTriangles}>
          <View
            style={[
              styles.playTriangle,
              {
                borderLeftWidth: triangleSize,
                borderTopWidth: triangleSize / 2,
                borderBottomWidth: triangleSize / 2,
                borderLeftColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.playTriangle,
              {
                borderLeftWidth: triangleSize,
                borderTopWidth: triangleSize / 2,
                borderBottomWidth: triangleSize / 2,
                borderLeftColor: color,
                marginLeft: -triangleSize * 0.3,
              },
            ]}
          />
        </View>
        <Text style={[styles.seekText, { color, fontSize: size * 0.35 }]}>{seconds}</Text>
      </View>
    </View>
  );
};

// Backward Icon - Two triangles pointing left with number
export const BackwardIcon: React.FC<IconProps & { seconds?: number }> = ({
  size = 24,
  color = '#FFFFFF',
  style,
  seconds = 10,
}) => {
  const triangleSize = size * 0.3;
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View style={styles.seekIconContainer}>
        <View style={[styles.seekTriangles, { transform: [{ scaleX: -1 }] }]}>
          <View
            style={[
              styles.playTriangle,
              {
                borderLeftWidth: triangleSize,
                borderTopWidth: triangleSize / 2,
                borderBottomWidth: triangleSize / 2,
                borderLeftColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.playTriangle,
              {
                borderLeftWidth: triangleSize,
                borderTopWidth: triangleSize / 2,
                borderBottomWidth: triangleSize / 2,
                borderLeftColor: color,
                marginLeft: -triangleSize * 0.3,
              },
            ]}
          />
        </View>
        <Text style={[styles.seekText, { color, fontSize: size * 0.35 }]}>{seconds}</Text>
      </View>
    </View>
  );
};

// Fullscreen Enter Icon - Four corners pointing outward
export const FullscreenEnterIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  const cornerSize = size * 0.35;
  const thickness = size * 0.1;
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      {/* Top Left */}
      <View style={[styles.fullscreenCorner, styles.topLeft, { borderColor: color, borderTopWidth: thickness, borderLeftWidth: thickness, width: cornerSize, height: cornerSize }]} />
      {/* Top Right */}
      <View style={[styles.fullscreenCorner, styles.topRight, { borderColor: color, borderTopWidth: thickness, borderRightWidth: thickness, width: cornerSize, height: cornerSize }]} />
      {/* Bottom Left */}
      <View style={[styles.fullscreenCorner, styles.bottomLeft, { borderColor: color, borderBottomWidth: thickness, borderLeftWidth: thickness, width: cornerSize, height: cornerSize }]} />
      {/* Bottom Right */}
      <View style={[styles.fullscreenCorner, styles.bottomRight, { borderColor: color, borderBottomWidth: thickness, borderRightWidth: thickness, width: cornerSize, height: cornerSize }]} />
    </View>
  );
};

// Fullscreen Exit Icon - Four corners pointing inward
export const FullscreenExitIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  const cornerSize = size * 0.35;
  const thickness = size * 0.1;
  const offset = size * 0.15;
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      {/* Top Left - pointing to corner */}
      <View style={[styles.fullscreenCorner, { top: offset, left: offset, borderColor: color, borderBottomWidth: thickness, borderRightWidth: thickness, width: cornerSize, height: cornerSize }]} />
      {/* Top Right */}
      <View style={[styles.fullscreenCorner, { top: offset, right: offset, borderColor: color, borderBottomWidth: thickness, borderLeftWidth: thickness, width: cornerSize, height: cornerSize }]} />
      {/* Bottom Left */}
      <View style={[styles.fullscreenCorner, { bottom: offset, left: offset, borderColor: color, borderTopWidth: thickness, borderRightWidth: thickness, width: cornerSize, height: cornerSize }]} />
      {/* Bottom Right */}
      <View style={[styles.fullscreenCorner, { bottom: offset, right: offset, borderColor: color, borderTopWidth: thickness, borderLeftWidth: thickness, width: cornerSize, height: cornerSize }]} />
    </View>
  );
};

// Volume High Icon
export const VolumeHighIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View style={styles.volumeContainer}>
        <View style={[styles.volumeSpeaker, { borderLeftColor: color, borderRightWidth: size * 0.15, borderRightColor: color }]}>
          <View style={[styles.volumeBody, { backgroundColor: color, width: size * 0.2, height: size * 0.3 }]} />
        </View>
        <View style={[styles.volumeWave, styles.volumeWave1, { borderColor: color, width: size * 0.2, height: size * 0.3 }]} />
        <View style={[styles.volumeWave, styles.volumeWave2, { borderColor: color, width: size * 0.3, height: size * 0.5 }]} />
      </View>
    </View>
  );
};

// Volume Muted Icon
export const VolumeMutedIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View style={styles.volumeContainer}>
        <View style={[styles.volumeSpeaker, { borderLeftColor: color, borderRightWidth: size * 0.15, borderRightColor: color }]}>
          <View style={[styles.volumeBody, { backgroundColor: color, width: size * 0.2, height: size * 0.3 }]} />
        </View>
        <View style={[styles.muteX, { width: size * 0.4, height: size * 0.08, backgroundColor: color, transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.muteX, { width: size * 0.4, height: size * 0.08, backgroundColor: color, transform: [{ rotate: '-45deg' }] }]} />
      </View>
    </View>
  );
};

// AirPlay Icon
export const AirPlayIcon: React.FC<IconProps & { isActive?: boolean }> = ({
  size = 24,
  color = '#FFFFFF',
  style,
  isActive = false,
}) => {
  const activeColor = isActive ? '#007AFF' : color;
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View style={styles.airplayContainer}>
        {/* Screen/Rectangle */}
        <View
          style={[
            styles.airplayScreen,
            {
              width: size * 0.8,
              height: size * 0.5,
              borderColor: activeColor,
              borderWidth: size * 0.08,
              borderRadius: size * 0.05,
            },
          ]}
        />
        {/* Triangle */}
        <View
          style={[
            styles.airplayTriangle,
            {
              borderLeftWidth: size * 0.25,
              borderRightWidth: size * 0.25,
              borderBottomWidth: size * 0.3,
              borderBottomColor: activeColor,
              marginTop: -size * 0.15,
            },
          ]}
        />
      </View>
    </View>
  );
};

// Back/Chevron Left Icon
export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  const thickness = size * 0.12;
  const chevronSize = size * 0.4;
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View
        style={[
          styles.chevron,
          {
            width: chevronSize,
            height: chevronSize,
            borderLeftWidth: thickness,
            borderBottomWidth: thickness,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
    </View>
  );
};

// Loading/Spinner Icon
export const LoadingIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }, style]}>
      <View
        style={[
          styles.loadingCircle,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderWidth: size * 0.1,
            borderColor: `${color}33`,
            borderTopColor: color,
            borderRadius: size * 0.4,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightWidth: 0,
    borderRightColor: 'transparent',
  },
  pauseContainer: {
    flexDirection: 'row',
  },
  pauseBar: {
    borderRadius: 2,
  },
  seekIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekTriangles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seekText: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  fullscreenCorner: {
    position: 'absolute',
    borderColor: 'transparent',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeSpeaker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeBody: {
    borderRadius: 1,
  },
  volumeWave: {
    position: 'absolute',
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  volumeWave1: {
    right: -8,
  },
  volumeWave2: {
    right: -14,
  },
  muteX: {
    position: 'absolute',
    right: -6,
  },
  airplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  airplayScreen: {
    backgroundColor: 'transparent',
  },
  airplayTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 0,
  },
  chevron: {
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  loadingCircle: {
    borderStyle: 'solid',
  },
});
