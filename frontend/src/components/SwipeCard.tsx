import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, CONSOLES } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.65;

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

interface SwipeCardProps {
  profile: Profile;
}

export default function SwipeCard({ profile }: SwipeCardProps) {
  const consoleInfo = CONSOLES.find(c => c.id === profile.console);
  
  const getLookingForLabel = (id?: string) => {
    const options: Record<string, string> = {
      ami_occasionnel: 'Ami Occasionnel',
      ami_team: 'Ami de Team',
      ami_regulier: 'Ami Régulier',
    };
    return id ? options[id] || id : '';
  };

  return (
    <View style={styles.card}>
      {/* Photo */}
      <View style={styles.photoContainer}>
        {profile.photo ? (
          <Image source={{ uri: profile.photo }} style={styles.photo} />
        ) : (
          <View style={styles.noPhoto}>
            <Ionicons name="person" size={80} color={COLORS.textMuted} />
          </View>
        )}
        
        {/* Overlay with basic info */}
        <View style={styles.photoOverlay}>
          <View style={styles.basicInfo}>
            <Text style={styles.nickname}>{profile.nickname_hidden}</Text>
            <Text style={styles.ageLocation}>
              {profile.age && `${profile.age} ans`}
              {profile.country && ` • ${profile.country}`}
            </Text>
          </View>
          
          {/* Console badge */}
          {consoleInfo && (
            <View style={[styles.consoleBadge, { backgroundColor: consoleInfo.color }]}>
              <Ionicons name={consoleInfo.icon as any} size={16} color="white" />
              <Text style={styles.consoleName}>{consoleInfo.name}</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Info section */}
      <ScrollView style={styles.infoSection} showsVerticalScrollIndicator={false}>
        {/* Looking for */}
        {profile.looking_for && (
          <View style={styles.infoRow}>
            <Ionicons name="search" size={16} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Recherche:</Text>
            <Text style={styles.infoValue}>{getLookingForLabel(profile.looking_for)}</Text>
          </View>
        )}
        
        {/* Common interests indicator */}
        {profile.common_count && profile.common_count > 0 && (
          <View style={styles.commonSection}>
            <Ionicons name="heart" size={16} color={COLORS.match} />
            <Text style={styles.commonText}>
              {profile.common_count} point{profile.common_count > 1 ? 's' : ''} en commun!
            </Text>
          </View>
        )}
        
        {/* Common games */}
        {profile.common_games && profile.common_games.length > 0 && (
          <View style={styles.tagSection}>
            <Text style={styles.tagTitle}>Jeux en commun:</Text>
            <View style={styles.tags}>
              {profile.common_games.map((game, i) => (
                <View key={i} style={[styles.tag, styles.commonTag]}>
                  <Text style={styles.tagText}>{game}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Games */}
        {profile.games && profile.games.length > 0 && (
          <View style={styles.tagSection}>
            <Text style={styles.tagTitle}>Jeux:</Text>
            <View style={styles.tags}>
              {profile.games.slice(0, 6).map((game, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{game}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <View style={styles.tagSection}>
            <Text style={styles.tagTitle}>Intérêts:</Text>
            <View style={styles.tags}>
              {profile.interests.map((interest, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Bio */}
        {profile.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  photoContainer: {
    width: '100%',
    height: '55%',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  basicInfo: {
    marginBottom: 8,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ageLocation: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  consoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  consoleName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  infoSection: {
    flex: 1,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  commonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,105,180,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  commonText: {
    color: COLORS.match,
    fontWeight: '600',
  },
  tagSection: {
    marginBottom: 12,
  },
  tagTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.cardLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  commonTag: {
    backgroundColor: 'rgba(255,105,180,0.2)',
    borderWidth: 1,
    borderColor: COLORS.match,
  },
  tagText: {
    color: COLORS.text,
    fontSize: 12,
  },
  bioSection: {
    marginTop: 4,
  },
  bioText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
