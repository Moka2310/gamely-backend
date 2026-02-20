import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, CONSOLES } from '../../src/constants/theme';
import { matchesAPI } from '../../src/services/api';

const BACKGROUND_IMAGE = require('../../assets/images/background.png');

// Gradient Title with Halo effect - White text with gradient halo
const GradientTitle = ({ children }: { children: string }) => (
  <Text style={styles.gradientTitleText}>{children}</Text>
);

interface Match {
  id: string;
  user: {
    id: string;
    nickname: string;
    photo?: string;
    console?: string;
    country?: string;
  };
  matched_at: string;
  last_message?: {
    content: string;
    timestamp: string;
    is_mine: boolean;
  } | null;
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = useCallback(async () => {
    try {
      const response = await matchesAPI.getMatches();
      setMatches(response.data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const getConsoleColor = (consoleId?: string) => {
    const console_ = CONSOLES.find(c => c.id === consoleId);
    return console_?.color || COLORS.textMuted;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.matchPhotoContainer}>
        {item.user.photo ? (
          <Image source={{ uri: item.user.photo }} style={styles.matchPhoto} />
        ) : (
          <View style={[styles.matchPhoto, styles.noPhoto]}>
            <Ionicons name="person" size={30} color={COLORS.textMuted} />
          </View>
        )}
        <View style={[styles.consoleDot, { backgroundColor: getConsoleColor(item.user.console) }]} />
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.user.nickname}</Text>
          <Text style={styles.matchDate}>{formatDate(item.matched_at)}</Text>
        </View>
        
        {item.user.country && (
          <Text style={styles.matchCountry}>{item.user.country}</Text>
        )}
        
        {item.last_message ? (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message.is_mine ? 'Vous: ' : ''}
            {item.last_message.content}
          </Text>
        ) : (
          <Text style={styles.noMessage}>Envoyez le premier message!</Text>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <GradientTitle>Mes Matchs</GradientTitle>
          <View style={styles.matchCount}>
            <Ionicons name="people" size={16} color={COLORS.blue} />
            <Text style={styles.matchCountText}>{matches.length}</Text>
          </View>
        </View>

        {matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="game-controller-outline" size={80} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Pas encore de match</Text>
            <Text style={styles.emptySubtitle}>Continue à swiper pour trouver des gamers!</Text>
            <TouchableOpacity
              style={styles.discoverButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Ionicons name="game-controller" size={20} color="white" />
              <Text style={styles.discoverButtonText}>Découvrir</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={matches}
            renderItem={renderMatch}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
          />
        )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerTitleMask: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  gradientTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadow: '2px 2px 8px #FF1493, -2px -2px 8px #00BFFF',
  },
  gradientTitleContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  matchCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    gap: SPACING.xs,
  },
  matchCountText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 16,
    gap: SPACING.md,
  },
  matchPhotoContainer: {
    position: 'relative',
  },
  matchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  noPhoto: {
    backgroundColor: COLORS.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consoleDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  matchDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  matchCountry: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  noMessage: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
    fontStyle: 'italic',
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
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 24,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  discoverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
