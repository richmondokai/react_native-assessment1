import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useColors } from '../context/ThemeContext';
import { spacing, borderRadius } from '../styles/spacing';

interface SkeletonLoaderProps {
  count?: number;
  variant?: 'card' | 'list' | 'compact';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  count = 3, 
  variant = 'card' 
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const styles = createStyles(colors);

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => shimmer());
    };

    shimmer();
  }, [shimmerAnimation]);

  const shimmerStyle = {
    opacity: shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  const SkeletonBox: React.FC<{ style?: any }> = ({ style }) => (
    <Animated.View style={[styles.skeletonBox, shimmerStyle, style]} />
  );

  const renderCardSkeleton = () => (
    <View style={styles.cardSkeleton}>
      {/* Header */}
      <View style={styles.headerSkeleton}>
        <SkeletonBox style={styles.avatarSkeleton} />
        <View style={styles.headerTextSkeleton}>
          <SkeletonBox style={styles.nameSkeleton} />
          <SkeletonBox style={styles.titleSkeleton} />
        </View>
      </View>

      {/* Bio */}
      <SkeletonBox style={styles.bioSkeleton1} />
      <SkeletonBox style={styles.bioSkeleton2} />
      <SkeletonBox style={styles.bioSkeleton3} />

      {/* Contact info */}
      <View style={styles.contactSkeleton}>
        <SkeletonBox style={styles.contactLineSkeleton} />
        <SkeletonBox style={styles.contactLineSkeleton} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonsSkeleton}>
        <SkeletonBox style={styles.buttonSkeleton} />
        <SkeletonBox style={styles.buttonSkeleton} />
        <SkeletonBox style={styles.buttonSkeleton} />
      </View>
    </View>
  );

  const renderListSkeleton = () => (
    <View style={styles.listSkeleton}>
      <View style={styles.listItemSkeleton}>
        <SkeletonBox style={styles.listAvatarSkeleton} />
        <View style={styles.listContentSkeleton}>
          <SkeletonBox style={styles.listNameSkeleton} />
          <SkeletonBox style={styles.listTitleSkeleton} />
        </View>
      </View>
    </View>
  );

  const renderCompactSkeleton = () => (
    <View style={styles.compactSkeleton}>
      <SkeletonBox style={styles.compactLineSkeleton} />
      <SkeletonBox style={styles.compactLineShortSkeleton} />
    </View>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return renderListSkeleton();
      case 'compact':
        return renderCompactSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.skeletonItem}>
          {renderSkeleton()}
        </View>
      ))}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonItem: {
    marginBottom: spacing.md,
  },
  skeletonBox: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  
  // Card skeleton styles
  cardSkeleton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarSkeleton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  headerTextSkeleton: {
    flex: 1,
  },
  nameSkeleton: {
    height: 20,
    width: '70%',
    marginBottom: spacing.xs,
  },
  titleSkeleton: {
    height: 16,
    width: '90%',
  },
  bioSkeleton1: {
    height: 16,
    width: '100%',
    marginBottom: spacing.xs,
  },
  bioSkeleton2: {
    height: 16,
    width: '95%',
    marginBottom: spacing.xs,
  },
  bioSkeleton3: {
    height: 16,
    width: '80%',
    marginBottom: spacing.md,
  },
  contactSkeleton: {
    marginBottom: spacing.md,
  },
  contactLineSkeleton: {
    height: 14,
    width: '85%',
    marginBottom: spacing.xs,
  },
  buttonsSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonSkeleton: {
    height: 36,
    width: 80,
    borderRadius: borderRadius.md,
  },

  // List skeleton styles
  listSkeleton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listAvatarSkeleton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  listContentSkeleton: {
    flex: 1,
  },
  listNameSkeleton: {
    height: 16,
    width: '60%',
    marginBottom: spacing.xs,
  },
  listTitleSkeleton: {
    height: 14,
    width: '80%',
  },

  // Compact skeleton styles
  compactSkeleton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactLineSkeleton: {
    height: 12,
    width: '100%',
    marginBottom: spacing.xs,
  },
  compactLineShortSkeleton: {
    height: 12,
    width: '70%',
  },
});

export default SkeletonLoader;
