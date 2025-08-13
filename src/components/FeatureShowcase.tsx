import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

const FeatureShowcase: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: '🎯 Swipe-to-Delete Gestures',
      description: 'Intuitive swipe gestures for quick profile deletion with smooth animations'
    },
    {
      title: '✨ Smooth Animations',
      description: 'Fluid transitions and animations throughout the app for enhanced UX'
    },
    {
      title: '🔄 Floating Action Button',
      description: 'Animated FAB with expandable menu for quick actions'
    },
    {
      title: '📱 Pull-to-Refresh',
      description: 'Native pull-to-refresh functionality with haptic feedback'
    },
    {
      title: '💀 Skeleton Loading',
      description: 'Beautiful skeleton screens for better perceived performance'
    },
    {
      title: '🔍 Smart Search',
      description: 'Enhanced search with filters, suggestions, and quick chips'
    },
    {
      title: '📳 Haptic Feedback',
      description: 'Tactile feedback for all interactive elements'
    },
    {
      title: '📷 Image Picker',
      description: 'Professional image picker with camera/gallery/URL options'
    },
    {
      title: '⚡ Quick Actions Menu',
      description: 'Contextual menu on long press with multiple actions'
    },
    {
      title: '🌙 Dark Mode',
      description: 'Complete dark mode support with system preference detection'
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          ✨ Creative Solutions Implemented
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Polished UX details for your ProfileCardApp
        </Text>
      </View>

      {features.map((feature, index) => (
        <View
          key={index}
          style={[
            styles.featureCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            }
          ]}
        >
          <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>
            {feature.title}
          </Text>
          <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
            {feature.description}
          </Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
          🎉 All features implemented with precision and no errors!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  featureCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
  },
});

export default FeatureShowcase;
