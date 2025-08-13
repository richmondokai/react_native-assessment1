import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const slideAnimation = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isDark ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDark, slideAnimation]);

  const translateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.border }]}
      onPress={toggleTheme}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.slider,
          {
            backgroundColor: theme.colors.primary,
            transform: [{ translateX }],
          },
        ]}
      />
      <Text style={[styles.icon, styles.leftIcon]}>☀️</Text>
      <Text style={[styles.icon, styles.rightIcon]}>🌙</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    left: 2,
  },
  icon: {
    fontSize: 12,
    zIndex: 1,
    textAlign: 'center',
    lineHeight: 20, // Match the slider height for perfect vertical centering
  },
  leftIcon: {
    position: 'absolute',
    left: 2,
    width: 20,
    height: 20,
  },
  rightIcon: {
    position: 'absolute',
    right: 2,
    width: 20,
    height: 20,
  },
});

export default ThemeToggleButton;
