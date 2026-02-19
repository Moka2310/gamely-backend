import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, CONSOLES, LOOKING_FOR_OPTIONS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';
import { profileAPI, subscriptionAPI, authAPI } from '../../src/services/api';

// Gradient Title with Halo effect
const GradientTitle = ({ children }: { children: string }) => (
  <View style={styles.gradientTitleWrapper}>
    {/* Halo/Glow effect behind text */}
    <Text style={styles.titleHalo}>{children}</Text>
    {/* Gradient text using MaskedView */}
    <MaskedView
      maskElement={<Text style={styles.titleMask}>{children}</Text>}
    >
      <LinearGradient
        colors={[COLORS.pink, COLORS.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.titleMask, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  </View>
);

// Gradient Button Component
const GradientButton = ({ onPress, children, style }: any) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <LinearGradient
      colors={[COLORS.pink, COLORS.blue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientButton}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await subscriptionAPI.getStatus();
      setIsPremium(response.data.is_premium);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission requise', "Veuillez autoriser l'accès à la galerie");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setIsLoading(true);
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const response = await profileAPI.update({ photo: base64Image });
        updateUser(response.data);
        Alert.alert('Succès', 'Photo mise à jour!');
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible de mettre à jour la photo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const getConsoleInfo = () => {
    return CONSOLES.find(c => c.id === user?.console);
  };

  const getLookingForLabel = () => {
    const option = LOOKING_FOR_OPTIONS.find(o => o.id === user?.looking_for);
    return option?.label || '';
  };

  const consoleInfo = getConsoleInfo();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.pink} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <GradientTitle>Mon Profil</GradientTitle>
          <TouchableOpacity onPress={() => router.push('/edit-profile')}>
            <Ionicons name="create-outline" size={24} color={COLORS.blue} />
          </TouchableOpacity>
        </View>

        {/* Profile Photo with Halo Gradient */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handleUpdatePhoto} disabled={isLoading}>
            <View style={styles.photoContainer}>
              {/* Halo Gradient Ring */}
              <LinearGradient
                colors={[COLORS.pink, COLORS.blue, COLORS.pink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.haloGradient}
              />
              <View style={styles.photoInnerContainer}>
                {user.photo ? (
                  <Image source={{ uri: user.photo }} style={styles.photo} />
                ) : (
                  <View style={[styles.photo, styles.noPhoto]}>
                    <Ionicons name="person" size={50} color={COLORS.textMuted} />
                  </View>
                )}
              </View>
              <View style={styles.editPhotoButton}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="camera" size={16} color="white" />
                )}
              </View>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.nicknameHidden}>
            Affiché comme: {user.nickname_hidden || '***'}
          </Text>
          
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {/* Console */}
          {consoleInfo && (
            <View style={[styles.infoCard, { borderLeftColor: consoleInfo.color }]}>
              <Ionicons name={consoleInfo.icon as any} size={24} color={consoleInfo.color} />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Plateforme</Text>
                <Text style={styles.infoCardValue}>{consoleInfo.name}</Text>
              </View>
            </View>
          )}

          {/* Age & Gender */}
          <View style={[styles.infoCard, { borderLeftColor: COLORS.pink }]}>
            <Ionicons name="person-outline" size={24} color={COLORS.pink} />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>Informations</Text>
              <Text style={styles.infoCardValue}>
                {user.age} ans • {user.gender?.charAt(0).toUpperCase()}{user.gender?.slice(1)}
              </Text>
            </View>
          </View>

          {/* Country */}
          {user.country && (
            <View style={[styles.infoCard, { borderLeftColor: COLORS.blue }]}>
              <Ionicons name="location-outline" size={24} color={COLORS.blue} />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Pays</Text>
                <Text style={styles.infoCardValue}>{user.country}</Text>
              </View>
            </View>
          )}

          {/* Looking for */}
          {user.looking_for && (
            <View style={[styles.infoCard, { borderLeftColor: COLORS.pink }]}>
              <Ionicons name="search-outline" size={24} color={COLORS.pink} />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Recherche</Text>
                <Text style={styles.infoCardValue}>{getLookingForLabel()}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Games */}
        {user.games && user.games.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="game-controller" size={20} color={COLORS.blue} />
              <Text style={styles.sectionTitle}>Mes Jeux</Text>
            </View>
            <View style={styles.tags}>
              {user.games.map((game, i) => (
                <View key={i} style={[styles.tag, styles.tagBlue]}>
                  <Text style={styles.tagText}>{game}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color={COLORS.pink} />
              <Text style={styles.sectionTitle}>Mes Intérêts</Text>
            </View>
            <View style={styles.tags}>
              {user.interests.map((interest, i) => (
                <View key={i} style={[styles.tag, styles.tagPink]}>
                  <Text style={styles.tagText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {user.languages && user.languages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubble" size={20} color={COLORS.blue} />
              <Text style={styles.sectionTitle}>Langues</Text>
            </View>
            <View style={styles.tags}>
              {user.languages.map((lang, i) => (
                <View key={i} style={[styles.tag, styles.tagBlue]}>
                  <Text style={styles.tagText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bio */}
        {user.bio && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color={COLORS.pink} />
              <Text style={styles.sectionTitle}>À propos</Text>
            </View>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {/* Actions with Gradient Buttons */}
        <View style={styles.actionsSection}>
          <GradientButton onPress={() => router.push('/subscription')}>
            <Ionicons name="star" size={20} color="white" />
            <Text style={styles.gradientButtonText}>Abonnement Premium</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </GradientButton>

          <GradientButton onPress={() => router.push('/edit-profile')}>
            <Ionicons name="create" size={20} color="white" />
            <Text style={styles.gradientButtonText}>Modifier le profil</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </GradientButton>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
            <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  gradientTitleWrapper: {
    position: 'relative',
  },
  titleHalo: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.pink,
    opacity: 0.3,
    textShadowColor: COLORS.pink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  titleMask: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  gradientTitleContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  gradientTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  photoContainer: {
    position: 'relative',
    width: 134,
    height: 134,
    justifyContent: 'center',
    alignItems: 'center',
  },
  haloGradient: {
    position: 'absolute',
    width: 134,
    height: 134,
    borderRadius: 67,
  },
  photoInnerContainer: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  noPhoto: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  nicknameHidden: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,217,61,0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  premiumText: {
    color: COLORS.warning,
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
    borderLeftWidth: 3,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  infoCardValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  tagBlue: {
    backgroundColor: COLORS.blue + '20',
    borderWidth: 1,
    borderColor: COLORS.blue + '40',
  },
  tagPink: {
    backgroundColor: COLORS.pink + '20',
    borderWidth: 1,
    borderColor: COLORS.pink + '40',
  },
  tagText: {
    color: COLORS.text,
    fontSize: 14,
  },
  bioText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsSection: {
    padding: SPACING.lg,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
  },
  gradientButtonText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  logoutButton: {
    marginTop: SPACING.md,
  },
});
