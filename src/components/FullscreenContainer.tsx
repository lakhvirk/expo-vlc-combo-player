import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Modal,
  StatusBar,
  Dimensions,
  Platform,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';

type FullscreenContainerProps = {
  isFullscreen: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animationDuration?: number;
  orientation?: 'landscape' | 'portrait' | 'all';
  backgroundColor?: string;
};

type LayoutInfo = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const FullscreenContainer: React.FC<FullscreenContainerProps> = ({
  isFullscreen,
  onFullscreenChange,
  children,
  style,
  animationDuration = 300,
  backgroundColor = '#000000',
}) => {
  const containerRef = useRef<View>(null);
  const [inlineLayout, setInlineLayout] = useState<LayoutInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values
  const scaleX = useRef(new Animated.Value(1)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const screenDimensions = Dimensions.get('window');

  // Measure the inline container position
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    containerRef.current?.measureInWindow((x, y) => {
      setInlineLayout({ x, y, width, height });
    });
  }, []);

  // Handle entering fullscreen
  const enterFullscreen = useCallback(() => {
    if (!inlineLayout || isAnimating) return;

    setIsAnimating(true);
    setShowModal(true);

    // Calculate scale factors
    const targetWidth = screenDimensions.width;
    const targetHeight = screenDimensions.height;
    const scaleFactorX = targetWidth / inlineLayout.width;
    const scaleFactorY = targetHeight / inlineLayout.height;

    // Calculate translation to center
    const centerX = (screenDimensions.width - inlineLayout.width) / 2 - inlineLayout.x;
    const centerY = (screenDimensions.height - inlineLayout.height) / 2 - inlineLayout.y;

    // Set initial values for modal
    scaleX.setValue(1 / scaleFactorX);
    scaleY.setValue(1 / scaleFactorY);
    translateX.setValue(-centerX / scaleFactorX);
    translateY.setValue(-centerY / scaleFactorY);
    modalOpacity.setValue(0);

    // Animate to fullscreen
    Animated.parallel([
      Animated.timing(scaleX, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleY, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: animationDuration * 0.5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: animationDuration * 0.3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
      onFullscreenChange?.(true);
    });
  }, [
    inlineLayout,
    isAnimating,
    screenDimensions,
    animationDuration,
    scaleX,
    scaleY,
    translateX,
    translateY,
    modalOpacity,
    opacity,
    onFullscreenChange,
  ]);

  // Handle exiting fullscreen
  const exitFullscreen = useCallback(() => {
    if (!inlineLayout || isAnimating) return;

    setIsAnimating(true);

    // Calculate scale factors
    const targetWidth = screenDimensions.width;
    const targetHeight = screenDimensions.height;
    const scaleFactorX = targetWidth / inlineLayout.width;
    const scaleFactorY = targetHeight / inlineLayout.height;

    // Calculate translation to original position
    const centerX = (screenDimensions.width - inlineLayout.width) / 2 - inlineLayout.x;
    const centerY = (screenDimensions.height - inlineLayout.height) / 2 - inlineLayout.y;

    // Animate back to inline
    Animated.parallel([
      Animated.timing(scaleX, {
        toValue: 1 / scaleFactorX,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleY, {
        toValue: 1 / scaleFactorY,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -centerX / scaleFactorX,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -centerY / scaleFactorY,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: animationDuration,
        delay: animationDuration * 0.5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      setIsAnimating(false);
      onFullscreenChange?.(false);
    });
  }, [
    inlineLayout,
    isAnimating,
    screenDimensions,
    animationDuration,
    scaleX,
    scaleY,
    translateX,
    translateY,
    modalOpacity,
    opacity,
    onFullscreenChange,
  ]);

  // Respond to isFullscreen prop changes
  useEffect(() => {
    if (isFullscreen && !showModal && !isAnimating) {
      enterFullscreen();
    } else if (!isFullscreen && showModal && !isAnimating) {
      exitFullscreen();
    }
  }, [isFullscreen, showModal, isAnimating, enterFullscreen, exitFullscreen]);

  return (
    <>
      {/* Inline Container */}
      <Animated.View
        ref={containerRef}
        style={[styles.inlineContainer, { opacity }, style]}
        onLayout={handleLayout}
      >
        {!showModal && children}
      </Animated.View>

      {/* Fullscreen Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={exitFullscreen}
        supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      >
        <StatusBar hidden={isFullscreen && !isAnimating} />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor,
              opacity: modalOpacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.fullscreenContent,
              {
                transform: [
                  { scaleX },
                  { scaleY },
                  { translateX },
                  { translateY },
                ],
              },
            ]}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inlineContainer: {
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContent: {
    width: '100%',
    height: '100%',
  },
});

export default FullscreenContainer;
