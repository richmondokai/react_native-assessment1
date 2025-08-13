import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Profile } from '../types/Profile';
import ImagePicker from './ImagePicker';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

interface AddProfileFormProps {
  onAddProfile: (profile: Omit<Profile, 'id'>) => void;
  onCancel: () => void;
}

const AddProfileForm: React.FC<AddProfileFormProps> = ({
  onAddProfile,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    linkedin: '',
    twitter: '',
    github: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const colors = useColors();
  const styles = createStyles(colors);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }

    if (!formData.avatar.trim()) {
      newErrors.avatar = 'Avatar URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    const newProfile: Omit<Profile, 'id'> = {
      name: formData.name.trim(),
      title: formData.title.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      bio: formData.bio.trim(),
      avatar: formData.avatar.trim(),
      socialMedia: {
        ...(formData.linkedin.trim() && { linkedin: formData.linkedin.trim() }),
        ...(formData.twitter.trim() && { twitter: formData.twitter.trim() }),
        ...(formData.github.trim() && { github: formData.github.trim() }),
      },
    };

    onAddProfile(newProfile);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderInput = (
    field: string,
    label: string,
    placeholder: string,
    multiline = false,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'url' = 'default'
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError,
        ]}
        value={formData[field as keyof typeof formData]}
        onChangeText={value => updateFormData(field, value)}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        autoCorrect={keyboardType === 'email-address' || keyboardType === 'url' ? false : true}
      />
      {errors[field] ? (
        <Text style={styles.errorText}>{errors[field]}</Text>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Profile</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {renderInput('name', 'Full Name *', 'Enter full name')}
        {renderInput('title', 'Job Title *', 'Enter job title')}
        {renderInput('email', 'Email *', 'Enter email address', false, 'email-address')}
        {renderInput('phone', 'Phone *', 'Enter phone number', false, 'phone-pad')}
        {renderInput('bio', 'Bio *', 'Tell us about yourself...', true)}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profile Photo *</Text>
          <ImagePicker
            currentImage={formData.avatar}
            onImageSelected={(imageUri) => updateFormData('avatar', imageUri)}
            placeholder="Add profile photo"
          />
          {errors.avatar ? (
            <Text style={styles.errorText}>{errors.avatar}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Social Media (Optional)</Text>
        {renderInput('linkedin', 'LinkedIn', 'Enter LinkedIn URL', false, 'url')}
        {renderInput('twitter', 'Twitter', 'Enter Twitter URL', false, 'url')}
        {renderInput('github', 'GitHub', 'Enter GitHub URL', false, 'url')}

        <View style={styles.footer}>
          <Text style={styles.footerText}>* Required fields</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  cancelButton: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  saveButton: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily,
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  inputGroup: {
    marginVertical: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    backgroundColor: colors.card,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.danger,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily,
  },
});

export default AddProfileForm;
