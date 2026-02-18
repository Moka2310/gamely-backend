import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../src/constants/theme';
import { subscriptionAPI } from '../src/services/api';
import { useAuthStore } from '../src/stores/authStore';

export default function SubscriptionScreen() {
  const { updateUser } = useAuthStore();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await subscriptionAPI.getStatus();
      setSubscription(response.data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    Alert.alert(
      'Devenir Premium',
      'Ceci est une simulation. Dans la version finale, vous serez redirigé vers le paiement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Simuler l\'achat',
          onPress: async () => {
            setIsUpgrading(true);
            try {
              await subscriptionAPI.upgrade();
              await loadSubscription();
              updateUser({ is_premium: true });
              Alert.alert('Félicitations!', 'Vous êtes maintenant Premium!');
            } catch (error) {
              Alert.alert('Erreur', "Impossible de mettre à niveau l'abonnement");
            } finally {
              setIsUpgrading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = async () => {
    Alert.alert(
      'Annuler Premium',
      'Êtes-vous sûr de vouloir annuler votre abonnement Premium?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              await subscriptionAPI.cancel();
              await loadSubscription();
              updateUser({ is_premium: false });
              Alert.alert('Abonnement annulé', 'Vous êtes revenu au plan gratuit.');
            } catch (error) {
              Alert.alert('Erreur', "Impossible d'annuler l'abonnement");
            }
          },
        },
      ]
    );
  };

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonnement</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Current Status */}
      <View style={styles.statusCard}>
        <View style={[styles.statusBadge, subscription?.is_premium && styles.premiumBadge]}>
          <Ionicons
            name={subscription?.is_premium ? 'star' : 'person'}
            size={24}
            color={subscription?.is_premium ? COLORS.warning : COLORS.textMuted}
          />
        </View>
        <Text style={styles.statusTitle}>
          {subscription?.is_premium ? 'Premium' : 'Gratuit'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {subscription?.is_premium
            ? 'Swipes illimités!'
            : `${subscription?.swipes_remaining || 0}/5 swipes restants aujourd'hui`}
        </Text>
      </View>

      {/* Features comparison */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Comparer les plans</Text>
        
        <View style={styles.featureRow}>
          <Text style={styles.featureName}>Swipes par jour</Text>
          <Text style={styles.featureFree}>5</Text>
          <Text style={styles.featurePremium}>Illimité</Text>
        </View>
        
        <View style={styles.featureRow}>
          <Text style={styles.featureName}>Voir qui vous like</Text>
          <Ionicons name="close" size={20} color={COLORS.error} />
          <Ionicons name="checkmark" size={20} color={COLORS.success} />
        </View>
        
        <View style={styles.featureRow}>
          <Text style={styles.featureName}>Matchs prioritaires</Text>
          <Ionicons name="close" size={20} color={COLORS.error} />
          <Ionicons name="checkmark" size={20} color={COLORS.success} />
        </View>
        
        <View style={styles.featureRow}>
          <Text style={styles.featureName}>Badge Premium</Text>
          <Ionicons name="close" size={20} color={COLORS.error} />
          <Ionicons name="checkmark" size={20} color={COLORS.success} />
        </View>
      </View>

      {/* Pricing */}
      {!subscription?.is_premium && (
        <View style={styles.pricingSection}>
          <View style={styles.priceCard}>
            <View style={styles.priceBadge}>
              <Ionicons name="star" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.priceTitle}>Premium</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>5$</Text>
              <Text style={styles.pricePeriod}>/semaine</Text>
            </View>
            <Text style={styles.priceNote}>Annulez à tout moment</Text>
            
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgrade}
              disabled={isUpgrading}
            >
              {isUpgrading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.upgradeButtonText}>Devenir Premium</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cancel option for premium users */}
      {subscription?.is_premium && (
        <View style={styles.cancelSection}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Annuler l'abonnement</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        * Ceci est une version de démonstration. Le paiement n'est pas intégré.
      </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  statusCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: 20,
  },
  statusBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,230,109,0.2)',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  featuresSection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  featureName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  featureFree: {
    width: 60,
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 14,
  },
  featurePremium: {
    width: 60,
    textAlign: 'center',
    color: COLORS.warning,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pricingSection: {
    padding: SPACING.lg,
  },
  priceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  priceBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,230,109,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  priceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.sm,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.warning,
  },
  pricePeriod: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  priceNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  upgradeButton: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    marginTop: SPACING.lg,
    width: '100%',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelSection: {
    padding: SPACING.lg,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.error,
    fontSize: 16,
  },
  disclaimer: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: 'auto',
    marginBottom: SPACING.lg,
  },
});
