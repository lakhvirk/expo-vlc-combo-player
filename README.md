# expo-vlc-combo-player

A comprehensive video player library for Expo/React Native that combines **expo-video** with **VLC player** backend for enhanced codec support. Features custom native-like media controls with seeking, speed control, AirPlay, and fullscreen animations.

## Features

- **Dual Backend Support** - Uses expo-video by default, automatically falls back to VLC for unsupported codecs (MKV, AVI, WMV, etc.)
- **Custom Native-like Controls** - Beautiful controls that match native video player UI
- **+10/-10 Seeking** - Quick seek buttons with configurable intervals and animations
- **Progress Bar** - Draggable progress bar with buffering indicator
- **Speed Controls** - 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x playback speeds
- **AirPlay Support** - Stream to AirPlay devices on iOS
- **Fullscreen Animation** - Smooth scale/translate transition to fullscreen mode
- **Auto-hide Controls** - Controls automatically hide after configurable delay
- **Double-tap to Seek** - Double-tap left/right screen zones to seek backward/forward
- **Gesture Support** - Swipe gestures for volume and brightness (configurable)
- **Fully Customizable** - Theme colors, control visibility, and custom control components

## Installation

```bash
npx expo install expo-vlc-combo-player
```

### Peer Dependencies

The library has optional peer dependencies based on which backend you want to use:

```bash
# For expo-video backend (recommended for most formats)
npx expo install expo-video

# For VLC backend (for advanced codecs like MKV, AVI, WMV)
npm install react-native-vlc-media-player

# For screen orientation control in fullscreen
npx expo install expo-screen-orientation
```

## Quick Start

```tsx
import { VLCComboPlayer } from 'expo-vlc-combo-player';

export default function App() {
  return (
    <VLCComboPlayer
      source={{
        uri: 'https://example.com/video.mp4',
        title: 'My Video',
      }}
      style={{ width: '100%', aspectRatio: 16 / 9 }}
      controls={true}
      autoPlay={false}
    />
  );
}
```

## Usage

### Basic Usage with Controls

```tsx
import { VLCComboPlayer, type ExpoVlcComboPlayerRef } from 'expo-vlc-combo-player';
import { useRef } from 'react';

export default function VideoScreen() {
  const playerRef = useRef<ExpoVlcComboPlayerRef>(null);

  return (
    <VLCComboPlayer
      ref={playerRef}
      source={{
        uri: 'https://example.com/video.mp4',
        title: 'Big Buck Bunny',
        type: 'mp4',
      }}
      style={{ width: '100%', aspectRatio: 16 / 9 }}
      controls={true}
      autoPlay={false}
      loop={false}
      onLoad={(event) => console.log('Duration:', event.duration)}
      onProgress={(event) => console.log('Time:', event.currentTime)}
      onEnd={() => console.log('Video ended')}
    />
  );
}
```

### Customizing Controls

```tsx
<VLCComboPlayer
  source={{ uri: 'https://example.com/video.mp4' }}
  controls={true}
  controlsConfig={{
    showPlayPause: true,
    showSeekButtons: true,
    seekInterval: 10,           // Seek 10 seconds
    showProgressBar: true,
    showTimeDisplay: true,
    showSpeedSelector: true,
    showFullscreenButton: true,
    showAirPlayButton: true,    // iOS only
    showTitle: true,
    autoHide: true,
    autoHideDelay: 3000,        // Hide after 3 seconds
    doubleTapToSeek: true,
    doubleTapSeekInterval: 10,
  }}
  controlsTheme={{
    primaryColor: '#FFFFFF',
    progressBarColor: '#E50914',      // Netflix red
    activeSpeedColor: '#E50914',
    iconSize: 28,
    fontSize: 14,
  }}
/>
```

### Programmatic Control

```tsx
import { useRef } from 'react';
import { Button, View } from 'react-native';
import { VLCComboPlayer, type ExpoVlcComboPlayerRef } from 'expo-vlc-combo-player';

export default function VideoScreen() {
  const playerRef = useRef<ExpoVlcComboPlayerRef>(null);

  return (
    <View>
      <VLCComboPlayer
        ref={playerRef}
        source={{ uri: 'https://example.com/video.mp4' }}
        controls={false}  // Using custom controls
      />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="-10s" onPress={() => playerRef.current?.seekBackward(10)} />
        <Button title="Play/Pause" onPress={() => playerRef.current?.togglePlayPause()} />
        <Button title="+10s" onPress={() => playerRef.current?.seekForward(10)} />
        <Button title="2x Speed" onPress={() => playerRef.current?.setPlaybackSpeed(2)} />
        <Button title="Fullscreen" onPress={() => playerRef.current?.toggleFullscreen()} />
      </View>
    </View>
  );
}
```

### Using Individual Components

All control components are exported and can be used standalone:

```tsx
import {
  PlayPauseButton,
  SeekButton,
  ProgressBar,
  InlineSpeedSelector,
  TimeDisplay,
  FullscreenButton,
  AirPlayButton,
} from 'expo-vlc-combo-player';

// Use in your custom controls layout
<PlayPauseButton
  isPlaying={isPlaying}
  onPress={() => togglePlayPause()}
  size={48}
  color="#FFFFFF"
/>

<SeekButton
  direction="forward"
  seconds={10}
  onPress={() => seekForward(10)}
  size={40}
  color="#FFFFFF"
/>

<ProgressBar
  currentTime={currentTime}
  duration={duration}
  bufferedTime={bufferedTime}
  onSeek={(time) => seek(time)}
  progressColor="#E50914"
  height={4}
/>

<InlineSpeedSelector
  currentSpeed={playbackSpeed}
  onSpeedChange={(speed) => setSpeed(speed)}
  activeColor="#E50914"
/>

<TimeDisplay
  currentTime={currentTime}
  duration={duration}
  textColor="#FFFFFF"
  fontSize={14}
/>
```

### Using Hooks

```tsx
import {
  usePlayerState,
  useControlsVisibility,
  useFullscreen,
  useDoubleTap,
} from 'expo-vlc-combo-player';

// Player state management
const {
  state,
  setIsPlaying,
  togglePlayPause,
  setVolume,
  setPlaybackSpeed,
  updateProgress,
} = usePlayerState({
  initialState: { volume: 1, playbackSpeed: 1 },
  onStateChange: (newState) => console.log(newState),
});

// Auto-hide controls
const {
  isVisible,
  show,
  hide,
  toggle,
  resetTimer,
} = useControlsVisibility({
  autoHide: true,
  autoHideDelay: 3000,
});

// Fullscreen management
const {
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
  toggleFullscreen,
} = useFullscreen({
  orientation: 'landscape',
  autoRotate: true,
});

// Double-tap gesture
const { handleTap, setContainerWidth } = useDoubleTap({
  onSingleTap: () => toggleControls(),
  onDoubleTapLeft: () => seekBackward(10),
  onDoubleTapRight: () => seekForward(10),
});
```

## API Reference

### VLCComboPlayer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `VideoSource` | required | Video source configuration |
| `autoPlay` | `boolean` | `false` | Auto-play video on load |
| `loop` | `boolean` | `false` | Loop video playback |
| `muted` | `boolean` | `false` | Start muted |
| `volume` | `number` | `1` | Initial volume (0-1) |
| `playbackSpeed` | `PlaybackSpeed` | `1` | Initial playback speed |
| `paused` | `boolean` | `false` | Control pause state |
| `preferredBackend` | `'expo-video' \| 'vlc'` | `'expo-video'` | Preferred player backend |
| `forceVlcForCodecs` | `string[]` | `['hevc', 'h265', 'wmv', ...]` | Codecs that force VLC backend |
| `resizeMode` | `'contain' \| 'cover' \| 'stretch'` | `'contain'` | Video resize mode |
| `posterSource` | `string` | - | Poster image URL |
| `controls` | `boolean` | `true` | Show built-in controls |
| `controlsConfig` | `ControlsConfig` | - | Controls configuration |
| `controlsTheme` | `ControlsTheme` | - | Controls theme/colors |
| `fullscreen` | `boolean` | `false` | Control fullscreen state |
| `style` | `ViewStyle` | - | Container style |

### VideoSource

```typescript
type VideoSource = {
  uri: string;
  headers?: Record<string, string>;
  type?: 'mp4' | 'hls' | 'm3u8' | 'mkv' | 'avi' | 'mov' | 'webm' | 'flv' | 'wmv' | 'rtsp' | 'rtmp';
  title?: string;
  subtitle?: {
    uri: string;
    language?: string;
    title?: string;
  };
};
```

### ControlsConfig

```typescript
type ControlsConfig = {
  showPlayPause?: boolean;        // default: true
  showSeekButtons?: boolean;      // default: true
  seekInterval?: number;          // default: 10 (seconds)
  showProgressBar?: boolean;      // default: true
  showTimeDisplay?: boolean;      // default: true
  showSpeedSelector?: boolean;    // default: true
  showVolumeControl?: boolean;    // default: true
  showAirPlayButton?: boolean;    // default: true (iOS only)
  showFullscreenButton?: boolean; // default: true
  showMuteButton?: boolean;       // default: true
  showTitle?: boolean;            // default: true
  showBackButton?: boolean;       // default: false
  autoHide?: boolean;             // default: true
  autoHideDelay?: number;         // default: 3000 (ms)
  doubleTapToSeek?: boolean;      // default: true
  doubleTapSeekInterval?: number; // default: 10 (seconds)
};
```

### ControlsTheme

```typescript
type ControlsTheme = {
  primaryColor?: string;              // default: '#FFFFFF'
  secondaryColor?: string;            // default: '#AAAAAA'
  backgroundColor?: string;           // default: 'rgba(0, 0, 0, 0.6)'
  textColor?: string;                 // default: '#FFFFFF'
  iconColor?: string;                 // default: '#FFFFFF'
  progressBarColor?: string;          // default: '#FF0000'
  progressBarBackgroundColor?: string;// default: 'rgba(255, 255, 255, 0.3)'
  progressBarBufferColor?: string;    // default: 'rgba(255, 255, 255, 0.5)'
  activeSpeedColor?: string;          // default: '#FF0000'
  iconSize?: number;                  // default: 28
  fontSize?: number;                  // default: 14
};
```

### Player Ref Methods

```typescript
type ExpoVlcComboPlayerRef = {
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
};
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onLoad` | `OnLoadEventPayload` | Fired when video metadata is loaded |
| `onProgress` | `OnProgressEventPayload` | Fired periodically with playback progress |
| `onPlaybackStateChange` | `OnPlaybackStateChangeEventPayload` | Fired when play/pause state changes |
| `onSeek` | `OnSeekEventPayload` | Fired when seeking |
| `onBuffer` | `OnBufferEventPayload` | Fired when buffering state changes |
| `onError` | `OnErrorEventPayload` | Fired on playback error |
| `onEnd` | `void` | Fired when video ends |
| `onFullscreenChange` | `{ isFullscreen: boolean }` | Fired when fullscreen state changes |
| `onPlaybackSpeedChange` | `{ speed: PlaybackSpeed }` | Fired when speed changes |

## Supported Formats

### expo-video (default)
- MP4, MOV, M4V
- HLS (m3u8)
- Most H.264/AAC content

### VLC Backend (automatic fallback)
- MKV, AVI, WMV, FLV
- HEVC/H.265
- RTSP, RTMP streams
- DivX, Xvid
- Most other formats

## Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| expo-video backend | ✅ | ✅ | ✅ |
| VLC backend | ✅ | ✅ | ❌ |
| Custom controls | ✅ | ✅ | ✅ |
| Fullscreen | ✅ | ✅ | ✅ |
| AirPlay | ✅ | ❌ | ❌ |
| Orientation lock | ✅ | ✅ | ❌ |

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## Credits

- [expo-video](https://docs.expo.dev/versions/latest/sdk/video/) - Primary video backend
- [react-native-vlc-media-player](https://github.com/razorRun/react-native-vlc-media-player) - VLC backend for advanced codecs
