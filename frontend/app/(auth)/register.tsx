import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !nickname) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (nickname.length < 3) {
      Alert.alert('Erreur', 'Le nickname doit contenir au moins 3 caractères');
      return;
    }
    
    const success = await register(email.trim().toLowerCase(), password, nickname.trim());
    if (success) {
      router.replace('/onboarding');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoins la communauté GamerSwipe</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={clearError}>
                  <Ionicons name="close" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Nickname (sera masqué jusqu'au match)"
                placeholderTextColor={COLORS.textMuted}
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={COLORS.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SPACING.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 56,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
