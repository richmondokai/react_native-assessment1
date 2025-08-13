import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
  Animated,
} from 'react-native';
import { Profile } from '../types/Profile';
import ProfileCard from './ProfileCard';
import EnhancedSearchBar, { SearchFilters } from './EnhancedSearchBar';
import SkeletonLoader from './SkeletonLoader';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';
import { useHaptics } from '../utils/haptics';

interface PullToRefreshProfileListProps {
  profiles: Profile[];
  onDeleteProfile: (id: string) => void;
  onAddProfile: () => void;
  onLongPress?: (profile: Profile, position: { x: number; y: number }) => void;
  onRefresh?: () => Promise<void>;
  isAddFormVisible: boolean;
  isLoading?: boolean;
}

const PullToRefreshProfileList: React.FC<PullToRefreshProfileListProps> = ({
  profiles,
  onDeleteProfile,
  onAddProfile,
  onLongPress,
  onRefresh,
  isAddFormVisible,
  isLoading = false,
}) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    showSuggestions: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const fadeAnimation = React.useRef(new Animated.Value(1)).current;
  
  const colors = useColors();
  const styles = createStyles(colors);
  const { triggerSuccess, triggerLight } = useHaptics();

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
    const isTablet = Math.min(width, height) >= 600;
    
    if (isTablet) {
      return isLandscape ? 3 : 2;
    } else {
      return isLandscape ? 2 : 1;
    }
  };

  const numColumns = getNumColumns();

  // Enhanced filter function with multiple criteria
  const filteredProfiles = useMemo(() => {
    if (!searchFilters.searchTerm.trim()) {
      return profiles;
    }

    const query = searchFilters.searchTerm.toLowerCase();
    return profiles.filter(profile => {
      // Search in multiple fields
      const searchableText = [
        profile.name,
        profile.title,
        profile.email,
        profile.bio,
        profile.phone,
        // Extract company from email domain
        profile.email.split('@')[1]?.split('.')[0] || '',
        // Social media handles
        ...Object.values(profile.socialMedia).filter(Boolean),
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });
  }, [profiles, searchFilters.searchTerm]);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    triggerLight();
    
    try {
      await onRefresh();
      triggerSuccess();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, triggerLight, triggerSuccess]);

  const handleDeleteProfile = useCallback((id: string) => {
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
          onPress: () => {
            // Fade out animation before deletion
            Animated.timing(fadeAnimation, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onDeleteProfile(id);
              fadeAnimation.setValue(1);
            });
          },
        },
      ]
    );
  }, [profiles, onDeleteProfile, fadeAnimation]);

  const renderProfile = useCallback(({ item }: { item: Profile }) => (
    <Animated.View style={{ opacity: fadeAnimation }}>
      <ProfileCard 
        profile={item} 
        onDelete={handleDeleteProfile}
        onLongPress={onLongPress}
      />
    </Animated.View>
  ), [handleDeleteProfile, onLongPress, fadeAnimation]);

  const renderHeader = () => (
    <View style={styles.header}>
      <EnhancedSearchBar
        value={searchFilters.searchTerm}
        onChangeText={(text) => setSearchFilters(prev => ({ ...prev, searchTerm: text }))}
        onFilterChange={setSearchFilters}
        profiles={profiles}
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
          {searchFilters.searchTerm ? ` found for "${searchFilters.searchTerm}"` : ''}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {searchFilters.searchTerm ? 'No profiles found' : 'No profiles yet'}
      </Text>
      <Text style={styles.emptyStateMessage}>
        {searchFilters.searchTerm
          ? `No profiles match "${searchFilters.searchTerm}". Try a different search term.`
          : 'Add your first profile to get started.'}
      </Text>
      {!searchFilters.searchTerm && (
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <SkeletonLoader count={5} variant="card" />
      </View>
    );
  }

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
        key={numColumns}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.white}
            />
          ) : undefined
        }
      />
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  header: {
    backgroundColor: colors.card,
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
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textPrimary,
  },
  addButtonPressed: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
  },
  addButtonTextPressed: {
    color: colors.card,
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

export default PullToRefreshProfileList;
