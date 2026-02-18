import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { COLORS, SPACING } from '../../src/constants/theme';
import { discoverAPI, subscriptionAPI } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';
import SwipeCard from '../../src/components/SwipeCard';
import MatchModal from '../../src/components/MatchModal';

const { width } = Dimensions.get('window');

interface Profile {
  id: string;
  nickname_hidden: string;
  age?: number;
  gender?: string;
  country?: string;
  console?: string;
  games?: string[];
  interests?: string[];
  looking_for?: string;
  photo?: string;
  bio?: string;
  common_games?: string[];
  common_interests?: string[];
  common_count?: number;
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

  const loadProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profilesRes, subRes] = await Promise.all([
        discoverAPI.getProfiles(),
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
  }, []);

  useEffect(() => {
    // Check if profile is complete
    if (user && !user.profile_complete) {
      router.replace('/onboarding');
      return;
    }
    loadProfiles();
  }, [user, loadProfiles]);

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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des profils...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="game-controller" size={28} color={COLORS.primary} />
          <Text style={styles.headerTitle}>GamerSwipe</Text>
        </View>
        <View style={styles.headerRight}>
          {!isPremium && (
            <View style={styles.swipeCounter}>
              <Ionicons name="flame" size={16} color={COLORS.primary} />
              <Text style={styles.swipeCounterText}>{swipesRemaining}/5</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => router.push('/subscription')}>
            <Ionicons 
              name={isPremium ? 'star' : 'star-outline'} 
              size={24} 
              color={isPremium ? COLORS.warning : COLORS.textMuted} 
            />
          </TouchableOpacity>
        </View>
      </View>

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
            <Text style={styles.emptySubtitle}>Reviens plus tard pour découvrir de nouveaux gamers</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={loadProfiles}>
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
            <Ionicons name="close" size={32} color={COLORS.error} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}
          >
            <Ionicons name="heart" size={32} color={COLORS.success} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    borderColor: COLORS.error,
  },
  likeButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
});
