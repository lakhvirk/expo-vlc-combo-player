import React, { useRef, useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  VLCComboPlayer,
  type ExpoVlcComboPlayerRef,
  type PlaybackSpeed,
  type OnLoadEventPayload,
  type OnProgressEventPayload,
  type OnPlaybackStateChangeEventPayload,
  ProgressBar,
  InlineSpeedSelector,
  TimeDisplay,
  formatTime,
} from "expo-vlc-combo-player";

// Sample video URLs for testing
const SAMPLE_VIDEOS = [
  {
    title: "Big Buck Bunny (MP4)",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "mp4" as const,
  },
  {
    title: "Tears of Steel (MP4)",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    type: "mp4" as const,
  },
  {
    title: "Sintel (MP4)",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    type: "mp4" as const,
  },
];

const { width: screenWidth } = Dimensions.get("window");

export default function App() {
  const playerRef = useRef<ExpoVlcComboPlayerRef>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({
    duration: 0,
    currentTime: 0,
    status: "idle",
  });

  const currentVideo = SAMPLE_VIDEOS[currentVideoIndex];

  // Event handlers
  const handleLoad = useCallback((event: OnLoadEventPayload) => {
    console.log("Video loaded:", event);
    setPlayerInfo((prev) => ({
      ...prev,
      duration: event.duration,
    }));
  }, []);

  const handleProgress = useCallback((event: OnProgressEventPayload) => {
    setPlayerInfo((prev) => ({
      ...prev,
      currentTime: event.currentTime,
      duration: event.duration,
    }));
  }, []);

  const handlePlaybackStateChange = useCallback(
    (event: OnPlaybackStateChangeEventPayload) => {
      setPlayerInfo((prev) => ({
        ...prev,
        status: event.status,
      }));
    },
    []
  );

  const handleFullscreenChange = useCallback(
    (event: { isFullscreen: boolean }) => {
      setIsFullscreen(event.isFullscreen);
    },
    []
  );

  const handleError = useCallback((event: any) => {
    console.error("Player error:", event);
  }, []);

  // Control handlers
  const handlePlayPause = useCallback(() => {
    playerRef.current?.togglePlayPause();
  }, []);

  const handleSeekForward = useCallback(() => {
    playerRef.current?.seekForward(10);
  }, []);

  const handleSeekBackward = useCallback(() => {
    playerRef.current?.seekBackward(10);
  }, []);

  const handleSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);

  const handleSpeedChange = useCallback((speed: PlaybackSpeed) => {
    playerRef.current?.setPlaybackSpeed(speed);
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    playerRef.current?.toggleFullscreen();
  }, []);

  const handleVideoSelect = useCallback((index: number) => {
    setCurrentVideoIndex(index);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Expo VLC Combo Player</Text>
            <Text style={styles.headerSubtitle}>
              Video player with custom native-like controls
            </Text>
          </View>

          {/* Video Player */}
          <View style={styles.playerSection}>
            <Text style={styles.sectionTitle}>Video Player</Text>
            <View style={styles.playerContainer}>
              <VLCComboPlayer
                ref={playerRef}
                source={{
                  uri: currentVideo.uri,
                  title: currentVideo.title,
                  type: currentVideo.type,
                }}
                style={styles.player}
                controls={true}
                autoPlay={false}
                loop={false}
                controlsConfig={{
                  showPlayPause: true,
                  showSeekButtons: true,
                  seekInterval: 10,
                  showProgressBar: true,
                  showTimeDisplay: true,
                  showSpeedSelector: true,
                  showFullscreenButton: true,
                  showAirPlayButton: Platform.OS === "ios",
                  showTitle: true,
                  autoHide: true,
                  autoHideDelay: 3000,
                  doubleTapToSeek: true,
                  doubleTapSeekInterval: 10,
                }}
                controlsTheme={{
                  primaryColor: "#FFFFFF",
                  progressBarColor: "#E50914",
                  activeSpeedColor: "#E50914",
                  iconSize: 28,
                }}
                onLoad={handleLoad}
                onProgress={handleProgress}
                onPlaybackStateChange={handlePlaybackStateChange}
                onFullscreenChange={handleFullscreenChange}
                onError={handleError}
                onBackPress={() => console.log("Back pressed")}
              />
            </View>
          </View>

          {/* Player Info */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Player Status</Text>
            <View style={styles.infoGrid}>
              <InfoItem label="Status" value={playerInfo.status} />
              <InfoItem
                label="Current Time"
                value={formatTime(playerInfo.currentTime)}
              />
              <InfoItem
                label="Duration"
                value={formatTime(playerInfo.duration)}
              />
              <InfoItem
                label="Fullscreen"
                value={isFullscreen ? "Yes" : "No"}
              />
            </View>
          </View>

          {/* Video Selection */}
          <View style={styles.videoListSection}>
            <Text style={styles.sectionTitle}>Select Video</Text>
            {SAMPLE_VIDEOS.map((video, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.videoItem,
                  currentVideoIndex === index && styles.videoItemActive,
                ]}
                onPress={() => handleVideoSelect(index)}
              >
                <Text
                  style={[
                    styles.videoItemText,
                    currentVideoIndex === index && styles.videoItemTextActive,
                  ]}
                >
                  {video.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* External Controls Demo */}
          <View style={styles.controlsSection}>
            <Text style={styles.sectionTitle}>External Controls</Text>
            <Text style={styles.sectionSubtitle}>
              You can also control the player programmatically
            </Text>

            {/* Playback Controls */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleSeekBackward}
              >
                <Text style={styles.controlButtonText}>-10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.playButton]}
                onPress={handlePlayPause}
              >
                <Text style={styles.controlButtonText}>Play/Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleSeekForward}
              >
                <Text style={styles.controlButtonText}>+10s</Text>
              </TouchableOpacity>
            </View>

            {/* Speed Controls */}
            <View style={styles.speedSection}>
              <Text style={styles.speedLabel}>Playback Speed</Text>
              <View style={styles.speedButtons}>
                {([0.5, 1, 1.5, 2] as PlaybackSpeed[]).map((speed) => (
                  <TouchableOpacity
                    key={speed}
                    style={styles.speedButton}
                    onPress={() => handleSpeedChange(speed)}
                  >
                    <Text style={styles.speedButtonText}>{speed}x</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fullscreen Button */}
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={handleFullscreenToggle}
            >
              <Text style={styles.fullscreenButtonText}>
                {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Individual Components Demo */}
          <View style={styles.componentsSection}>
            <Text style={styles.sectionTitle}>Individual Components</Text>
            <Text style={styles.sectionSubtitle}>
              All controls are available as standalone components
            </Text>

            {/* Standalone Progress Bar */}
            <View style={styles.componentDemo}>
              <Text style={styles.componentLabel}>Progress Bar</Text>
              <View style={styles.progressDemo}>
                <ProgressBar
                  currentTime={playerInfo.currentTime}
                  duration={playerInfo.duration}
                  bufferedTime={0}
                  onSeek={handleSeek}
                  progressColor="#E50914"
                  height={6}
                />
              </View>
            </View>

            {/* Standalone Time Display */}
            <View style={styles.componentDemo}>
              <Text style={styles.componentLabel}>Time Display</Text>
              <TimeDisplay
                currentTime={playerInfo.currentTime}
                duration={playerInfo.duration}
                textColor="#333"
                fontSize={16}
              />
            </View>

            {/* Standalone Speed Selector */}
            <View style={styles.componentDemo}>
              <Text style={styles.componentLabel}>Speed Selector</Text>
              <InlineSpeedSelector
                currentSpeed={1}
                onSpeedChange={handleSpeedChange}
                activeColor="#E50914"
                inactiveColor="#666"
              />
            </View>
          </View>

          {/* Features List */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <FeatureItem
              title="+10 / -10 Seeking"
              description="Quick seek forward or backward with customizable intervals"
            />
            <FeatureItem
              title="Progress Bar"
              description="Draggable progress bar with buffering indicator"
            />
            <FeatureItem
              title="Speed Controls"
              description="0.5x, 1x, 1.5x, 2x playback speeds"
            />
            <FeatureItem
              title="AirPlay Support"
              description="Stream to AirPlay devices on iOS"
            />
            <FeatureItem
              title="Fullscreen Animation"
              description="Smooth transition to fullscreen mode"
            />
            <FeatureItem
              title="Auto-hide Controls"
              description="Controls automatically hide after 3 seconds"
            />
            <FeatureItem
              title="Double-tap to Seek"
              description="Double-tap left/right to seek backward/forward"
            />
            <FeatureItem
              title="VLC Backend"
              description="Fallback to VLC for unsupported codecs"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>expo-vlc-combo-player v0.1.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Helper Components
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
    marginTop: -8,
  },
  playerSection: {
    backgroundColor: "#000",
    padding: 16,
    paddingTop: 20,
  },
  playerContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  player: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 8,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    minWidth: "45%",
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  videoListSection: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 8,
  },
  videoItem: {
    padding: 14,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 8,
  },
  videoItemActive: {
    backgroundColor: "#E50914",
  },
  videoItemText: {
    fontSize: 15,
    color: "#333",
  },
  videoItemTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },
  controlsSection: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 8,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "#E50914",
    minWidth: 100,
  },
  controlButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  speedSection: {
    marginBottom: 16,
  },
  speedLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  speedButtons: {
    flexDirection: "row",
    gap: 8,
  },
  speedButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  speedButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  fullscreenButton: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  fullscreenButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
  componentsSection: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 8,
  },
  componentDemo: {
    marginBottom: 20,
  },
  componentLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressDemo: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 16,
  },
  featuresSection: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 8,
  },
  featureItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#666",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
