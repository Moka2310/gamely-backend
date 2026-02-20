import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, CONSOLES, LOOKING_FOR_OPTIONS, POPULAR_GAMES, POPULAR_INTERESTS, ALL_COUNTRIES, LANGUAGES } from '../src/constants/theme';
import { useAuthStore } from '../src/stores/authStore';
import { profileAPI } from '../src/services/api';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [country, setCountry] = useState(user?.country || '');
  const [console_, setConsole] = useState(user?.console || '');
  const [games, setGames] = useState<string[]>(user?.games || []);
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [languages, setLanguages] = useState<string[]>(user?.languages || []);
  const [lookingFor, setLookingFor] = useState(user?.looking_for || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Country modal state
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = ALL_COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

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

  const toggleLanguage = (lang: string) => {
    setLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('Erreur', 'Le nickname est requis');
      return;
    }
    
    setIsLoading(true);
    try {
      const profileData = {
        nickname: nickname.trim(),
        age: parseInt(age) || null,
        gender,
        country,
        console: console_,
        games,
        interests,
        languages,
        looking_for: lookingFor,
        bio: bio.trim(),
      };
      
      const response = await profileAPI.update(profileData);
      updateUser(response.data);
      Alert.alert('Succès', 'Profil mis à jour!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.detail || 'Impossible de sauvegarder');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCountryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.countryItem, country === item && styles.countryItemActive]}
      onPress={() => {
        setCountry(item);
        setShowCountryModal(false);
        setCountrySearch('');
      }}
    >
      <Text style={[styles.countryItemText, country === item && styles.countryItemTextActive]}>
        {item}
      </Text>
      {country === item && (
        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.saveButton}>Sauver</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nickname */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nickname</Text>
          <TextInput
            style={styles.textInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Votre nickname"
            placeholderTextColor={COLORS.textMuted}
          />
          <Text style={styles.hint}>Sera masqué jusqu'au match</Text>
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Âge</Text>
          <TextInput
            style={styles.textInput}
            value={age}
            onChangeText={setAge}
            placeholder="Votre âge"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <View style={styles.optionsRow}>
            {['homme', 'femme', 'autre'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.optionButton, gender === g && styles.optionButtonActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.optionButtonText, gender === g && styles.optionButtonTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Country - Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pays</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCountryModal(true)}
          >
            <Ionicons name="globe-outline" size={20} color={COLORS.textMuted} />
            <Text style={[styles.dropdownText, country && styles.dropdownTextSelected]}>
              {country || 'Sélectionner un pays'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langues parlées</Text>
          <View style={styles.chipsContainer}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.id}
                style={[styles.chip, languages.includes(lang.id) && styles.chipActive]}
                onPress={() => toggleLanguage(lang.id)}
              >
                <Text style={[styles.chipText, languages.includes(lang.id) && styles.chipTextActive]}>
                  {lang.flag} {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Console */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plateforme</Text>
          <View style={styles.consoleOptions}>
            {CONSOLES.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.consoleButton,
                  console_ === c.id && { borderColor: c.color, backgroundColor: c.color + '20' }
                ]}
                onPress={() => setConsole(c.id)}
              >
                <Ionicons name={c.icon as any} size={24} color={console_ === c.id ? c.color : COLORS.textMuted} />
                <Text style={[styles.consoleText, console_ === c.id && { color: c.color }]}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Looking for */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Je recherche</Text>
          {LOOKING_FOR_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.lookingForOption, lookingFor === option.id && styles.lookingForOptionActive]}
              onPress={() => setLookingFor(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={lookingFor === option.id ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={[styles.lookingForText, lookingFor === option.id && styles.lookingForTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jeux ({games.length} sélectionnés)</Text>
          <View style={styles.chipsContainer}>
            {POPULAR_GAMES.map((game) => (
              <TouchableOpacity
                key={game}
                style={[styles.chip, games.includes(game) && styles.chipActive]}
                onPress={() => toggleGame(game)}
              >
                <Text style={[styles.chipText, games.includes(game) && styles.chipTextActive]}>{game}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intérêts ({interests.length} sélectionnés)</Text>
          <View style={styles.chipsContainer}>
            {POPULAR_INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[styles.chip, interests.includes(interest) && styles.chipActive]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[styles.chipText, interests.includes(interest) && styles.chipTextActive]}>{interest}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <TextInput
            style={[styles.textInput, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Parlez de vous..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un pays</Text>
              <TouchableOpacity onPress={() => {
                setShowCountryModal(false);
                setCountrySearch('');
              }}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {/* Search input */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un pays..."
                placeholderTextColor={COLORS.textMuted}
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoFocus
              />
              {countrySearch.length > 0 && (
                <TouchableOpacity onPress={() => setCountrySearch('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={renderCountryItem}
              showsVerticalScrollIndicator={false}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
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
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  optionButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  optionButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  dropdownText: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 16,
  },
  dropdownTextSelected: {
    color: COLORS.text,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  chipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  consoleOptions: {
    gap: SPACING.sm,
  },
  consoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  consoleText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  lookingForOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  lookingForOptionActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  lookingForText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  lookingForTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: SPACING.xl,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
  },
  countryList: {
    paddingHorizontal: SPACING.md,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryItemActive: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: 8,
    marginVertical: 2,
  },
  countryItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  countryItemTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
