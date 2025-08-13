import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Profile } from '../types/Profile';
import ProfileCard from './ProfileCard';
import SearchBar from './SearchBar';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface ProfileListProps {
  profiles: Profile[];
  onDeleteProfile: (id: string) => void;
  onAddProfile: () => void;
  onLongPress?: (profile: Profile, position: { x: number; y: number }) => void;
  isAddFormVisible: boolean;
}

const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  onDeleteProfile,
  onAddProfile,
  onLongPress,
  isAddFormVisible,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Calculate number of columns based on screen size and orientation
  const getNumColumns = () => {
    const { width, height } = screenData;
    const isLandscape = width > height;
    const isTablet = Math.min(width, height) >= 600; // Consider 600+ as tablet
    
    if (isTablet) {
      return isLandscape ? 3 : 2; // 3 columns in landscape, 2 in portrait on tablet
    } else {
      return isLandscape ? 2 : 1; // 2 columns in landscape, 1 in portrait on phone
    }
  };

  const numColumns = getNumColumns();

  // Filter profiles based on search query
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) {
      return profiles;
    }

    const query = searchQuery.toLowerCase();
    return profiles.filter(
      profile =>
        profile.name.toLowerCase().includes(query) ||
        profile.title.toLowerCase().includes(query) ||
        profile.email.toLowerCase().includes(query) ||
        profile.bio.toLowerCase().includes(query)
    );
  }, [profiles, searchQuery]);

  const handleDeleteProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete ${profile?.name}'s profile?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteProfile(id),
        },
      ]
    );
  };

  const renderProfile = ({ item }: { item: Profile }) => (
    <View>
      <ProfileCard 
        profile={item} 
        onDelete={handleDeleteProfile}
        onLongPress={onLongPress}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search profiles..."
      />
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[
            styles.addButton, 
            isAddFormVisible && styles.addButtonPressed
          ]} 
          onPress={onAddProfile}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.addButtonText,
            isAddFormVisible && styles.addButtonTextPressed
          ]}>
            Add Profile
          </Text>
        </TouchableOpacity>
        <Text style={styles.resultCount}>
          {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'}
          {searchQuery ? ` found for "${searchQuery}"` : ''}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No profiles found' : 'No profiles yet'}
      </Text>
      <Text style={styles.emptyStateMessage}>
        {searchQuery
          ? `No profiles match "${searchQuery}". Try a different search term.`
          : 'Add your first profile to get started.'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={[
            styles.addButton, 
            isAddFormVisible && styles.addButtonPressed
          ]} 
          onPress={onAddProfile}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.addButtonText,
            isAddFormVisible && styles.addButtonTextPressed
          ]}>
            Add First Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProfiles}
        renderItem={renderProfile}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        numColumns={numColumns}
        key={numColumns} // Force re-render when columns change
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xs, // Add horizontal padding for grid layout
  },
  header: {
    backgroundColor: colors.white,
    paddingBottom: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.black,
  },
  addButtonPressed: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  addButtonText: {
    color: colors.black,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
  },
  addButtonTextPressed: {
    color: colors.white,
  },
  resultCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },
  emptyStateTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily,
  },
});

export default ProfileList;
