import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
  FlatList,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-deck-swiper';
import { COLORS, SPACING, COUNTRIES, LANGUAGES, GENDERS } from '../../src/constants/theme';
import { discoverAPI, subscriptionAPI } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import SwipeCard from '../../src/components/SwipeCard';
import MatchModal from '../../src/components/MatchModal';

const BACKGROUND_IMAGE = require('../../assets/images/background.png');

const { width } = Dimensions.get('window');
const GAMLY_LOGO = 'https://customer-assets.emergentagent.com/job_427702e9-a7ed-42fa-8909-2fb145a92115/artifacts/wocpz9ef_Sans%20fond.png';

interface Profile {
  id: string;
  nickname_hidden: string;
  age?: number;
  gender?: string;
  country?: string;
  console?: string;
  games?: string[];
  interests?: string[];
  languages?: string[];
  looking_for?: string;
  photo?: string;
  bio?: string;
  common_games?: string[];
  common_interests?: string[];
  common_count?: number;
}

interface Filters {
  gender?: string;
  country?: string;
  language?: string;
}

export default function DiscoverScreen() {
  const { user } = useAuthStore();
  const swiperRef = useRef<Swiper<Profile>>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [swipesRemaining, setSwipesRemaining] = useState(5);
  const [isPremium, setIsPremium] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [tempFilters, setTempFilters] = useState<Filters>({});
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = COUNTRIES.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const loadProfiles = useCallback(async (appliedFilters?: Filters) => {
    try {
      setIsLoading(true);
      const [profilesRes, subRes] = await Promise.all([
        discoverAPI.getProfiles(appliedFilters || filters),
        subscriptionAPI.getStatus(),
      ]);
      setProfiles(profilesRes.data);
      setSwipesRemaining(subRes.data.swipes_remaining);
      setIsPremium(subRes.data.is_premium);
      setCardIndex(0);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Check if profile is complete
    if (user && !user.profile_complete) {
      router.replace('/onboarding');
      return;
    }
    loadProfiles();
  }, [user]);

  const handleSwipe = async (direction: 'left' | 'right', index: number) => {
    const profile = profiles[index];
    if (!profile) return;

    const action = direction === 'right' ? 'like' : 'dislike';
    
    try {
      const response = await discoverAPI.swipe(profile.id, action);
      setSwipesRemaining(response.data.swipes_remaining);
      
      if (response.data.is_match && response.data.match_data) {
        setMatchData(response.data.match_data);
        setShowMatchModal(true);
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        Alert.alert(
          'Limite atteinte!',
          'Tu as utilisé tes 5 swipes gratuits du jour. Passe Premium pour des swipes illimités!',
          [
            { text: 'Plus tard', style: 'cancel' },
            { text: 'Voir Premium', onPress: () => router.push('/subscription') },
          ]
        );
      }
    }
  };

  const handleLike = () => {
    if (!isPremium && swipesRemaining <= 0) {
      Alert.alert(
        'Limite atteinte!',
        'Tu as utilisé tes 5 swipes gratuits du jour.',
        [
          { text: 'Plus tard', style: 'cancel' },
          { text: 'Voir Premium', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }
    swiperRef.current?.swipeRight();
  };

  const handleDislike = () => {
    if (!isPremium && swipesRemaining <= 0) {
      Alert.alert('Limite atteinte!', 'Tu as utilisé tes 5 swipes gratuits du jour.');
      return;
    }
    swiperRef.current?.swipeLeft();
  };

  const handleMatchClose = () => {
    setShowMatchModal(false);
    setMatchData(null);
  };

  const handleMatchChat = () => {
    setShowMatchModal(false);
    if (matchData?.match_id) {
      router.push(`/chat/${matchData.match_id}`);
    }
  };

  const openFilters = () => {
    setTempFilters({ ...filters });
    setShowFilters(true);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
    loadProfiles(tempFilters);
  };

  const clearFilters = () => {
    setTempFilters({});
  };

  const hasActiveFilters = filters.gender || filters.country || filters.language;

  if (isLoading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay}>
          <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.pink} />
              <Text style={styles.loadingText}>Chargement des profils...</Text>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
      {/* Header with Large Logo and Halo */}
      <View style={styles.header}>
        <View style={styles.headerLogoContainer}>
          {/* Halo glow effect */}
          <Image
            source={{ uri: GAMLY_LOGO }}
            style={styles.headerLogoGlow}
            resizeMode="contain"
            blurRadius={20}
          />
          <Image
            source={{ uri: GAMLY_LOGO }}
            style={styles.headerLogoGlow2}
            resizeMode="contain"
            blurRadius={35}
          />
          <Image source={{ uri: GAMLY_LOGO }} style={styles.headerLogo} resizeMode="contain" />
        </View>
        <View style={styles.headerRight}>
          {!isPremium && (
            <View style={styles.swipeCounter}>
              <Ionicons name="flame" size={16} color={COLORS.blue} />
              <Text style={styles.swipeCounterText}>{swipesRemaining}/3</Text>
            </View>
          )}
          <TouchableOpacity 
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]} 
            onPress={openFilters}
          >
            <Ionicons name="options" size={22} color={hasActiveFilters ? 'white' : COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/subscription')}>
            <Ionicons 
              name={isPremium ? 'star' : 'star-outline'} 
              size={24} 
              color={isPremium ? COLORS.warning : COLORS.textMuted} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active filters display */}
      {hasActiveFilters && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Filtres:</Text>
          {filters.gender && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>{filters.gender}</Text>
            </View>
          )}
          {filters.country && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>{filters.country}</Text>
            </View>
          )}
          {filters.language && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>{LANGUAGES.find(l => l.id === filters.language)?.label}</Text>
            </View>
          )}
        </View>
      )}

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        {profiles.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={profiles}
            cardIndex={cardIndex}
            renderCard={(card) => card ? <SwipeCard profile={card} /> : null}
            onSwipedLeft={(index) => handleSwipe('left', index)}
            onSwipedRight={(index) => handleSwipe('right', index)}
            onSwipedAll={() => {
              setProfiles([]);
            }}
            cardVerticalMargin={20}
            cardHorizontalMargin={20}
            backgroundColor="transparent"
            stackSize={3}
            stackScale={5}
            stackSeparation={14}
            animateCardOpacity
            disableTopSwipe
            disableBottomSwipe
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: COLORS.error,
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 'bold',
                    borderRadius: 10,
                    padding: 10,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: COLORS.success,
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 'bold',
                    borderRadius: 10,
                    padding: 10,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="game-controller-outline" size={80} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Plus de profils!</Text>
            <Text style={styles.emptySubtitle}>
              {hasActiveFilters 
                ? 'Essaie de modifier tes filtres pour voir plus de profils'
                : 'Reviens plus tard pour découvrir de nouveaux gamers'}
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={() => loadProfiles()}>
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.refreshButtonText}>Actualiser</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action buttons */}
      {profiles.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.dislikeButton]}
            onPress={handleDislike}
          >
            <Ionicons name="close" size={32} color={COLORS.blue} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}
          >
            <Ionicons name="heart" size={32} color={COLORS.pink} />
          </TouchableOpacity>
        </View>
      )}

      {/* Match Modal */}
      <MatchModal
        visible={showMatchModal}
        matchData={matchData}
        onClose={handleMatchClose}
        onChat={handleMatchChat}
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres de recherche</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Gender filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Je recherche</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[styles.filterOption, !tempFilters.gender && styles.filterOptionActive]}
                    onPress={() => setTempFilters(f => ({ ...f, gender: undefined }))}
                  >
                    <Text style={[styles.filterOptionText, !tempFilters.gender && styles.filterOptionTextActive]}>
                      Tous
                    </Text>
                  </TouchableOpacity>
                  {GENDERS.slice(0, 2).map((g) => (
                    <TouchableOpacity
                      key={g.id}
                      style={[styles.filterOption, tempFilters.gender === g.id && styles.filterOptionActive]}
                      onPress={() => setTempFilters(f => ({ ...f, gender: g.id }))}
                    >
                      <Text style={[styles.filterOptionText, tempFilters.gender === g.id && styles.filterOptionTextActive]}>
                        {g.label}s
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Country filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Pays</Text>
                <TouchableOpacity 
                  style={styles.countrySelector}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Ionicons name="location-outline" size={20} color={COLORS.textMuted} />
                  <Text style={[
                    styles.countrySelectorText,
                    tempFilters.country && styles.countrySelectorTextActive
                  ]}>
                    {tempFilters.country || 'Tous les pays'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Language filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Langue parlée</Text>
                <View style={styles.languageOptions}>
                  <TouchableOpacity
                    style={[styles.languageOption, !tempFilters.language && styles.languageOptionActive]}
                    onPress={() => setTempFilters(f => ({ ...f, language: undefined }))}
                  >
                    <Text style={styles.languageFlag}>🌍</Text>
                    <Text style={[styles.languageLabel, !tempFilters.language && styles.languageLabelActive]}>
                      Toutes
                    </Text>
                  </TouchableOpacity>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.id}
                      style={[styles.languageOption, tempFilters.language === lang.id && styles.languageOptionActive]}
                      onPress={() => setTempFilters(f => ({ ...f, language: lang.id }))}
                    >
                      <Text style={styles.languageFlag}>{lang.flag}</Text>
                      <Text style={[styles.languageLabel, tempFilters.language === lang.id && styles.languageLabelActive]}>
                        {lang.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Modal actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Réinitialiser</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.countryModalOverlay}>
          <View style={styles.countryModalContent}>
            <View style={styles.countryModalHeader}>
              <Text style={styles.countryModalTitle}>Choisir un pays</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {/* Search input */}
            <View style={styles.countrySearchContainer}>
              <Ionicons name="search" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.countrySearchInput}
                placeholder="Rechercher un pays..."
                placeholderTextColor={COLORS.textMuted}
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoCorrect={false}
              />
              {countrySearch.length > 0 && (
                <TouchableOpacity onPress={() => setCountrySearch('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Country list */}
            <FlatList
              data={[{ id: 'all', name: 'Tous les pays' }, ...filteredCountries.map(c => ({ id: c, name: c }))]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    (item.id === 'all' ? !tempFilters.country : tempFilters.country === item.name) && styles.countryItemActive
                  ]}
                  onPress={() => {
                    setTempFilters(f => ({ ...f, country: item.id === 'all' ? undefined : item.name }));
                    setShowCountryPicker(false);
                    setCountrySearch('');
                  }}
                >
                  <Text style={[
                    styles.countryItemText,
                    (item.id === 'all' ? !tempFilters.country : tempFilters.country === item.name) && styles.countryItemTextActive
                  ]}>
                    {item.name}
                  </Text>
                  {(item.id === 'all' ? !tempFilters.country : tempFilters.country === item.name) && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerLogoContainer: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogoGlow: {
    position: 'absolute',
    width: 115,
    height: 115,
    opacity: 0.8,
  },
  headerLogoGlow2: {
    position: 'absolute',
    width: 130,
    height: 130,
    opacity: 0.5,
  },
  headerLogo: {
    width: 100,
    height: 100,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  swipeCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    gap: 4,
  },
  swipeCounterText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  activeFiltersLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  filterTag: {
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterTagText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  swiperContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 24,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dislikeButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.blue,
  },
  likeButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.pink,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalScroll: {
    padding: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardLight,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  filterOptionTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  horizontalOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.cardLight,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.cardLight,
    borderRadius: 20,
    gap: SPACING.xs,
  },
  languageOptionActive: {
    backgroundColor: COLORS.primary,
  },
  languageFlag: {
    fontSize: 16,
  },
  languageLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  languageLabelActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clearButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardLight,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  applyButton: {
    flex: 2,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Country selector styles
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardLight,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  countrySelectorText: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 16,
  },
  countrySelectorTextActive: {
    color: COLORS.text,
    fontWeight: '500',
  },
  // Country picker modal styles
  countryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  countryModalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  countryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  countrySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardLight,
    margin: SPACING.lg,
    marginBottom: 0,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  countrySearchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryItemActive: {
    backgroundColor: COLORS.primary + '20',
  },
  countryItemText: {
    color: COLORS.text,
    fontSize: 16,
  },
  countryItemTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
