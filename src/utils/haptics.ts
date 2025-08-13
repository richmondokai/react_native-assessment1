import { Platform } from 'react-native';

// Note: For full haptic feedback, you would typically install react-native-haptic-feedback
// For this implementation, we'll use a lightweight approach

export enum HapticFeedbackType {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SELECTION = 'selection',
}

class HapticManager {
  private isEnabled: boolean = true;

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  trigger(type: HapticFeedbackType) {
    if (!this.isEnabled) return;

    if (Platform.OS === 'ios') {
      // iOS haptic feedback simulation
      this.triggerIOS(type);
    } else if (Platform.OS === 'android') {
      // Android haptic feedback simulation
      this.triggerAndroid(type);
    }
  }

  private triggerIOS(type: HapticFeedbackType) {
    // In a real implementation, you would use:
    // import { HapticFeedback } from 'react-native-haptic-feedback';
    
    console.log(`iOS Haptic: ${type}`);
    
    // Simulated haptic patterns for different types
    switch (type) {
      case HapticFeedbackType.LIGHT:
        // Light impact
        break;
      case HapticFeedbackType.MEDIUM:
        // Medium impact
        break;
      case HapticFeedbackType.HEAVY:
        // Heavy impact
        break;
      case HapticFeedbackType.SUCCESS:
        // Success notification
        break;
      case HapticFeedbackType.WARNING:
        // Warning notification
        break;
      case HapticFeedbackType.ERROR:
        // Error notification
        break;
      case HapticFeedbackType.SELECTION:
        // Selection feedback
        break;
    }
  }

  private triggerAndroid(type: HapticFeedbackType) {
    // In a real implementation, you would use:
    // import { vibrate } from 'react-native';
    
    console.log(`Android Haptic: ${type}`);
    
    // Simulated vibration patterns for different types
    const patterns = {
      [HapticFeedbackType.LIGHT]: [0, 50],
      [HapticFeedbackType.MEDIUM]: [0, 100],
      [HapticFeedbackType.HEAVY]: [0, 150],
      [HapticFeedbackType.SUCCESS]: [0, 50, 50, 50],
      [HapticFeedbackType.WARNING]: [0, 100, 50, 100],
      [HapticFeedbackType.ERROR]: [0, 150, 100, 150],
      [HapticFeedbackType.SELECTION]: [0, 25],
    };

    // vibrate(patterns[type] || [0, 50]);
  }

  // Convenience methods
  light() {
    this.trigger(HapticFeedbackType.LIGHT);
  }

  medium() {
    this.trigger(HapticFeedbackType.MEDIUM);
  }

  heavy() {
    this.trigger(HapticFeedbackType.HEAVY);
  }

  success() {
    this.trigger(HapticFeedbackType.SUCCESS);
  }

  warning() {
    this.trigger(HapticFeedbackType.WARNING);
  }

  error() {
    this.trigger(HapticFeedbackType.ERROR);
  }

  selection() {
    this.trigger(HapticFeedbackType.SELECTION);
  }
}

export const haptics = new HapticManager();

// Hook for React components
export const useHaptics = () => {
  return {
    triggerLight: () => haptics.light(),
    triggerMedium: () => haptics.medium(),
    triggerHeavy: () => haptics.heavy(),
    triggerSuccess: () => haptics.success(),
    triggerWarning: () => haptics.warning(),
    triggerError: () => haptics.error(),
    triggerSelection: () => haptics.selection(),
  };
};
