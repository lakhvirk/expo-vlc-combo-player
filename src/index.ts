// Main Component Exports
export { VLCComboPlayer, VLCComboPlayer as default } from './components/VLCComboPlayer';
export { FullscreenContainer } from './components/FullscreenContainer';

// Control Components
export {
  PlayPauseButton,
  SeekButton,
  ProgressBar,
  SpeedSelector,
  InlineSpeedSelector,
  AirPlayButton,
  FullscreenButton,
  TimeDisplay,
  TimeDisplaySeparate,
  RemainingTimeDisplay,
  VolumeControl,
  VolumeSlider,
  MediaControls,
} from './components/controls';

// Icon Components
export {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  VolumeHighIcon,
  VolumeMutedIcon,
  AirPlayIcon,
  ChevronLeftIcon,
  LoadingIcon,
} from './components/icons';

// Hooks
export {
  usePlayerState,
  useControlsVisibility,
  useFullscreen,
  useDoubleTap,
} from './hooks';

// Types
export * from './ExpoVlcComboPlayer.types';

// Utils
export { formatTime, parseTime, calculateProgress, formatSpeed } from './utils';
