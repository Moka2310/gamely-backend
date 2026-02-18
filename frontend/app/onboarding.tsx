import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, CONSOLES, LOOKING_FOR_OPTIONS, POPULAR_GAMES, POPULAR_INTERESTS, COUNTRIES, LANGUAGES } from '../src/constants/theme';
import { useAuthStore } from '../src/stores/authStore';
import { profileAPI } from '../src/services/api';

export default function OnboardingScreen() {
  const { user, updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [photo, setPhoto] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [console_, setConsole] = useState('');
  const [games, setGames] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState('');
  const [bio, setBio] = useState('');

  const totalSteps = 6;

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission requise', 'Veuillez autoriser l\'accès à la caméra/galerie');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
          });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setPhoto(base64Image);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

  const toggleGame = (game: string) => {
    setGames(prev => 
      prev.includes(game) 
        ? prev.filter(g => g !== game)
        : [...prev, game]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleLanguage = (langId: string) => {
    setLanguages(prev => 
      prev.includes(langId) 
        ? prev.filter(l => l !== langId)
        : [...prev, langId]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return photo !== null;
      case 2: return age && gender && country;
      case 3: return console_ !== '';
      case 4: return games.length > 0;
      case 5: return languages.length > 0;
      case 6: return lookingFor !== '';
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const profileData = {
        photo,
        age: parseInt(age),
        gender,
        country,
        console: console_,
        games,
        interests,
        languages,
        looking_for: lookingFor,
        bio,
      };
      
      const response = await profileAPI.update(profileData);
      updateUser(response.data);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.detail || 'Impossible de sauvegarder le profil');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Photo de profil</Text>
            <Text style={styles.stepSubtitle}>Montre-toi aux autres gamers!</Text>
            
            <View style={styles.photoContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={60} color={COLORS.textMuted} />
                </View>
              )}
            </View>
            
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => pickImage(true)}
              >
                <Ionicons name="camera" size={24} color={COLORS.primary} />
                <Text style={styles.photoButtonText}>Caméra</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => pickImage(false)}
              >
                <Ionicons name="images" size={24} color={COLORS.primary} />
                <Text style={styles.photoButtonText}>Galerie</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Informations</Text>
            <Text style={styles.stepSubtitle}>Parle-nous de toi</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Âge</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ton âge"
                placeholderTextColor={COLORS.textMuted}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Genre</Text>
              <View style={styles.genderButtons}>
                {['homme', 'femme', 'autre'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderButton,
                      gender === g && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      gender === g && styles.genderButtonTextActive,
                    ]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pays</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.horizontalOptions}>
                  {COUNTRIES.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.optionChip,
                        country === c && styles.optionChipActive,
                      ]}
                      onPress={() => setCountry(c)}
                    >
                      <Text style={[
                        styles.optionChipText,
                        country === c && styles.optionChipTextActive,
                      ]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Ta plateforme</Text>
            <Text style={styles.stepSubtitle}>Sur quelle console joues-tu?</Text>
            
            <View style={styles.consoleOptions}>
              {CONSOLES.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.consoleCard,
                    console_ === c.id && { borderColor: c.color, borderWidth: 2 },
                  ]}
                  onPress={() => setConsole(c.id)}
                >
                  <View style={[styles.consoleIcon, { backgroundColor: c.color + '20' }]}>
                    <Ionicons name={c.icon as any} size={40} color={c.color} />
                  </View>
                  <Text style={styles.consoleName}>{c.name}</Text>
                  {console_ === c.id && (
                    <View style={[styles.consoleCheck, { backgroundColor: c.color }]}>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tes jeux favoris</Text>
            <Text style={styles.stepSubtitle}>Sélectionne au moins un jeu ({games.length} sélectionné{games.length > 1 ? 's' : ''})</Text>
            
            <ScrollView style={styles.gamesScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.gamesGrid}>
                {POPULAR_GAMES.map((game) => (
                  <TouchableOpacity
                    key={game}
                    style={[
                      styles.gameChip,
                      games.includes(game) && styles.gameChipActive,
                    ]}
                    onPress={() => toggleGame(game)}
                  >
                    <Text style={[
                      styles.gameChipText,
                      games.includes(game) && styles.gameChipTextActive,
                    ]}>{game}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>Tes intérêts</Text>
              <View style={styles.gamesGrid}>
                {POPULAR_INTERESTS.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.gameChip,
                      interests.includes(interest) && styles.gameChipActive,
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text style={[
                      styles.gameChipText,
                      interests.includes(interest) && styles.gameChipTextActive,
                    ]}>{interest}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Langues parlées</Text>
            <Text style={styles.stepSubtitle}>Sélectionne les langues que tu parles ({languages.length} sélectionnée{languages.length > 1 ? 's' : ''})</Text>
            
            <View style={styles.languageOptions}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.languageCard,
                    languages.includes(lang.id) && styles.languageCardActive,
                  ]}
                  onPress={() => toggleLanguage(lang.id)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageLabel,
                    languages.includes(lang.id) && styles.languageLabelActive,
                  ]}>{lang.label}</Text>
                  {languages.includes(lang.id) && (
                    <View style={styles.languageCheck}>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Que recherches-tu?</Text>
            <Text style={styles.stepSubtitle}>Quel type de gamer veux-tu rencontrer?</Text>
            
            <View style={styles.lookingForOptions}>
              {LOOKING_FOR_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.lookingForCard,
                    lookingFor === option.id && styles.lookingForCardActive,
                  ]}
                  onPress={() => setLookingFor(option.id)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={32}
                    color={lookingFor === option.id ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text style={[
                    styles.lookingForText,
                    lookingFor === option.id && styles.lookingForTextActive,
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio (optionnel)</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                placeholder="Dis quelque chose sur toi..."
                placeholderTextColor={COLORS.textMuted}
                value={bio}
                onChangeText={setBio}
                multiline
                maxLength={200}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Étape {step}/{totalSteps}</Text>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>
      
      {/* Navigation */}
      <View style={styles.navigation}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {step === totalSteps ? 'Terminer' : 'Suivant'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.card,
    borderRadius: 3,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stepSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  photoButtonText: {
    color: COLORS.text,
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  textInput: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
  },
  genderButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  genderButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  horizontalScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  horizontalOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  optionChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  optionChipActive: {
    backgroundColor: COLORS.primary,
  },
  optionChipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  optionChipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  consoleOptions: {
    gap: SPACING.md,
  },
  consoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 16,
    gap: SPACING.md,
  },
  consoleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consoleName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  consoleCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamesScroll: {
    flex: 1,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  gameChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  gameChipActive: {
    backgroundColor: COLORS.primary,
  },
  gameChipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  gameChipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  lookingForOptions: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  lookingForCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 16,
    gap: SPACING.md,
  },
  lookingForCardActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  lookingForText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  lookingForTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  languageOptions: {
    gap: SPACING.md,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 16,
    gap: SPACING.md,
  },
  languageCardActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  languageFlag: {
    fontSize: 28,
  },
  languageLabel: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  languageLabelActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  languageCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  backButton: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.card,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
