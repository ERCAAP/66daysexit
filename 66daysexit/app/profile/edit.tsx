import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { useAuthStore } from '../../src/stores/authStore';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile, updateUserProfile } = useAuthStore();
  
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setHasChanges(true);
    switch (field) {
      case 'displayName':
        setDisplayName(value);
        break;
      case 'email':
        setEmail(value);
        break;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update user profile
      updateUserProfile({
        displayName: displayName.trim() || undefined,
        email: email.trim() || undefined,
      });
      
      setHasChanges(false);
      Alert.alert(
        'Success',
        'Your profile has been updated successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoPress = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => {} },
        { text: 'Photo Library', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradients.background.colors as [string, string, ...string[]]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Profile Photo Section */}
          <Card variant="glass" style={styles.photoCard}>
            <View style={styles.photoSection}>
              <TouchableOpacity 
                style={styles.photoContainer}
                onPress={handlePhotoPress}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(displayName)}
                  </Text>
                </View>
                <View style={styles.photoEditButton}>
                  <Ionicons 
                    name="camera" 
                    size={16} 
                    color={theme.colors.text.inverse} 
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.photoHint}>
                Tap to change profile photo
              </Text>
            </View>
          </Card>

          {/* Profile Information */}
          <Card variant="glass" style={styles.formCard}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            
            <View style={styles.form}>
              {/* Display Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your display name"
                  placeholderTextColor={theme.colors.text.muted}
                  value={displayName}
                  onChangeText={(value) => handleInputChange('displayName', value)}
                  autoCapitalize="words"
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  placeholder="Email address"
                  placeholderTextColor={theme.colors.text.muted}
                  value={email}
                  editable={false}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.inputHint}>
                  Email cannot be changed here. Contact support for email changes.
                </Text>
              </View>
            </View>
          </Card>

          {/* Account Stats */}
          <Card variant="glass" style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Account Stats</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile?.level || 1}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile?.currentDay || 1}</Text>
                <Text style={styles.statLabel}>Day</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile?.streak || 0}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile?.xp || 0}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
            </View>
            
            <Text style={styles.statsNote}>
              Your progress and achievements are automatically tracked
            </Text>
          </Card>

          {/* Save Button */}
          <View style={styles.saveSection}>
            <Button
              title="Save Changes"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              disabled={!hasChanges}
              onPress={handleSave}
              style={[
                styles.saveButton,
                !hasChanges && styles.saveButtonDisabled
              ]}
            />
            
            {hasChanges && (
              <Text style={styles.changesNote}>
                You have unsaved changes
              </Text>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  photoCard: {
    marginBottom: theme.spacing.lg,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
  },
  photoEditButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.secondary.start,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  photoHint: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.lg,
  },
  inputContainer: {
    gap: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  input: {
    height: 48,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.surface.primary,
  },
  inputHint: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  statsNote: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  saveSection: {
    alignItems: 'center',
  },
  saveButton: {
    marginBottom: theme.spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  changesNote: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning.start,
    textAlign: 'center',
  },
}); 