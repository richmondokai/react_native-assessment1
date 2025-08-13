import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

interface ContactButtonProps {
  type: 'call' | 'email' | 'message';
  value: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
}

const ContactButton: React.FC<ContactButtonProps> = ({
  type,
  value,
  label,
  variant = 'primary',
}) => {
  const colors = useColors();
  const styles = createStyles(colors);
  
  const handlePress = async () => {
    try {
      let url = '';
      
      switch (type) {
        case 'call':
          url = `tel:${value}`;
          break;
        case 'email':
          url = `mailto:${value}`;
          break;
        case 'message':
          url = Platform.select({
            ios: `sms:${value}`,
            android: `sms:${value}`,
            default: `sms:${value}`,
          });
          break;
        default:
          throw new Error('Invalid contact type');
      }

      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Action not supported',
          `Cannot ${type} ${value} on this device`,
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to ${type} ${value}. Please try again.`,
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    marginHorizontal: spacing.xs,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.success,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  successText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
});

export default ContactButton;
