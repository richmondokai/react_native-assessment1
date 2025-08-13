import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  Animated,
  ScrollView,
} from 'react-native';
import { Profile } from '../types/Profile';
import { useColors } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

interface EnhancedSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  profiles: Profile[];
  placeholder?: string;
}

export interface SearchFilters {
  searchTerm: string;
  showSuggestions: boolean;
  selectedSuggestion?: string;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  value,
  onChangeText,
  onFilterChange,
  profiles,
  placeholder = 'Search profiles...',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const colors = useColors();
  const styles = createStyles(colors);

  useEffect(() => {
    if (value.length > 0) {
      generateSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, profiles]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showSuggestions && suggestions.length > 0 ? Math.min(suggestions.length * 44, 176) : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showSuggestions, suggestions, animatedHeight]);

  const generateSuggestions = (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const suggestionSet = new Set<string>();

    profiles.forEach(profile => {
      // Name suggestions
      if (profile.name.toLowerCase().includes(term)) {
        suggestionSet.add(profile.name);
      }

      // Title suggestions
      if (profile.title.toLowerCase().includes(term)) {
        suggestionSet.add(profile.title);
      }

      // Company suggestions (extracted from email domain)
      const domain = profile.email.split('@')[1];
      if (domain && domain.toLowerCase().includes(term)) {
        const company = domain.split('.')[0];
        suggestionSet.add(company.charAt(0).toUpperCase() + company.slice(1));
      }

      // Skills/keywords from bio
      const bioWords = profile.bio.toLowerCase().split(/\s+/);
      bioWords.forEach(word => {
        if (word.length > 3 && word.includes(term)) {
          suggestionSet.add(word.charAt(0).toUpperCase() + word.slice(1));
        }
      });
    });

    const suggestionArray = Array.from(suggestionSet).slice(0, 5);
    setSuggestions(suggestionArray);
    setShowSuggestions(suggestionArray.length > 0 && isFocused);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleSuggestionPress = (suggestion: string) => {
    onChangeText(suggestion);
    onFilterChange({
      searchTerm: suggestion,
      showSuggestions: false,
      selectedSuggestion: suggestion,
    });
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onChangeText('');
    onFilterChange({
      searchTerm: '',
      showSuggestions: false,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    onFilterChange({
      searchTerm: text,
      showSuggestions: text.length >= 2,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          numberOfLines={1}
          multiline={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search suggestions */}
      <Animated.View
        style={[
          styles.suggestionsContainer,
          {
            height: animatedHeight,
            opacity: animatedHeight.interpolate({
              inputRange: [0, 44],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <ScrollView
          style={styles.suggestionsList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={`${suggestion}-${index}`}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
              <Text style={styles.suggestionIcon}>↗</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Quick filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {getQuickFilters().map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterChip,
              value === filter && styles.filterChipActive,
            ]}
            onPress={() => handleChangeText(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                value === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getQuickFilters = (): string[] => {
  return [
    'Developer',
    'Designer',
    'Engineer',
    'Manager',
    'Data',
    'Mobile',
    'Frontend',
    'Backend',
  ];
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  clearButtonText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 18,
  },
  suggestionsContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    flex: 1,
  },
  suggestionIcon: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  filtersContainer: {
    marginTop: spacing.sm,
  },
  filtersContent: {
    paddingRight: spacing.md,
  },
  filterChip: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: colors.white,
  },
});

export default EnhancedSearchBar;
