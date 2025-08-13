/**
 * Personal Profile Card Application
 * React Native Assessment Project
 * 
 * Features:
 * - Display multiple user profiles with FlatList
 * - Search functionality
 * - Add/Remove profiles
 * - Responsive design with platform-specific styling
 * - Interactive contact buttons
 * 
 * @format
 */

import React, { useState, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import PullToRefreshProfileList from './src/components/PullToRefreshProfileList';
import AddProfileForm from './src/components/AddProfileForm';
import FloatingActionButton from './src/components/FloatingActionButton';
import QuickActionsMenu from './src/components/QuickActionsMenu';
import ThemeToggleButton from './src/components/ThemeToggleButton';
import { Profile } from './src/types/Profile';
import { mockProfiles } from './src/data/mockProfiles';
import { ThemeProvider, useColors, useTheme } from './src/context/ThemeContext';
import { useHaptics } from './src/utils/haptics';
import { spacing } from './src/styles/spacing';

const AppContent: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickActionsMenu, setQuickActionsMenu] = useState<{
    visible: boolean;
    profile: Profile | null;
    position: { x: number; y: number };
  }>({
    visible: false,
    profile: null,
    position: { x: 0, y: 0 },
  });
  
  const { theme } = useTheme();
  const colors = useColors();
  const { triggerSuccess, triggerError } = useHaptics();

  const handleAddProfile = useCallback((newProfileData: Omit<Profile, 'id'>) => {
    const newProfile: Profile = {
      ...newProfileData,
      id: Date.now().toString(), // Simple ID generation for demo
    };
    
    setProfiles(prevProfiles => [newProfile, ...prevProfiles]);
    setShowAddForm(false);
    triggerSuccess();
  }, [triggerSuccess]);

  const handleDeleteProfile = useCallback((id: string) => {
    setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== id));
    triggerSuccess();
  }, [triggerSuccess]);

  const handleEditProfile = useCallback((profile: Profile) => {
    // For now, just show an alert. In a full implementation, you'd open an edit form
    Alert.alert(
      'Edit Profile',
      `Edit functionality for ${profile.name} would be implemented here.`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleShareProfile = useCallback((profile: Profile) => {
    Alert.alert(
      'Share Profile',
      `Share ${profile.name}'s profile via social media, email, or messaging.`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleShowAddForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleCancelAddForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleLongPress = useCallback((profile: Profile, position: { x: number; y: number }) => {
    setQuickActionsMenu({
      visible: true,
      profile,
      position,
    });
  }, []);

  const closeQuickActionsMenu = useCallback(() => {
    setQuickActionsMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would fetch fresh data from your API here
    // For demo purposes, we'll just trigger success haptic
    triggerSuccess();
    
    setIsLoading(false);
  }, [triggerSuccess]);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
        <PullToRefreshProfileList
          profiles={profiles}
          onDeleteProfile={handleDeleteProfile}
          onAddProfile={handleShowAddForm}
          onLongPress={handleLongPress}
          onRefresh={handleRefresh}
          isAddFormVisible={showAddForm}
          isLoading={isLoading}
        />
        
        {/* Theme Toggle - positioned in top-right */}
        <View style={styles.themeToggle}>
          <ThemeToggleButton />
        </View>

        {/* Floating Action Button */}
        <FloatingActionButton
          onAddProfile={handleShowAddForm}
        />
        
        {/* Quick Actions Menu */}
        {quickActionsMenu.profile && (
          <QuickActionsMenu
            visible={quickActionsMenu.visible}
            profile={quickActionsMenu.profile}
            position={quickActionsMenu.position}
            onClose={closeQuickActionsMenu}
            onEdit={handleEditProfile}
            onDelete={handleDeleteProfile}
            onShare={handleShareProfile}
          />
        )}
        
        <Modal
          visible={showAddForm}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCancelAddForm}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <AddProfileForm
              onAddProfile={handleAddProfile}
              onCancel={handleCancelAddForm}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: spacing.md,
    zIndex: 999,
  },
});

export default App;
