import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Configurable aspect ratio - you can easily change this
const ASPECT_RATIO: [number, number] = [2.5, 3];

interface ImagePickerProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
  onImageDeleted?: () => void;
  hasExistingImage?: boolean;
}

export default function CustomImagePicker({ visible, onClose, onImageSelected, onImageDeleted, hasExistingImage }: ImagePickerProps) {
  const colors = Colors.light;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera and photo library permissions are required to add photos to your profile.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };



  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enable built-in cropping
        aspect: ASPECT_RATIO,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // User has already cropped the image, so we can use it directly
        onImageSelected(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enable built-in cropping
        aspect: ASPECT_RATIO,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // User has already cropped the image, so we can use it directly
        onImageSelected(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Photo
            </Text>
            <View style={styles.headerActions}>
              {onImageDeleted && hasExistingImage && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => setShowDeleteConfirmation(true)}
                >
                  <Ionicons name="trash" size={20} color={colors.dangerRed} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.primary }]}
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.secondary }]}
              onPress={pickFromGallery}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.primary }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Photos will be cropped to 3:2.5 ratio for optimal display
            </Text>
          </View> */}
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirmation(false)}
      >
        <View style={styles.confirmationOverlay}>
          <View style={[styles.confirmationContent, { backgroundColor: colors.card }]}>
            <View style={styles.confirmationHeader}>
              <Ionicons name="warning" size={24} color={colors.dangerRed} />
              <Text style={[styles.confirmationTitle, { color: colors.text }]}>
                Delete Photo
              </Text>
            </View>
            <Text style={[styles.confirmationMessage, { color: colors.textSecondary }]}>
              Are you sure you want to delete this photo? This action cannot be undone.
            </Text>
            <View style={styles.confirmationActions}>
              <TouchableOpacity
                style={[styles.confirmationButton, { backgroundColor: colors.border }]}
                onPress={() => setShowDeleteConfirmation(false)}
              >
                <Text style={[styles.confirmationButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, { backgroundColor: colors.dangerRed }]}
                onPress={() => {
                  if (onImageDeleted) {
                    onImageDeleted();
                  }
                  setShowDeleteConfirmation(false);
                  onClose();
                }}
              >
                <Text style={styles.confirmationButtonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Confirmation modal styles
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationContent: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    maxWidth: 320,
  },
  confirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmationMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 