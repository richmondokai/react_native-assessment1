import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Profile } from '../types/Profile';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';
import { useHaptics } from '../utils/haptics';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface QuickActionsMenuProps {
  visible: boolean;
  profile: Profile;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit?: (profile: Profile) => void;
  onDelete?: (id: string) => void;
  onShare?: (profile: Profile) => void;
  onFavorite?: (profile: Profile) => void;
  onCall?: (phone: string) => void;
  onEmail?: (email: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  visible,
  profile,
  position,
  onClose,
  onEdit,
  onDelete,
  onShare,
  onFavorite,
  onCall,
  onEmail,
}) => {
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const styles = createStyles(colors);
  const { triggerLight, triggerSuccess } = useHaptics();

  useEffect(() => {
    if (visible) {
      triggerLight();
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnimation, opacityAnimation]);

  const actions: QuickAction[] = [
    ...(onEdit ? [{
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      color: colors.primary,
      onPress: () => {
        triggerSuccess();
        onEdit(profile);
        onClose();
      },
    }] : []),
    ...(onCall ? [{
      id: 'call',
      label: 'Call',
      icon: '📞',
      color: colors.success,
      onPress: () => {
        triggerSuccess();
        onCall(profile.phone);
        onClose();
      },
    }] : []),
    ...(onEmail ? [{
      id: 'email',
      label: 'Email',
      icon: '✉️',
      color: colors.secondary,
      onPress: () => {
        triggerSuccess();
        onEmail(profile.email);
        onClose();
      },
    }] : []),
    ...(onShare ? [{
      id: 'share',
      label: 'Share',
      icon: '📤',
      color: colors.warning,
      onPress: () => {
        triggerSuccess();
        onShare(profile);
        onClose();
      },
    }] : []),
    ...(onFavorite ? [{
      id: 'favorite',
      label: 'Favorite',
      icon: '⭐',
      color: colors.warning,
      onPress: () => {
        triggerSuccess();
        onFavorite(profile);
        onClose();
      },
    }] : []),
    ...(onDelete ? [{
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      color: colors.danger,
      onPress: () => {
        triggerSuccess();
        onDelete(profile.id);
        onClose();
      },
    }] : []),
  ];

  // Calculate optimal position to keep menu on screen
  const calculateMenuPosition = () => {
    const menuWidth = 200;
    const menuHeight = Math.ceil(actions.length / 2) * 60 + spacing.md * 2;
    
    let x = position.x;
    let y = position.y;

    // Adjust horizontal position
    if (x + menuWidth > SCREEN_WIDTH - spacing.md) {
      x = SCREEN_WIDTH - menuWidth - spacing.md;
    }
    if (x < spacing.md) {
      x = spacing.md;
    }

    // Adjust vertical position
    if (y + menuHeight > SCREEN_HEIGHT - spacing.xl) {
      y = position.y - menuHeight - spacing.md;
    }
    if (y < spacing.xl) {
      y = spacing.xl;
    }

    return { x, y };
  };

  const menuPosition = calculateMenuPosition();

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View style={{ opacity: opacityAnimation }} />
      </TouchableOpacity>

      {/* Menu */}
      <Animated.View
        style={[
          styles.menu,
          {
            left: menuPosition.x,
            top: menuPosition.y,
            transform: [{ scale: scaleAnimation }],
            opacity: opacityAnimation,
          },
        ]}
      >
        {/* Profile info header */}
        <View style={styles.header}>
          <Text style={styles.profileName} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={styles.profileTitle} numberOfLines={1}>
            {profile.title}
          </Text>
        </View>

        {/* Actions grid */}
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionItem,
                { 
                  backgroundColor: `${action.color}15`,
                  borderColor: `${action.color}30`,
                },
              ]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={[styles.actionLabel, { color: action.color }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    minWidth: 200,
    maxWidth: 250,
    zIndex: 1001,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.xs,
  },
  profileTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    padding: spacing.xs,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
  },
});

export default QuickActionsMenu;
