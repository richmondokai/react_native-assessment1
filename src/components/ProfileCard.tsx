import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { Profile } from '../types/Profile';
import ContactButton from './ContactButton';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

interface ProfileCardProps {
  profile: Profile;
  onDelete?: (id: string) => void;
  onLongPress?: (profile: Profile, position: { x: number; y: number }) => void;
}

// Remove fixed width calculation - let it be responsive

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onDelete, onLongPress }) => {
  const [deletePressed, setDeletePressed] = useState(false);
  const colors = useColors();

  const handleSocialMediaPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const handleContactPress = async (type: 'email' | 'call', value: string) => {
    try {
      let url = '';
      
      switch (type) {
        case 'call':
          url = `tel:${value}`;
          break;
        case 'email':
          url = `mailto:${value}`;
          break;
        default:
          return;
      }

      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Cannot ${type} ${value} on this device`);
      }
    } catch (error) {
      console.error(`Error trying to ${type}:`, error);
    }
  };

  const renderSocialMediaLinks = () => {
    const socialLinks = [];
    
    if (profile.socialMedia.linkedin) {
      socialLinks.push(
        <TouchableOpacity
          key="linkedin"
          style={styles.socialButton}
          onPress={() => handleSocialMediaPress(profile.socialMedia.linkedin!)}
          activeOpacity={0.7}
        >
          <Text style={styles.socialButtonText}>LinkedIn</Text>
        </TouchableOpacity>
      );
    }
    
    if (profile.socialMedia.twitter) {
      socialLinks.push(
        <TouchableOpacity
          key="twitter"
          style={styles.socialButton}
          onPress={() => handleSocialMediaPress(profile.socialMedia.twitter!)}
          activeOpacity={0.7}
        >
          <Text style={styles.socialButtonText}>Twitter</Text>
        </TouchableOpacity>
      );
    }
    
    if (profile.socialMedia.github) {
      socialLinks.push(
        <TouchableOpacity
          key="github"
          style={styles.socialButton}
          onPress={() => handleSocialMediaPress(profile.socialMedia.github!)}
          activeOpacity={0.7}
        >
          <Text style={styles.socialButtonText}>GitHub</Text>
        </TouchableOpacity>
      );
    }
    
    return socialLinks;
  };

  const handleDeletePress = () => {
    if (!onDelete) return;
    
    setDeletePressed(true);
    
    // Add a small delay to show the red state before showing alert
    setTimeout(() => {
      setDeletePressed(false);
      onDelete(profile.id);
    }, 200);
  };

  const handleLongPress = (event: any) => {
    if (onLongPress) {
      const { pageX, pageY } = event.nativeEvent;
      onLongPress(profile, { x: pageX, y: pageY });
    }
  };

  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={handleLongPress}
      activeOpacity={0.95}
      delayLongPress={500}
    >
      {/* Delete button positioned in top-right corner */}
      {onDelete && (
        <TouchableOpacity
          style={[
            styles.deleteButton,
            deletePressed && styles.deleteButtonPressed
          ]}
          onPress={handleDeletePress}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.deleteButtonText,
            deletePressed && styles.deleteButtonTextPressed
          ]}>
            Delete
          </Text>
        </TouchableOpacity>
      )}

      {/* Header with avatar and basic info */}
      <View style={styles.header}>
        <Image
          source={{ uri: profile.avatar }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=?' }}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{profile.title}</Text>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bio}>{profile.bio}</Text>

      {/* Contact information */}
      <View style={styles.contactInfo}>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Email: </Text>
          <TouchableOpacity onPress={() => handleContactPress('email', profile.email)}>
            <Text style={[styles.contactValue, styles.contactLink]}>{profile.email}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Phone: </Text>
          <TouchableOpacity onPress={() => handleContactPress('call', profile.phone)}>
            <Text style={[styles.contactValue, styles.contactLink]}>{profile.phone}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact buttons */}
      <View style={styles.contactButtons}>
        <ContactButton
          type="call"
          value={profile.phone}
          label="Call"
          variant="success"
        />
        <ContactButton
          type="email"
          value={profile.email}
          label="Email"
          variant="secondary"
        />
        <ContactButton
          type="message"
          value={profile.phone}
          label="Message"
          variant="outline"
        />
      </View>

      {/* Social media links */}
      {renderSocialMediaLinks().length > 0 && (
        <View style={styles.socialMedia}>
          <View style={styles.socialMediaRow}>
            <Text style={styles.socialMediaLabel}>Connect: </Text>
            <View style={styles.socialMediaButtons}>
              {renderSocialMediaLinks()}
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.sm,
    flex: 1,
    maxWidth: 400, // Maximum width for very large screens
    minWidth: 280, // Minimum width to ensure readability
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs, // Reduced top margin to move content up
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
    marginRight: 60, // Space for delete button (48px width + 12px spacing)
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.warning,
    borderWidth: 1,
    borderColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    zIndex: 1,
  },
  deleteButtonPressed: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
  },
  deleteButtonTextPressed: {
    color: colors.white,
  },
  bio: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily,
  },
  contactInfo: {
    marginBottom: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  contactLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  contactValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    flex: 1,
  },
  contactLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  socialMedia: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  socialMediaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  socialMediaLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    marginTop: spacing.xs, // Align with buttons
    marginRight: spacing.sm,
  },
  socialMediaButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  socialButton: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  socialButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
  },
});

export default ProfileCard;
