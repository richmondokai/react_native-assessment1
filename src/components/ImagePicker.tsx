import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';
import { useHaptics } from '../utils/haptics';

interface ImagePickerProps {
  currentImage?: string;
  onImageSelected: (imageUri: string) => void;
  placeholder?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImagePicker: React.FC<ImagePickerProps> = ({
  currentImage,
  onImageSelected,
  placeholder = 'Tap to add photo',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const colors = useColors();
  const styles = createStyles(colors);
  const { triggerLight, triggerSuccess } = useHaptics();

  const showImagePicker = () => {
    triggerLight();
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const handleCameraPress = () => {
    triggerSuccess();
    hideModal();
    
    // In a real implementation, you would use react-native-image-picker
    // For demo purposes, we'll use a placeholder
    Alert.alert(
      'Camera',
      'Camera functionality would be implemented here using react-native-image-picker or expo-image-picker',
      [
        {
          text: 'Use Demo Image',
          onPress: () => {
            const demoImage = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`;
            onImageSelected(demoImage);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleGalleryPress = () => {
    triggerSuccess();
    hideModal();
    
    // In a real implementation, you would use react-native-image-picker
    Alert.alert(
      'Gallery',
      'Gallery functionality would be implemented here using react-native-image-picker or expo-image-picker',
      [
        {
          text: 'Use Demo Image',
          onPress: () => {
            const demoImage = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99) + 1}.jpg`;
            onImageSelected(demoImage);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleUrlPress = () => {
    triggerSuccess();
    hideModal();
    
    Alert.prompt(
      'Image URL',
      'Enter the URL of the image:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use URL',
          onPress: (url) => {
            if (url && url.trim()) {
              onImageSelected(url.trim());
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={showImagePicker}
        activeOpacity={0.7}
      >
        {currentImage && !imageError ? (
          <Image
            source={{ uri: currentImage }}
            style={styles.image}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
        )}
        
        {/* Edit overlay */}
        <View style={styles.editOverlay}>
          <Text style={styles.editText}>Edit</Text>
        </View>
      </TouchableOpacity>

      {/* Image picker modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Photo Source</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleCameraPress}
            >
              <Text style={styles.modalOptionIcon}>📷</Text>
              <Text style={styles.modalOptionText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleGalleryPress}
            >
              <Text style={styles.modalOptionIcon}>🖼️</Text>
              <Text style={styles.modalOptionText}>Photo Library</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleUrlPress}
            >
              <Text style={styles.modalOptionIcon}>🔗</Text>
              <Text style={styles.modalOptionText}>Web URL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalOption, styles.cancelOption]}
              onPress={hideModal}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: spacing.md,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  placeholderText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  modalOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
  },
  cancelOption: {
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});

export default ImagePicker;
