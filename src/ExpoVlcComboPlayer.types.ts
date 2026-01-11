import type { StyleProp, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';

// ============================================
// Video Source Types
// ============================================

export type VideoSource = {
  uri: string;
  headers?: Record<string, string>;
  type?: 'mp4' | 'hls' | 'm3u8' | 'mkv' | 'avi' | 'mov' | 'webm' | 'flv' | 'wmv' | 'rtsp' | 'rtmp';
  title?: string;
  subtitle?: SubtitleSource;
};

export type SubtitleSource = {
  uri: string;
  language?: string;
  title?: string;
};

// ============================================
// Player State Types
// ============================================

export type PlayerStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'ended'
  | 'error';

export type PlayerBackend = 'expo-video' | 'vlc';

export type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

export type PlayerState = {
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackSpeed: PlaybackSpeed;
  isFullscreen: boolean;
  isAirPlayConnected: boolean;
  backend: PlayerBackend;
  error?: PlayerError;
};

export type PlayerError = {
  code: string;
  message: string;
  details?: unknown;
};

// ============================================
// Event Payload Types
// ============================================

export type OnLoadEventPayload = {
  duration: number;
  naturalSize: {
    width: number;
    height: number;
  };
  audioTracks?: AudioTrack[];
  textTracks?: TextTrack[];
};

export type OnProgressEventPayload = {
  currentTime: number;
  duration: number;
  bufferedTime: number;
  playableDuration: number;
};

export type OnPlaybackStateChangeEventPayload = {
  status: PlayerStatus;
  isPlaying: boolean;
};

export type OnSeekEventPayload = {
  currentTime: number;
  seekTime: number;
};

export type OnBufferEventPayload = {
  isBuffering: boolean;
  bufferedTime: number;
};

export type OnErrorEventPayload = {
  error: PlayerError;
};

export type OnFullscreenChangeEventPayload = {
  isFullscreen: boolean;
};

export type OnAirPlayChangeEventPayload = {
  isConnected: boolean;
  deviceName?: string;
};

export type OnPlaybackSpeedChangeEventPayload = {
  speed: PlaybackSpeed;
};

export type AudioTrack = {
  index: number;
  title: string;
  language?: string;
  type?: string;
};

export type TextTrack = {
  index: number;
  title: string;
  language?: string;
  type?: string;
};

// ============================================
// Control Configuration Types
// ============================================

export type ControlsConfig = {
  showPlayPause?: boolean;
  showSeekButtons?: boolean;
  seekInterval?: number;
  showProgressBar?: boolean;
  showTimeDisplay?: boolean;
  showSpeedSelector?: boolean;
  showVolumeControl?: boolean;
  showAirPlayButton?: boolean;
  showFullscreenButton?: boolean;
  showMuteButton?: boolean;
  showSubtitleButton?: boolean;
  showAudioTrackButton?: boolean;
  showBackButton?: boolean;
  showTitle?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  doubleTapToSeek?: boolean;
  doubleTapSeekInterval?: number;
  enableSwipeGestures?: boolean;
  swipeHorizontalSensitivity?: number;
  swipeVerticalSensitivity?: number;
};

export const DEFAULT_CONTROLS_CONFIG: ControlsConfig = {
  showPlayPause: true,
  showSeekButtons: true,
  seekInterval: 10,
  showProgressBar: true,
  showTimeDisplay: true,
  showSpeedSelector: true,
  showVolumeControl: true,
  showAirPlayButton: true,
  showFullscreenButton: true,
  showMuteButton: true,
  showSubtitleButton: false,
  showAudioTrackButton: false,
  showBackButton: false,
  showTitle: true,
  autoHide: true,
  autoHideDelay: 3000,
  doubleTapToSeek: true,
  doubleTapSeekInterval: 10,
  enableSwipeGestures: true,
  swipeHorizontalSensitivity: 1,
  swipeVerticalSensitivity: 1,
};

// ============================================
// Style Configuration Types
// ============================================

export type ControlsTheme = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  progressBarColor?: string;
  progressBarBackgroundColor?: string;
  progressBarBufferColor?: string;
  seekButtonColor?: string;
  speedButtonColor?: string;
  activeSpeedColor?: string;
  overlayBackgroundColor?: string;
  controlsBackgroundColor?: string;
  iconSize?: number;
  fontSize?: number;
  borderRadius?: number;
};

export const DEFAULT_CONTROLS_THEME: ControlsTheme = {
  primaryColor: '#FFFFFF',
  secondaryColor: '#AAAAAA',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  textColor: '#FFFFFF',
  iconColor: '#FFFFFF',
  progressBarColor: '#FF0000',
  progressBarBackgroundColor: 'rgba(255, 255, 255, 0.3)',
  progressBarBufferColor: 'rgba(255, 255, 255, 0.5)',
  seekButtonColor: '#FFFFFF',
  speedButtonColor: '#FFFFFF',
  activeSpeedColor: '#FF0000',
  overlayBackgroundColor: 'rgba(0, 0, 0, 0.4)',
  controlsBackgroundColor: 'rgba(0, 0, 0, 0.7)',
  iconSize: 28,
  fontSize: 14,
  borderRadius: 4,
};

export type ControlsStyles = {
  container?: StyleProp<ViewStyle>;
  topBar?: StyleProp<ViewStyle>;
  bottomBar?: StyleProp<ViewStyle>;
  centerControls?: StyleProp<ViewStyle>;
  playPauseButton?: StyleProp<ViewStyle>;
  seekButton?: StyleProp<ViewStyle>;
  progressBarContainer?: StyleProp<ViewStyle>;
  progressBar?: StyleProp<ViewStyle>;
  timeText?: StyleProp<TextStyle>;
  speedButton?: StyleProp<ViewStyle>;
  speedButtonText?: StyleProp<TextStyle>;
  fullscreenButton?: StyleProp<ViewStyle>;
  airPlayButton?: StyleProp<ViewStyle>;
  volumeSlider?: StyleProp<ViewStyle>;
  titleText?: StyleProp<TextStyle>;
  icon?: StyleProp<ImageStyle>;
};

// ============================================
// Main Component Props
// ============================================

export type ExpoVlcComboPlayerViewProps = {
  // Source
  source: VideoSource;

  // Playback
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackSpeed?: PlaybackSpeed;
  paused?: boolean;

  // Backend selection
  preferredBackend?: PlayerBackend;
  forceVlcForCodecs?: string[];

  // Display
  resizeMode?: 'contain' | 'cover' | 'stretch';
  posterSource?: string;
  showPoster?: boolean;

  // Controls
  controls?: boolean;
  controlsConfig?: ControlsConfig;
  controlsTheme?: ControlsTheme;
  controlsStyles?: ControlsStyles;
  customControls?: ReactNode;

  // Fullscreen
  fullscreen?: boolean;
  fullscreenOrientation?: 'landscape' | 'portrait' | 'all';
  fullscreenAutoRotate?: boolean;

  // Events
  onLoad?: (event: OnLoadEventPayload) => void;
  onProgress?: (event: OnProgressEventPayload) => void;
  onPlaybackStateChange?: (event: OnPlaybackStateChangeEventPayload) => void;
  onSeek?: (event: OnSeekEventPayload) => void;
  onBuffer?: (event: OnBufferEventPayload) => void;
  onError?: (event: OnErrorEventPayload) => void;
  onEnd?: () => void;
  onFullscreenChange?: (event: OnFullscreenChangeEventPayload) => void;
  onAirPlayChange?: (event: OnAirPlayChangeEventPayload) => void;
  onPlaybackSpeedChange?: (event: OnPlaybackSpeedChangeEventPayload) => void;
  onControlsVisibilityChange?: (visible: boolean) => void;
  onBackPress?: () => void;

  // Styles
  style?: StyleProp<ViewStyle>;
  videoStyle?: StyleProp<ViewStyle>;

  // Misc
  testID?: string;
};

// ============================================
// Player Ref Types
// ============================================

export type ExpoVlcComboPlayerRef = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  seekForward: (seconds?: number) => void;
  seekBackward: (seconds?: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
  togglePlayPause: () => void;
  showControls: () => void;
  hideControls: () => void;
  getCurrentState: () => PlayerState;
  getAvailableAudioTracks: () => AudioTrack[];
  getAvailableTextTracks: () => TextTrack[];
  setAudioTrack: (index: number) => void;
  setTextTrack: (index: number) => void;
};

// ============================================
// Control Component Props
// ============================================

export type PlayPauseButtonProps = {
  isPlaying: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export type SeekButtonProps = {
  direction: 'forward' | 'backward';
  seconds: number;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export type ProgressBarProps = {
  currentTime: number;
  duration: number;
  bufferedTime: number;
  onSeek: (time: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  progressColor?: string;
  bufferColor?: string;
  backgroundColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export type SpeedSelectorProps = {
  currentSpeed: PlaybackSpeed;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  speeds?: PlaybackSpeed[];
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export type AirPlayButtonProps = {
  isConnected: boolean;
  onPress: () => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export type FullscreenButtonProps = {
  isFullscreen: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export type VolumeControlProps = {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  iconSize?: number;
  iconColor?: string;
  sliderColor?: string;
  sliderBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export type TimeDisplayProps = {
  currentTime: number;
  duration: number;
  textColor?: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  separator?: string;
};

export type MediaControlsProps = {
  playerState: PlayerState;
  controlsConfig: ControlsConfig;
  theme: ControlsTheme;
  styles?: ControlsStyles;
  title?: string;
  visible: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onAirPlayPress: () => void;
  onBackPress?: () => void;
  onControlsPress: () => void;
};

// ============================================
// Hook Types
// ============================================

export type UsePlayerStateOptions = {
  initialState?: Partial<PlayerState>;
  onStateChange?: (state: PlayerState) => void;
};

export type UsePlayerControlsOptions = {
  seekInterval?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
};

export type UseFullscreenOptions = {
  orientation?: 'landscape' | 'portrait' | 'all';
  autoRotate?: boolean;
  animationDuration?: number;
  onEnter?: () => void;
  onExit?: () => void;
};

// ============================================
// Module Events (for native module)
// ============================================

export type ExpoVlcComboPlayerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onPlayerStateChange: (params: OnPlaybackStateChangeEventPayload) => void;
  onPlayerProgress: (params: OnProgressEventPayload) => void;
  onPlayerError: (params: OnErrorEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type VideoCodec =
  | 'h264'
  | 'h265'
  | 'hevc'
  | 'vp8'
  | 'vp9'
  | 'av1'
  | 'mpeg4'
  | 'mpeg2'
  | 'wmv'
  | 'divx'
  | 'xvid'
  | 'theora';

export const VLC_ONLY_CODECS: VideoCodec[] = ['hevc', 'h265', 'wmv', 'divx', 'xvid', 'mpeg2'];
