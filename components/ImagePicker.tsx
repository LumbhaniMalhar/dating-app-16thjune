import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface ImagePickerProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
}

// Configurable aspect ratio - you can easily change this
const ASPECT_RATIO: [number, number] = [2.5, 3];

export default function CustomImagePicker({ visible, onClose, onImageSelected }: ImagePickerProps) {
  const colors = Colors.light;
  const [isProcessing, setIsProcessing] = useState(false);

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

  const processImage = async (uri: string) => {
    try {
      setIsProcessing(true);
      
      // Get image dimensions first
      const imageInfo = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      const targetAspectRatio = ASPECT_RATIO[0] / ASPECT_RATIO[1];
      let cropWidth = imageInfo.width;
      let cropHeight = imageInfo.height;

      if (imageInfo.width / imageInfo.height > targetAspectRatio) {
        // Image is wider than target ratio, crop width
        cropWidth = imageInfo.height * targetAspectRatio;
        cropHeight = imageInfo.height;
      } else {
        // Image is taller than target ratio, crop height
        cropWidth = imageInfo.width;
        cropHeight = imageInfo.width / targetAspectRatio;
      }

      // Calculate crop position (center crop)
      const cropX = (imageInfo.width - cropWidth) / 2;
      const cropY = (imageInfo.height - cropHeight) / 2;

      // Crop and resize the image
      const processedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropWidth,
              height: cropHeight,
            },
          },
          {
            resize: {
              width: ASPECT_RATIO[0] * 200,
              height: ASPECT_RATIO[1] * 200,
            },
          },
        ],
        {
          format: ImageManipulator.SaveFormat.JPEG,
          // quality: 0.8,
        }
      );

      onImageSelected(processedImage.uri);
      onClose();
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // We'll handle cropping ourselves
        aspect: ASPECT_RATIO,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await processImage(result.assets[0].uri);
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
        allowsEditing: false, // We'll handle cropping ourselves
        aspect: ASPECT_RATIO,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await processImage(result.assets[0].uri);
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
            <TouchableOpacity onPress={onClose} disabled={isProcessing}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.primary }]}
              onPress={takePhoto}
              disabled={isProcessing}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.secondary }]}
              onPress={pickFromGallery}
              disabled={isProcessing}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.primary }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            {isProcessing && (
              <View style={styles.processingContainer}>
                <Text style={[styles.processingText, { color: colors.textSecondary }]}>
                  Processing image...
                </Text>
              </View>
            )}
          </View>

          {/* <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Photos will be cropped to 3:2 ratio for optimal display
            </Text>
          </View> */}
        </View>
      </View>
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
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingText: {
    fontSize: 14,
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
}); 