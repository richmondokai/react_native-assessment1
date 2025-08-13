import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
} from 'react-native';
import { Profile } from '../types/Profile';
import ProfileCard from './ProfileCard';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

interface SwipeableProfileCardProps {
  profile: Profile;
  onDelete?: (id: string) => void;
  onEdit?: (profile: Profile) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const SwipeableProfileCard: React.FC<SwipeableProfileCardProps> = ({ 
  profile, 
  onDelete, 
  onEdit 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {
      translateX.setOffset(lastOffset.current);
    },
    onPanResponderMove: (_, gestureState) => {
      // Only allow left swipe (negative values)
      const newValue = Math.min(0, gestureState.dx);
      translateX.setValue(newValue);
    },
    onPanResponderRelease: (_, gestureState) => {
      translateX.flattenOffset();
      
      if (gestureState.dx < -SWIPE_THRESHOLD) {
        // Swipe far enough to show actions
        animateToPosition(-120);
        lastOffset.current = -120;
      } else {
        // Snap back to original position
        animateToPosition(0);
        lastOffset.current = 0;
      }
    },
  });

  const animateToPosition = (position: number) => {
    Animated.spring(translateX, {
      toValue: position,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete ${profile.name}'s profile?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => animateToPosition(0),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(profile.id);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(profile);
    }
    animateToPosition(0);
    lastOffset.current = 0;
  };

  return (
    <View style={styles.container}>
      {/* Action buttons (revealed when swiping) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Main card content */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <ProfileCard profile={profile} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
    zIndex: 1,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
  },
  cardContainer: {
    backgroundColor: colors.white,
    zIndex: 2,
  },
});

export default SwipeableProfileCard;
