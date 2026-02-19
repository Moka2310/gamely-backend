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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../../src/constants/theme';
import { matchesAPI } from '../../src/services/api';

// Gradient Title with Halo effect - White text with gradient halo
const GradientTitle = ({ children }: { children: string }) => (
  <View style={styles.gradientTitleWrapper}>
    {/* Pink halo layer */}
    <Text style={styles.titleHaloPink}>{children}</Text>
    {/* Blue halo layer */}
    <Text style={styles.titleHaloBlue}>{children}</Text>
    {/* Main white text */}
    <Text style={styles.gradientTitleText}>{children}</Text>
  </View>
);

interface Match {
  id: string;
  user: {
    id: string;
    nickname: string;
    photo?: string;
    console?: string;
  };
  matched_at: string;
  last_message?: {
    content: string;
    timestamp: string;
    is_mine: boolean;
  } | null;
}

export default function MessagesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = useCallback(async () => {
    try {
      const response = await matchesAPI.getMatches();
      // Filter to only show matches with messages or all matches for chat
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const renderConversation = ({ item }: { item: Match }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        {item.user.photo ? (
          <Image source={{ uri: item.user.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.noAvatar]}>
            <Ionicons name="person" size={24} color={COLORS.textMuted} />
          </View>
        )}
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.user.nickname}</Text>
          {item.last_message && (
            <Text style={styles.conversationTime}>
              {formatTime(item.last_message.timestamp)}
            </Text>
          )}
        </View>
        
        <Text style={styles.conversationPreview} numberOfLines={1}>
          {item.last_message 
            ? `${item.last_message.is_mine ? 'Vous: ' : ''}${item.last_message.content}`
            : 'Nouveau match! Dites bonjour'
          }
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <GradientTitle>Messages</GradientTitle>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Pas de conversations</Text>
          <Text style={styles.emptySubtitle}>Trouve des matchs pour commencer à discuter!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderConversation}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  gradientTitleWrapper: {
    position: 'relative',
  },
  titleHalo: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.pink,
    opacity: 0.4,
  },
  titleHalo2: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.blue,
    opacity: 0.3,
    left: 2,
  },
  titleMask: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  gradientTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.pink,
  },
  gradientTitleContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.lg,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  noAvatar: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  conversationTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  conversationPreview: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
});
