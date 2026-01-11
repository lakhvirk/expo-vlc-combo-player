import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from 'react-native';

// Try to import SafeAreaView from react-native-safe-area-context, fallback to View
let SafeAreaView: React.ComponentType<any> = View;
try {
  const safeAreaContext = require('react-native-safe-area-context');
  SafeAreaView = safeAreaContext.SafeAreaView;
} catch {
  // Fallback to View if not available
}
import { PlayPauseButton } from './PlayPauseButton';
import { SeekButton } from './SeekButton';
import { ProgressBar } from './ProgressBar';
import { SpeedSelector, InlineSpeedSelector } from './SpeedSelector';
import { AirPlayButton } from './AirPlayButton';
import { FullscreenButton } from './FullscreenButton';
import { TimeDisplay } from './TimeDisplay';
import { VolumeSlider } from './VolumeControl';
import { ChevronLeftIcon, LoadingIcon } from '../icons';
import type {
  MediaControlsProps,
  ControlsConfig,
  ControlsTheme,
  PlaybackSpeed,
} from '../../ExpoVlcComboPlayer.types';
import {
  DEFAULT_CONTROLS_CONFIG,
  DEFAULT_CONTROLS_THEME,
} from '../../ExpoVlcComboPlayer.types';

export const MediaControls: React.FC<MediaControlsProps> = ({
  playerState,
  controlsConfig: customConfig,
  theme: customTheme,
  styles: customStyles,
  title,
  visible,
  onPlayPause,
  onSeek,
  onSeekForward,
  onSeekBackward,
  onSpeedChange,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onAirPlayPress,
  onBackPress,
  onControlsPress,
}) => {
  const config: ControlsConfig = { ...DEFAULT_CONTROLS_CONFIG, ...customConfig };
  const theme: ControlsTheme = { ...DEFAULT_CONTROLS_THEME, ...customTheme };

  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const topBarAnim = useRef(new Animated.Value(visible ? 0 : -50)).current;
  const bottomBarAnim = useRef(new Animated.Value(visible ? 0 : 50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(topBarAnim, {
        toValue: visible ? 0 : -50,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(bottomBarAnim, {
        toValue: visible ? 0 : 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, fadeAnim, topBarAnim, bottomBarAnim]);

  const isLoading = playerState.status === 'loading' || playerState.status === 'buffering';
  const isDisabled = playerState.status === 'error' || playerState.status === 'idle';

  const handleProgressSeek = useCallback(
    (time: number) => {
      onSeek(time);
    },
    [onSeek]
  );

  if (!visible && !isLoading) {
    return (
      <TouchableWithoutFeedback onPress={onControlsPress}>
        <View style={styles.touchableOverlay} />
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={onControlsPress}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: theme.overlayBackgroundColor, opacity: fadeAnim },
          customStyles?.container,
        ]}
      >
        {/* Top Bar */}
        <Animated.View
          style={[
            styles.topBar,
            { backgroundColor: theme.controlsBackgroundColor, transform: [{ translateY: topBarAnim }] },
            customStyles?.topBar,
          ]}
        >
          <SafeAreaView style={styles.topBarContent}>
            {/* Back Button */}
            {config.showBackButton && onBackPress && (
              <TouchableWithoutFeedback onPress={onBackPress}>
                <View style={styles.backButton}>
                  <ChevronLeftIcon size={theme.iconSize} color={theme.iconColor} />
                </View>
              </TouchableWithoutFeedback>
            )}

            {/* Title */}
            {config.showTitle && title && (
              <Text
                style={[
                  styles.title,
                  { color: theme.textColor, fontSize: theme.fontSize },
                  customStyles?.titleText,
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Top Right Controls */}
            <View style={styles.topRightControls}>
              {config.showAirPlayButton && Platform.OS === 'ios' && (
                <AirPlayButton
                  isConnected={playerState.isAirPlayConnected}
                  onPress={onAirPlayPress}
                  size={theme.iconSize}
                  inactiveColor={theme.iconColor}
                  style={customStyles?.airPlayButton}
                />
              )}
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* Center Controls */}
        <View style={[styles.centerControls, customStyles?.centerControls]}>
          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Animated.View
                style={[
                  styles.loadingSpinner,
                  {
                    transform: [
                      {
                        rotate: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LoadingIcon size={48} color={theme.iconColor} />
              </Animated.View>
            </View>
          )}

          {/* Play/Pause and Seek Controls */}
          {!isLoading && (
            <View style={styles.centerControlsRow}>
              {/* Seek Backward */}
              {config.showSeekButtons && (
                <SeekButton
                  direction="backward"
                  seconds={config.seekInterval || 10}
                  onPress={onSeekBackward}
                  size={40}
                  color={theme.seekButtonColor}
                  style={customStyles?.seekButton}
                  disabled={isDisabled}
                />
              )}

              {/* Play/Pause */}
              {config.showPlayPause && (
                <PlayPauseButton
                  isPlaying={playerState.isPlaying}
                  onPress={onPlayPause}
                  size={64}
                  color={theme.iconColor}
                  style={[styles.playPauseButton, customStyles?.playPauseButton]}
                  disabled={isDisabled}
                />
              )}

              {/* Seek Forward */}
              {config.showSeekButtons && (
                <SeekButton
                  direction="forward"
                  seconds={config.seekInterval || 10}
                  onPress={onSeekForward}
                  size={40}
                  color={theme.seekButtonColor}
                  style={customStyles?.seekButton}
                  disabled={isDisabled}
                />
              )}
            </View>
          )}
        </View>

        {/* Bottom Bar */}
        <Animated.View
          style={[
            styles.bottomBar,
            { backgroundColor: theme.controlsBackgroundColor, transform: [{ translateY: bottomBarAnim }] },
            customStyles?.bottomBar,
          ]}
        >
          <SafeAreaView style={styles.bottomBarContent}>
            {/* Progress Bar */}
            {config.showProgressBar && (
              <ProgressBar
                currentTime={playerState.currentTime}
                duration={playerState.duration}
                bufferedTime={playerState.bufferedTime}
                onSeek={handleProgressSeek}
                progressColor={theme.progressBarColor}
                bufferColor={theme.progressBarBufferColor}
                backgroundColor={theme.progressBarBackgroundColor}
                thumbColor={theme.primaryColor}
                style={[styles.progressBar, customStyles?.progressBarContainer]}
                disabled={isDisabled}
              />
            )}

            {/* Bottom Controls Row */}
            <View style={styles.bottomControlsRow}>
              {/* Time Display */}
              {config.showTimeDisplay && (
                <TimeDisplay
                  currentTime={playerState.currentTime}
                  duration={playerState.duration}
                  textColor={theme.textColor}
                  fontSize={theme.fontSize}
                  style={customStyles?.timeText}
                />
              )}

              {/* Spacer */}
              <View style={styles.spacer} />

              {/* Speed Selector */}
              {config.showSpeedSelector && (
                <InlineSpeedSelector
                  currentSpeed={playerState.playbackSpeed}
                  onSpeedChange={onSpeedChange}
                  speeds={[0.5, 1, 1.5, 2] as PlaybackSpeed[]}
                  activeColor={theme.activeSpeedColor}
                  inactiveColor={theme.speedButtonColor}
                  style={customStyles?.speedButton}
                  textStyle={customStyles?.speedButtonText}
                  disabled={isDisabled}
                />
              )}

              {/* Volume Control (non-iOS) */}
              {config.showVolumeControl && Platform.OS !== 'ios' && (
                <VolumeSlider
                  volume={playerState.volume}
                  isMuted={playerState.isMuted}
                  onVolumeChange={onVolumeChange}
                  onMuteToggle={onMuteToggle}
                  iconSize={20}
                  iconColor={theme.iconColor}
                  sliderColor={theme.progressBarColor}
                  sliderBackgroundColor={theme.progressBarBackgroundColor}
                  style={customStyles?.volumeSlider}
                  disabled={isDisabled}
                  width={60}
                />
              )}

              {/* Fullscreen Button */}
              {config.showFullscreenButton && (
                <FullscreenButton
                  isFullscreen={playerState.isFullscreen}
                  onPress={onFullscreenToggle}
                  size={theme.iconSize}
                  color={theme.iconColor}
                  style={customStyles?.fullscreenButton}
                  disabled={isDisabled}
                />
              )}
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    marginHorizontal: 32,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {},
  bottomBar: {
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
  },
  bottomBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  progressBar: {
    marginBottom: 8,
  },
  bottomControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
});

export default MediaControls;
