import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { MediaControls } from './controls';
import { FullscreenContainer } from './FullscreenContainer';
import { usePlayerState, useControlsVisibility, useDoubleTap } from '../hooks';
import type {
  ExpoVlcComboPlayerViewProps,
  ExpoVlcComboPlayerRef,
  PlayerState,
  PlaybackSpeed,
  ControlsConfig,
  ControlsTheme,
  AudioTrack,
  TextTrack,
} from '../ExpoVlcComboPlayer.types';
import {
  DEFAULT_CONTROLS_CONFIG,
  DEFAULT_CONTROLS_THEME,
  VLC_ONLY_CODECS,
} from '../ExpoVlcComboPlayer.types';

// Lazy import expo-video (it might not be installed)
let useVideoPlayer: typeof import('expo-video').useVideoPlayer | null = null;
let VideoView: typeof import('expo-video').VideoView | null = null;

try {
  const expoVideo = require('expo-video');
  useVideoPlayer = expoVideo.useVideoPlayer;
  VideoView = expoVideo.VideoView;
} catch {
  // expo-video not available
}

// Lazy import VLC player (it might not be installed)
let VLCPlayer: any = null;
try {
  VLCPlayer = require('react-native-vlc-media-player').VLCPlayer;
} catch {
  // VLC player not available
}

type VideoPlayerRef = {
  play: () => void;
  pause: () => void;
  seekBy: (seconds: number) => void;
  replay: () => void;
  currentTime: number;
  duration: number;
  muted: boolean;
  volume: number;
  playbackRate: number;
};

export const VLCComboPlayer = forwardRef<
  ExpoVlcComboPlayerRef,
  ExpoVlcComboPlayerViewProps
>((props, ref) => {
  const {
    source,
    autoPlay = false,
    loop = false,
    muted = false,
    volume = 1,
    playbackSpeed = 1,
    paused = false,
    preferredBackend = 'expo-video',
    forceVlcForCodecs = VLC_ONLY_CODECS,
    resizeMode = 'contain',
    posterSource,
    showPoster = true,
    controls = true,
    controlsConfig: customControlsConfig,
    controlsTheme: customControlsTheme,
    controlsStyles,
    customControls,
    fullscreen: fullscreenProp = false,
    fullscreenOrientation = 'landscape',
    fullscreenAutoRotate = true,
    onLoad,
    onProgress,
    onPlaybackStateChange,
    onSeek,
    onBuffer,
    onError,
    onEnd,
    onFullscreenChange,
    onAirPlayChange,
    onPlaybackSpeedChange,
    onControlsVisibilityChange,
    onBackPress,
    style,
    videoStyle,
    testID,
  } = props;

  // Merge configs with defaults
  const controlsConfig: ControlsConfig = {
    ...DEFAULT_CONTROLS_CONFIG,
    ...customControlsConfig,
  };
  const controlsTheme: ControlsTheme = {
    ...DEFAULT_CONTROLS_THEME,
    ...customControlsTheme,
  };

  // Determine which backend to use
  const [activeBackend, setActiveBackend] = useState<'expo-video' | 'vlc'>(() => {
    // Check if VLC should be used based on codec
    if (source.type && forceVlcForCodecs.includes(source.type as any)) {
      return 'vlc';
    }
    // Check file extension
    const uri = source.uri.toLowerCase();
    if (
      uri.includes('.mkv') ||
      uri.includes('.avi') ||
      uri.includes('.wmv') ||
      uri.includes('.flv')
    ) {
      return 'vlc';
    }
    return preferredBackend;
  });

  // Player state management
  const {
    state: playerState,
    updateState,
    setStatus,
    setCurrentTime,
    setDuration,
    setBufferedTime,
    setIsPlaying,
    togglePlayPause,
    setVolume: setPlayerVolume,
    setIsMuted,
    toggleMute,
    setPlaybackSpeed: setPlayerSpeed,
    setIsFullscreen,
    toggleFullscreen,
    setIsAirPlayConnected,
    setError,
    reset,
    updateProgress,
  } = usePlayerState({
    initialState: {
      volume,
      isMuted: muted,
      playbackSpeed,
      isFullscreen: fullscreenProp,
      backend: activeBackend,
    },
  });

  // Controls visibility
  const {
    isVisible: controlsVisible,
    show: showControls,
    hide: hideControls,
    toggle: toggleControls,
    keepVisible,
    resumeAutoHide,
  } = useControlsVisibility({
    autoHide: controlsConfig.autoHide,
    autoHideDelay: controlsConfig.autoHideDelay,
  });

  // Container dimensions
  const [containerWidth, setContainerWidth] = useState(0);

  // Double tap handling
  const { handleTap, setContainerWidth: setDoubleTapWidth } = useDoubleTap({
    onSingleTap: toggleControls,
    onDoubleTapLeft: controlsConfig.doubleTapToSeek
      ? () => handleSeekBackward()
      : undefined,
    onDoubleTapRight: controlsConfig.doubleTapToSeek
      ? () => handleSeekForward()
      : undefined,
    doubleTapDelay: 300,
  });

  // Refs
  const vlcPlayerRef = useRef<any>(null);
  const expoVideoRef = useRef<any>(null);
  const audioTracksRef = useRef<AudioTrack[]>([]);
  const textTracksRef = useRef<TextTrack[]>([]);

  // Poster visibility
  const [showPosterImage, setShowPosterImage] = useState(showPoster && !!posterSource);
  const posterOpacity = useRef(new Animated.Value(1)).current;

  // Layout handler
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setContainerWidth(width);
      setDoubleTapWidth(width);
    },
    [setDoubleTapWidth]
  );

  // Hide poster when video starts playing
  useEffect(() => {
    if (playerState.isPlaying && showPosterImage) {
      Animated.timing(posterOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowPosterImage(false);
      });
    }
  }, [playerState.isPlaying, showPosterImage, posterOpacity]);

  // Notify controls visibility change
  useEffect(() => {
    onControlsVisibilityChange?.(controlsVisible);
  }, [controlsVisible, onControlsVisibilityChange]);

  // Notify fullscreen change
  useEffect(() => {
    onFullscreenChange?.({ isFullscreen: playerState.isFullscreen });
  }, [playerState.isFullscreen, onFullscreenChange]);

  // Seek handlers
  const handleSeek = useCallback(
    (time: number) => {
      setCurrentTime(time);
      onSeek?.({ currentTime: playerState.currentTime, seekTime: time });

      if (activeBackend === 'vlc' && vlcPlayerRef.current) {
        vlcPlayerRef.current.seek(time);
      } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
        expoVideoRef.current.currentTime = time;
      }
    },
    [activeBackend, playerState.currentTime, setCurrentTime, onSeek]
  );

  const handleSeekForward = useCallback(() => {
    const seekTime = Math.min(
      playerState.currentTime + (controlsConfig.seekInterval || 10),
      playerState.duration
    );
    handleSeek(seekTime);
  }, [
    playerState.currentTime,
    playerState.duration,
    controlsConfig.seekInterval,
    handleSeek,
  ]);

  const handleSeekBackward = useCallback(() => {
    const seekTime = Math.max(
      playerState.currentTime - (controlsConfig.seekInterval || 10),
      0
    );
    handleSeek(seekTime);
  }, [playerState.currentTime, controlsConfig.seekInterval, handleSeek]);

  // Playback speed handler
  const handleSpeedChange = useCallback(
    (speed: PlaybackSpeed) => {
      setPlayerSpeed(speed);
      onPlaybackSpeedChange?.({ speed });

      if (activeBackend === 'vlc' && vlcPlayerRef.current) {
        vlcPlayerRef.current.setRate(speed);
      } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
        expoVideoRef.current.playbackRate = speed;
      }
    },
    [activeBackend, setPlayerSpeed, onPlaybackSpeedChange]
  );

  // Volume handler
  const handleVolumeChange = useCallback(
    (vol: number) => {
      setPlayerVolume(vol);

      if (activeBackend === 'vlc' && vlcPlayerRef.current) {
        vlcPlayerRef.current.setVolume(vol * 200); // VLC uses 0-200 range
      } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
        expoVideoRef.current.volume = vol;
      }
    },
    [activeBackend, setPlayerVolume]
  );

  // Mute handler
  const handleMuteToggle = useCallback(() => {
    const newMuted = !playerState.isMuted;
    setIsMuted(newMuted);

    if (activeBackend === 'vlc' && vlcPlayerRef.current) {
      vlcPlayerRef.current.setVolume(newMuted ? 0 : playerState.volume * 200);
    } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
      expoVideoRef.current.muted = newMuted;
    }
  }, [activeBackend, playerState.isMuted, playerState.volume, setIsMuted]);

  // Play/Pause handler
  const handlePlayPause = useCallback(() => {
    const newIsPlaying = !playerState.isPlaying;

    if (activeBackend === 'vlc' && vlcPlayerRef.current) {
      if (newIsPlaying) {
        vlcPlayerRef.current.play();
      } else {
        vlcPlayerRef.current.pause();
      }
    } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
      if (newIsPlaying) {
        expoVideoRef.current.play();
      } else {
        expoVideoRef.current.pause();
      }
    }

    setIsPlaying(newIsPlaying);
    onPlaybackStateChange?.({
      status: newIsPlaying ? 'playing' : 'paused',
      isPlaying: newIsPlaying,
    });
  }, [activeBackend, playerState.isPlaying, setIsPlaying, onPlaybackStateChange]);

  // Fullscreen handler
  const handleFullscreenToggle = useCallback(() => {
    toggleFullscreen();
  }, [toggleFullscreen]);

  // AirPlay handler (iOS only)
  const handleAirPlayPress = useCallback(() => {
    // This would typically trigger the native AirPlay picker
    // For now, we'll just show that it was pressed
    if (Platform.OS === 'ios') {
      // Trigger native AirPlay route picker
      // This requires native module integration
    }
  }, []);

  // Expo Video event handlers
  const handleExpoVideoLoad = useCallback(
    (status: any) => {
      setDuration(status.durationMillis / 1000);
      setStatus('ready');
      onLoad?.({
        duration: status.durationMillis / 1000,
        naturalSize: {
          width: status.videoWidth || 0,
          height: status.videoHeight || 0,
        },
      });
    },
    [setDuration, setStatus, onLoad]
  );

  const handleExpoVideoProgress = useCallback(
    (status: any) => {
      if (status.isLoaded) {
        updateProgress({
          currentTime: status.positionMillis / 1000,
          duration: status.durationMillis / 1000,
          bufferedTime: status.playableDurationMillis / 1000,
        });
        onProgress?.({
          currentTime: status.positionMillis / 1000,
          duration: status.durationMillis / 1000,
          bufferedTime: status.playableDurationMillis / 1000,
          playableDuration: status.playableDurationMillis / 1000,
        });
      }
    },
    [updateProgress, onProgress]
  );

  // VLC Player event handlers
  const handleVlcProgress = useCallback(
    (event: any) => {
      const { currentTime: vlcCurrentTime, duration: vlcDuration } = event;
      updateProgress({
        currentTime: vlcCurrentTime / 1000,
        duration: vlcDuration / 1000,
      });
      onProgress?.({
        currentTime: vlcCurrentTime / 1000,
        duration: vlcDuration / 1000,
        bufferedTime: 0,
        playableDuration: vlcDuration / 1000,
      });
    },
    [updateProgress, onProgress]
  );

  const handleVlcLoad = useCallback(
    (event: any) => {
      const { duration: vlcDuration, videoSize } = event;
      setDuration(vlcDuration / 1000);
      setStatus('ready');
      onLoad?.({
        duration: vlcDuration / 1000,
        naturalSize: {
          width: videoSize?.width || 0,
          height: videoSize?.height || 0,
        },
      });
    },
    [setDuration, setStatus, onLoad]
  );

  const handleVlcEnd = useCallback(() => {
    setStatus('ended');
    onEnd?.();
    if (loop) {
      handleSeek(0);
      setIsPlaying(true);
    }
  }, [setStatus, onEnd, loop, handleSeek, setIsPlaying]);

  const handleVlcError = useCallback(
    (error: any) => {
      setError({
        code: 'VLC_ERROR',
        message: error.message || 'VLC playback error',
        details: error,
      });
      onError?.({
        error: {
          code: 'VLC_ERROR',
          message: error.message || 'VLC playback error',
          details: error,
        },
      });
    },
    [setError, onError]
  );

  const handleVlcBuffering = useCallback(
    (event: any) => {
      const isBuffering = event.isBuffering;
      setStatus(isBuffering ? 'buffering' : playerState.isPlaying ? 'playing' : 'paused');
      onBuffer?.({ isBuffering, bufferedTime: 0 });
    },
    [setStatus, playerState.isPlaying, onBuffer]
  );

  // Expose ref methods
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        setIsPlaying(true);
        if (activeBackend === 'vlc' && vlcPlayerRef.current) {
          vlcPlayerRef.current.play();
        } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
          expoVideoRef.current.play();
        }
      },
      pause: () => {
        setIsPlaying(false);
        if (activeBackend === 'vlc' && vlcPlayerRef.current) {
          vlcPlayerRef.current.pause();
        } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
          expoVideoRef.current.pause();
        }
      },
      stop: () => {
        setIsPlaying(false);
        handleSeek(0);
        if (activeBackend === 'vlc' && vlcPlayerRef.current) {
          vlcPlayerRef.current.stop();
        } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
          expoVideoRef.current.pause();
          expoVideoRef.current.currentTime = 0;
        }
      },
      seek: handleSeek,
      seekForward: handleSeekForward,
      seekBackward: handleSeekBackward,
      setVolume: handleVolumeChange,
      setMuted: (muted: boolean) => {
        setIsMuted(muted);
        if (activeBackend === 'vlc' && vlcPlayerRef.current) {
          vlcPlayerRef.current.setVolume(muted ? 0 : playerState.volume * 200);
        } else if (activeBackend === 'expo-video' && expoVideoRef.current) {
          expoVideoRef.current.muted = muted;
        }
      },
      setPlaybackSpeed: handleSpeedChange,
      enterFullscreen: () => setIsFullscreen(true),
      exitFullscreen: () => setIsFullscreen(false),
      toggleFullscreen: handleFullscreenToggle,
      togglePlayPause: handlePlayPause,
      showControls,
      hideControls,
      getCurrentState: () => playerState,
      getAvailableAudioTracks: () => audioTracksRef.current,
      getAvailableTextTracks: () => textTracksRef.current,
      setAudioTrack: (index: number) => {
        if (activeBackend === 'vlc' && vlcPlayerRef.current) {
          vlcPlayerRef.current.setAudioTrack(index);
        }
      },
      setTextTrack: (index: number) => {
        if (activeBackend === 'vlc' && vlcPlayerRef.current) {
          vlcPlayerRef.current.setTextTrack(index);
        }
      },
    }),
    [
      activeBackend,
      playerState,
      handleSeek,
      handleSeekForward,
      handleSeekBackward,
      handleVolumeChange,
      handleSpeedChange,
      handleFullscreenToggle,
      handlePlayPause,
      showControls,
      hideControls,
      setIsPlaying,
      setIsMuted,
      setIsFullscreen,
    ]
  );

  // Render video player based on active backend
  const renderVideoPlayer = () => {
    if (activeBackend === 'vlc' && VLCPlayer) {
      return (
        <VLCPlayer
          ref={vlcPlayerRef}
          source={{ uri: source.uri, ...source.headers }}
          style={[styles.video, videoStyle]}
          resizeMode={resizeMode}
          paused={!playerState.isPlaying}
          volume={playerState.isMuted ? 0 : playerState.volume * 200}
          rate={playerState.playbackSpeed}
          onProgress={handleVlcProgress}
          onLoad={handleVlcLoad}
          onEnd={handleVlcEnd}
          onError={handleVlcError}
          onBuffering={handleVlcBuffering}
          autoplay={autoPlay}
        />
      );
    }

    if (activeBackend === 'expo-video' && VideoView && useVideoPlayer) {
      // Using expo-video's VideoView
      return (
        <View style={[styles.video, videoStyle]}>
          {/* expo-video implementation would go here */}
          {/* For now, showing a placeholder since expo-video has different API */}
          <View style={styles.placeholder}>
            {/* Video will be rendered by expo-video */}
          </View>
        </View>
      );
    }

    // Fallback - no video player available
    return (
      <View style={[styles.video, styles.placeholder, videoStyle]}>
        {posterSource && (
          <Image
            source={{ uri: posterSource }}
            style={styles.posterFallback}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  const content = (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
      testID={testID}
    >
      {/* Video Player */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.videoContainer}>
          {renderVideoPlayer()}

          {/* Poster Image */}
          {showPosterImage && posterSource && (
            <Animated.Image
              source={{ uri: posterSource }}
              style={[styles.poster, { opacity: posterOpacity }]}
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Custom Controls or Default Media Controls */}
      {controls && !customControls && (
        <MediaControls
          playerState={playerState}
          controlsConfig={controlsConfig}
          theme={controlsTheme}
          styles={controlsStyles}
          title={source.title}
          visible={controlsVisible}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onSeekForward={handleSeekForward}
          onSeekBackward={handleSeekBackward}
          onSpeedChange={handleSpeedChange}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
          onFullscreenToggle={handleFullscreenToggle}
          onAirPlayPress={handleAirPlayPress}
          onBackPress={onBackPress}
          onControlsPress={toggleControls}
        />
      )}

      {/* Custom Controls */}
      {controls && customControls}
    </View>
  );

  // Wrap in fullscreen container if fullscreen is requested
  if (playerState.isFullscreen) {
    return (
      <FullscreenContainer
        isFullscreen={playerState.isFullscreen}
        onFullscreenChange={(isFs) => setIsFullscreen(isFs)}
        orientation={fullscreenOrientation}
        backgroundColor="#000000"
      >
        {content}
      </FullscreenContainer>
    );
  }

  return content;
});

VLCComboPlayer.displayName = 'VLCComboPlayer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  poster: {
    ...StyleSheet.absoluteFillObject,
  },
  posterFallback: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

export default VLCComboPlayer;
