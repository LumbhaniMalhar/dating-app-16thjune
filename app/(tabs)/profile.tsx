import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, ViewStyle, TextStyle, Dimensions, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import ImageViewing from 'react-native-image-viewing';
import CustomImagePicker from '@/components/CustomImagePicker';
import { useRouter } from 'expo-router';
import ProfileViewCard from '@/components/ProfileViewCard';

const { width } = Dimensions.get('window');

const PROFILE_PLACEHOLDER = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face';

type ProfileImage = {
  id: string;
  uri: string;
};

type ProfileField = {
  id: string;
  label: string;
  value: string;
  editable: boolean;
  icon: string;
  type: 'text' | 'textarea' | 'tags' | 'select';
  placeholder: string;
  options?: string[];
};

type ProfileSection = {
  id: string;
  title: string;
  fields: ProfileField[];
};

export default function ProfileTab() {
  const colors = Colors.light;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'edit' | 'view'>('edit');
  const [isEditing, setIsEditing] = useState(true); // Always in edit mode when on edit tab
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [currentField, setCurrentField] = useState<ProfileField | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // Sample profile images
  const [profileImages, setProfileImages] = useState<ProfileImage[]>([
    { id: '1', uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face' },
    { id: '4', uri: '' },
    { id: '5', uri: '' },
    { id: '6', uri: '' },
  ]);
  
  const [profileSections, setProfileSections] = useState<ProfileSection[]>([
    {
      id: 'basic',
      title: 'Basic Information',
      fields: [
        { id: 'name', label: 'Name', value: 'Alex Johnson', editable: true, icon: 'person', type: 'text', placeholder: 'Enter your name' },
        { id: 'age', label: 'Age', value: '28', editable: true, icon: 'calendar', type: 'text', placeholder: 'Enter your age' },
        { id: 'location', label: 'Location', value: 'San Francisco, CA', editable: true, icon: 'location', type: 'text', placeholder: 'Enter your location' },
        { id: 'occupation', label: 'Occupation', value: 'Software Engineer', editable: true, icon: 'briefcase', type: 'text', placeholder: 'What do you do?' },
        { id: 'education', label: 'Education', value: 'Stanford University', editable: true, icon: 'school', type: 'text', placeholder: 'Where did you study?' },
      ]
    },
    {
      id: 'about',
      title: 'About Me',
      fields: [
        { id: 'bio', label: 'Bio', value: 'Adventure seeker, coffee lover, and tech enthusiast. I love exploring new places, trying different cuisines, and having meaningful conversations. Looking for someone who shares my passion for life and growth!', editable: true, icon: 'document-text', type: 'textarea', placeholder: 'Tell us about yourself...' },
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      fields: [
        { id: 'interests', label: 'Interests', value: 'Hiking, Photography, Cooking, Travel, Reading, Music', editable: true, icon: 'heart', type: 'tags', placeholder: 'Add your interests' },
        { 
          id: 'looking_for', 
          label: 'Looking for', 
          value: 'Long-term relationship', 
          editable: true, 
          icon: 'search', 
          type: 'select', 
          placeholder: 'What are you looking for?',
          options: ['Long-term relationship', 'Short-term relationship', 'Friendship', 'Casual dating', 'Marriage', 'Not sure yet']
        },
        { id: 'deal_breakers', label: 'Deal breakers', value: 'Dishonesty, Lack of ambition', editable: true, icon: 'close-circle', type: 'tags', placeholder: 'What are your deal breakers?' },
      ]
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      fields: [
        { id: 'height', label: 'Height', value: '5\'8"', editable: true, icon: 'resize', type: 'text', placeholder: 'Enter your height' },
        { 
          id: 'gym', 
          label: 'Gym', 
          value: 'Regular', 
          editable: true, 
          icon: 'fitness', 
          type: 'select', 
          placeholder: 'How often do you go to the gym?',
          options: ['Never', 'Sometimes', 'Regular', 'Very active', 'Athlete']
        },
        { id: 'smoking', label: 'Smoking', value: 'Non-smoker', editable: true, icon: 'cigarette', type: 'text', placeholder: 'Smoking preference' },
        { id: 'drinking', label: 'Drinking', value: 'Socially', editable: true, icon: 'wine', type: 'text', placeholder: 'Drinking preference' },
        { id: 'religion', label: 'Religion', value: 'Spiritual but not religious', editable: true, icon: 'church', type: 'text', placeholder: 'Religious beliefs' },
      ]
    }
  ]);

  const handleFieldChange = (sectionId: string, fieldId: string, value: string) => {
    setProfileSections(prevSections =>
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              fields: section.fields.map(field => 
                field.id === fieldId ? { ...field, value } : field
              )
            }
          : section
      )
    );
  };

  const toggleEdit = () => {
    // Auto-save functionality - changes are saved immediately
    setIsEditing(!isEditing);
  };

  const handleImagePress = (imageId: string) => {
    if (isEditing) {
      setSelectedImageId(imageId);
      setShowImagePicker(true);
    }
  };

  const handleAddImage = () => {
    // Find the first empty image slot to add at the next available position
    const emptyImage = profileImages.find(img => !img.uri);
    if (emptyImage) {
      setSelectedImageId(emptyImage.id);
      setShowImagePicker(true);
    }
  };

  const handleImageSelected = (uri: string) => {
    if (selectedImageId) {
      setProfileImages(prevImages =>
        prevImages.map(img => 
          img.id === selectedImageId ? { ...img, uri } : img
        )
      );
      setSelectedImageId(null);
    }
  };

  const handleImagePickerClose = () => {
    setShowImagePicker(false);
    setSelectedImageId(null);
  };

  const handleImageDeleted = () => {
    if (selectedImageId) {
      setProfileImages(prevImages =>
        prevImages.map(img => 
          img.id === selectedImageId ? { ...img, uri: '' } : img
        )
      );
      setSelectedImageId(null);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setImageToDelete(imageId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteImage = () => {
    if (imageToDelete) {
      setProfileImages(prevImages =>
        prevImages.map(img => 
          img.id === imageToDelete ? { ...img, uri: '' } : img
        )
      );
      setImageToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDeleteImage = () => {
    setImageToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleFieldPress = (field: ProfileField, sectionId: string) => {
    if (isEditing && field.editable) {
      if (field.type === 'select') {
        setCurrentField(field);
        setShowOptionsModal(true);
      } else {
        setEditingField(`${sectionId}-${field.id}`);
        setEditingValue(field.value);
      }
    }
  };

  const handleSaveField = (sectionId: string, fieldId: string) => {
    handleFieldChange(sectionId, fieldId, editingValue);
    setEditingField(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const handleOptionSelect = (option: string) => {
    if (currentField) {
      const [sectionId, fieldId] = editingField?.split('-') || [];
      if (sectionId && fieldId) {
        handleFieldChange(sectionId, fieldId, option);
      }
    }
    setShowOptionsModal(false);
    setCurrentField(null);
  };

  const renderField = (field: ProfileField, sectionId: string) => {
    const isCurrentlyEditing = editingField === `${sectionId}-${field.id}`;

    if (isCurrentlyEditing) {
      return (
        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabel}>
            <Ionicons 
              name={field.icon as any} 
              size={18} 
              color={colors.primary} 
              style={styles.fieldIcon} 
            />
            <Text style={[styles.fieldLabelText, { color: colors.textSecondary }]}>
              {field.label}
            </Text>
          </View>
          {field.type === 'textarea' ? (
            <TextInput
              style={[styles.textarea, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.card 
              }]}
              value={editingValue}
              onChangeText={setEditingValue}
              placeholderTextColor={colors.placeholder}
              placeholder={field.placeholder}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />
          ) : (
            <TextInput
              style={[styles.input, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.card 
              }]}
              value={editingValue}
              onChangeText={setEditingValue}
              placeholderTextColor={colors.placeholder}
              placeholder={field.placeholder}
              autoFocus
            />
          )}
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={() => handleSaveField(sectionId, field.id)}
            >
              <Ionicons name="checkmark" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.dangerRed }]}
              onPress={handleCancelEdit}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.fieldRow}
          onPress={() => handleFieldPress(field, sectionId)}
        >
          <View style={styles.fieldInfo}>
            <View style={styles.fieldLabel}>
              <Ionicons 
                name={field.icon as any} 
                size={18} 
                color={colors.primary} 
                style={styles.fieldIcon} 
              />
              <Text style={[styles.fieldLabelText, { color: colors.textSecondary }]}>
                {field.label}
              </Text>
            </View>
            <Text 
              style={[styles.fieldValue, { color: colors.text }]}
              numberOfLines={field.type === 'textarea' ? 3 : 1}
              ellipsizeMode="tail"
            >
              {field.value}
            </Text>
          </View>
          {isEditing && field.editable && (
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={colors.textTertiary} 
            />
          )}
        </TouchableOpacity>
      );
    }
  };

  const renderEditTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Profile Images Section */}
      <View style={styles.imagesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          My Photos & Videos
        </Text>
        <View style={styles.imagesGrid}>
          {(() => {
            // Filter out images with empty URIs and get only images with URIs
            const imagesWithUri = profileImages.filter(img => img.uri);
            
            // Create an array of 6 slots
            const slots = Array.from({ length: 6 }, (_, index) => {
              if (index < imagesWithUri.length) {
                // This slot has an image
                const image = imagesWithUri[index];
                return (
                  <TouchableOpacity
                    key={image.id}
                    style={styles.imageContainer}
                    onPress={() => handleImagePress(image.id)}
                  >
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: image.uri }} style={styles.gridImage} />
                      {isEditing && (
                        <View style={styles.imageOverlay}>
                          <Ionicons name="camera" size={20} color="white" />
                        </View>
                      )}
                      {isEditing && (
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => handleRemoveImage(image.id)}
                        >
                          <Ionicons name="close" size={12} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              } else {
                // This slot is empty
                return (
                  <TouchableOpacity
                    key={`empty-${index}`}
                    style={styles.imageContainer}
                    onPress={handleAddImage}
                  >
                    <View style={[styles.addImageButton, { backgroundColor: colors.imagePlaceholder }]}>
                      <Ionicons name="add" size={24} color={colors.textSecondary} />
                    </View>
                  </TouchableOpacity>
                );
              }
            });
            
            return slots;
          })()}
        </View>
        <Text style={[styles.imagesHint, { color: colors.textSecondary }]}>
          Tap to add/replace images
        </Text>
      </View>

      {/* Profile Sections */}
      {profileSections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            {section.fields.map((field) => (
              <View key={field.id} style={styles.fieldWrapper}>
                {renderField(field, section.id)}
              </View>
            ))}
          </View>
        </View>
      ))}


    </ScrollView>
  );

  const renderViewTab = () => {
    const imagesWithUri = profileImages.filter(img => img.uri).map(img => img.uri);
    const sectionsSlim = profileSections.map(s => ({ id: s.id, fields: s.fields.map(f => ({ id: f.id, value: f.value })) }));

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.viewTabContent}>
        <ProfileViewCard images={imagesWithUri} sections={sectionsSlim} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {profileSections.find(s => s.id === 'basic')?.fields.find(f => f.id === 'name')?.value || 'Profile'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.primary }]}>
            • 100%
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'edit' && { borderBottomColor: colors.tabActive }
          ]}
          onPress={() => {
            setActiveTab('edit');
            setIsEditing(true);
          }}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'edit' ? colors.tabActive : colors.tabInactive }
          ]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'view' && { borderBottomColor: colors.tabActive }
          ]}
          onPress={() => {
            setActiveTab('view');
            setIsEditing(false);
          }}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'view' ? colors.tabActive : colors.tabInactive }
          ]}>
            View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'edit' ? renderEditTab() : renderViewTab()}

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {currentField?.label}
              </Text>
              <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {currentField?.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionItem}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    {option}
                  </Text>
                  {currentField?.value === option && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <CustomImagePicker
        visible={showImagePicker}
        onClose={handleImagePickerClose}
        onImageSelected={handleImageSelected}
        onImageDeleted={handleImageDeleted}
        hasExistingImage={selectedImageId ? !!profileImages.find(img => img.id === selectedImageId)?.uri : false}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        transparent
        animationType="fade"
        onRequestClose={cancelDeleteImage}
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
                onPress={cancelDeleteImage}
              >
                <Text style={[styles.confirmationButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, { backgroundColor: colors.dangerRed }]}
                onPress={confirmDeleteImage}
              >
                <Text style={styles.confirmationButtonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  viewTabContent: {
    paddingBottom: 40,
  },
  imagesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageContainer: {
    width: (width - 56) / 3,
    height: (width - 56) / 3,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 2,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesHint: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionContent: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 26,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginTop: 8,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginTop: 8,
    minHeight: 100,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 8,
  },
  // View tab styles
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mainImageContainer: {
    height: 400,
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  mainImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileAge: {
    fontSize: 18,
    marginBottom: 16,
  },
  quickInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  profileBio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  interestsContainer: {
    marginBottom: 20,
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lookingForContainer: {
    marginBottom: 20,
  },
  lookingForTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  lookingForText: {
    fontSize: 16,
    lineHeight: 22,
  },
  lifestyleContainer: {
    marginBottom: 20,
  },
  lifestyleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  lifestyleItems: {
    gap: 8,
  },
  lifestyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lifestyleText: {
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 16,
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
