import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

interface FloatingActionButtonProps {
  onAddProfile: () => void;
  onImportProfiles?: () => void;
  onExportProfiles?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddProfile,
  onImportProfiles,
  onExportProfiles,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const styles = createStyles(colors);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(animation, {
        toValue,
        useNativeDriver: true,
        tension: 80,
        friction: 5,
      }),
      Animated.timing(rotateAnimation, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(!isOpen);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    toggleMenu();
  };

  const menuItems = [
    {
      label: 'Add Profile',
      onPress: () => handleMenuAction(onAddProfile),
      backgroundColor: colors.primary,
      icon: '+',
    },
    ...(onImportProfiles ? [{
      label: 'Import',
      onPress: () => handleMenuAction(onImportProfiles),
      backgroundColor: colors.success,
      icon: '↓',
    }] : []),
    ...(onExportProfiles ? [{
      label: 'Export',
      onPress: () => handleMenuAction(onExportProfiles),
      backgroundColor: colors.secondary,
      icon: '↑',
    }] : []),
  ];

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      {/* Menu Items */}
      {menuItems.map((item, index) => {
        const itemAnimation = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 + spacing.md) * (index + 1)],
        });

        const scaleAnimation = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        const opacityAnimation = animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0, 1],
        });

        return (
          <Animated.View
            key={item.label}
            style={[
              styles.menuItem,
              {
                transform: [
                  { translateY: itemAnimation },
                  { scale: scaleAnimation },
                ],
                opacity: opacityAnimation,
              },
            ]}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: item.backgroundColor }]}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      })}

      {/* Main FAB */}
      <TouchableOpacity
        style={[styles.fab, isOpen && styles.fabOpen]}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Animated.Text
          style={[
            styles.fabIcon,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          +
        </Animated.Text>
      </TouchableOpacity>

      {/* Overlay when menu is open */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabOpen: {
    backgroundColor: colors.danger,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 24,
  },
  menuItem: {
    position: 'absolute',
    right: 0,
    alignItems: 'flex-end',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  menuIcon: {
    fontSize: 18,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
});

export default FloatingActionButton;
