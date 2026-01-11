import { useState, useCallback, useRef, useMemo } from 'react';
import type {
  PlayerState,
  PlayerStatus,
  PlaybackSpeed,
  UsePlayerStateOptions,
  PlayerError,
} from '../ExpoVlcComboPlayer.types';

const DEFAULT_PLAYER_STATE: PlayerState = {
  status: 'idle',
  currentTime: 0,
  duration: 0,
  bufferedTime: 0,
  isPlaying: false,
  isMuted: false,
  volume: 1,
  playbackSpeed: 1,
  isFullscreen: false,
  isAirPlayConnected: false,
  backend: 'expo-video',
};

export function usePlayerState(options: UsePlayerStateOptions = {}) {
  const { initialState, onStateChange } = options;

  const [state, setState] = useState<PlayerState>({
    ...DEFAULT_PLAYER_STATE,
    ...initialState,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const updateState = useCallback(
    (updates: Partial<PlayerState>) => {
      setState((prevState) => {
        const newState = { ...prevState, ...updates };
        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Status updates
  const setStatus = useCallback(
    (status: PlayerStatus) => {
      const isPlaying = status === 'playing';
      updateState({ status, isPlaying });
    },
    [updateState]
  );

  // Time updates
  const setCurrentTime = useCallback(
    (currentTime: number) => {
      updateState({ currentTime });
    },
    [updateState]
  );

  const setDuration = useCallback(
    (duration: number) => {
      updateState({ duration });
    },
    [updateState]
  );

  const setBufferedTime = useCallback(
    (bufferedTime: number) => {
      updateState({ bufferedTime });
    },
    [updateState]
  );

  // Playback updates
  const setIsPlaying = useCallback(
    (isPlaying: boolean) => {
      const status: PlayerStatus = isPlaying ? 'playing' : 'paused';
      updateState({ isPlaying, status });
    },
    [updateState]
  );

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!stateRef.current.isPlaying);
  }, [setIsPlaying]);

  // Volume updates
  const setVolume = useCallback(
    (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      updateState({ volume: clampedVolume });
    },
    [updateState]
  );

  const setIsMuted = useCallback(
    (isMuted: boolean) => {
      updateState({ isMuted });
    },
    [updateState]
  );

  const toggleMute = useCallback(() => {
    updateState({ isMuted: !stateRef.current.isMuted });
  }, [updateState]);

  // Speed updates
  const setPlaybackSpeed = useCallback(
    (playbackSpeed: PlaybackSpeed) => {
      updateState({ playbackSpeed });
    },
    [updateState]
  );

  // Fullscreen updates
  const setIsFullscreen = useCallback(
    (isFullscreen: boolean) => {
      updateState({ isFullscreen });
    },
    [updateState]
  );

  const toggleFullscreen = useCallback(() => {
    updateState({ isFullscreen: !stateRef.current.isFullscreen });
  }, [updateState]);

  // AirPlay updates
  const setIsAirPlayConnected = useCallback(
    (isAirPlayConnected: boolean) => {
      updateState({ isAirPlayConnected });
    },
    [updateState]
  );

  // Error handling
  const setError = useCallback(
    (error: PlayerError | undefined) => {
      updateState({ error, status: error ? 'error' : stateRef.current.status });
    },
    [updateState]
  );

  // Reset state
  const reset = useCallback(() => {
    setState({
      ...DEFAULT_PLAYER_STATE,
      ...initialState,
    });
  }, [initialState]);

  // Progress update (combined time update)
  const updateProgress = useCallback(
    (progress: { currentTime: number; duration?: number; bufferedTime?: number }) => {
      updateState({
        currentTime: progress.currentTime,
        ...(progress.duration !== undefined && { duration: progress.duration }),
        ...(progress.bufferedTime !== undefined && { bufferedTime: progress.bufferedTime }),
      });
    },
    [updateState]
  );

  return useMemo(
    () => ({
      state,
      // State setters
      updateState,
      setStatus,
      setCurrentTime,
      setDuration,
      setBufferedTime,
      setIsPlaying,
      togglePlayPause,
      setVolume,
      setIsMuted,
      toggleMute,
      setPlaybackSpeed,
      setIsFullscreen,
      toggleFullscreen,
      setIsAirPlayConnected,
      setError,
      reset,
      updateProgress,
    }),
    [
      state,
      updateState,
      setStatus,
      setCurrentTime,
      setDuration,
      setBufferedTime,
      setIsPlaying,
      togglePlayPause,
      setVolume,
      setIsMuted,
      toggleMute,
      setPlaybackSpeed,
      setIsFullscreen,
      toggleFullscreen,
      setIsAirPlayConnected,
      setError,
      reset,
      updateProgress,
    ]
  );
}

export default usePlayerState;
