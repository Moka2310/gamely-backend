import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../src/constants/theme';
import { subscriptionAPI } from '../src/services/api';
import { useAuthStore } from '../src/stores/authStore';

// Conditionally import InAppPurchases (not available on web)
let InAppPurchases: any = null;
if (Platform.OS !== 'web') {
  InAppPurchases = require('expo-in-app-purchases');
}

// Product ID for premium subscription (configure in App Store Connect / Google Play Console)
const PREMIUM_PRODUCT_ID = 'gamly_premium_weekly';

export default function SubscriptionScreen() {
  const { updateUser } = useAuthStore();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isIAPAvailable, setIsIAPAvailable] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    initializeIAP();
    loadSubscription();
    
    return () => {
      // Cleanup IAP listener
      if (InAppPurchases && Platform.OS !== 'web') {
        InAppPurchases.disconnectAsync().catch(() => {});
      }
    };
  }, []);

  const initializeIAP = async () => {
    // Skip IAP on web
    if (Platform.OS === 'web' || !InAppPurchases) {
      setIsIAPAvailable(false);
      return;
    }

    try {
      // Connect to the store
      await InAppPurchases.connectAsync();
      setIsIAPAvailable(true);

      // Set up purchase listener
      InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }: any) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results?.forEach(async (purchase: any) => {
            if (!purchase.acknowledged) {
              // Verify and acknowledge the purchase
              await handlePurchaseComplete(purchase);
            }
          });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          console.log('User cancelled the purchase');
        } else {
          console.error('Purchase error:', errorCode);
          Alert.alert('Erreur', "Le paiement a échoué. Veuillez réessayer.");
        }
        setIsUpgrading(false);
      });

      // Load available products
      const { responseCode, results } = await InAppPurchases.getProductsAsync([PREMIUM_PRODUCT_ID]);
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        setProducts(results);
      }
    } catch (error) {
      console.log('IAP not available:', error);
      setIsIAPAvailable(false);
    }
  };

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

  const handlePurchaseComplete = async (purchase: InAppPurchases.InAppPurchase) => {
    try {
      // Finish the transaction
      await InAppPurchases.finishTransactionAsync(purchase, true);
      
      // Update backend
      await subscriptionAPI.upgrade();
      await loadSubscription();
      updateUser({ is_premium: true });
      
      Alert.alert(
        '🎉 Félicitations!',
        'Vous êtes maintenant Premium! Profitez de swipes illimités!',
        [{ text: 'Super!', style: 'default' }]
      );
    } catch (error) {
      console.error('Error completing purchase:', error);
      Alert.alert('Erreur', "Impossible de finaliser l'achat. Contactez le support.");
    }
  };

  const handleUpgrade = async () => {
    if (isIAPAvailable && products.length > 0) {
      // Real In-App Purchase
      setIsUpgrading(true);
      try {
        await InAppPurchases.purchaseItemAsync(PREMIUM_PRODUCT_ID);
        // The purchase listener will handle the result
      } catch (error) {
        console.error('Purchase error:', error);
        setIsUpgrading(false);
        Alert.alert('Erreur', "Impossible d'initier l'achat");
      }
    } else {
      // Demo mode (web or simulator)
      Alert.alert(
        'Devenir Premium',
        Platform.OS === 'web' 
          ? 'Le paiement par carte est disponible uniquement sur l\'application mobile (iOS/Android).\n\nVoulez-vous simuler l\'achat pour tester?'
          : 'Les achats intégrés ne sont pas disponibles sur ce simulateur.\n\nVoulez-vous simuler l\'achat?',
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
                Alert.alert('🎉 Félicitations!', 'Vous êtes maintenant Premium!');
              } catch (error) {
                Alert.alert('Erreur', "Impossible de mettre à niveau");
              } finally {
                setIsUpgrading(false);
              }
            },
          },
        ]
      );
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Annuler Premium',
      'Êtes-vous sûr de vouloir annuler votre abonnement Premium?\n\nVos avantages Premium resteront actifs jusqu\'à la fin de la période payée.',
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

  const handleRestorePurchases = async () => {
    if (!isIAPAvailable) {
      Alert.alert('Non disponible', 'La restauration des achats n\'est disponible que sur l\'application mobile.');
      return;
    }

    setIsLoading(true);
    try {
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results && results.length > 0) {
        // Check if user has an active subscription
        const hasActiveSubscription = results.some(
          (purchase) => purchase.productId === PREMIUM_PRODUCT_ID
        );
        
        if (hasActiveSubscription) {
          await subscriptionAPI.upgrade();
          await loadSubscription();
          updateUser({ is_premium: true });
          Alert.alert('Succès', 'Votre abonnement Premium a été restauré!');
        } else {
          Alert.alert('Aucun achat', 'Aucun abonnement Premium trouvé à restaurer.');
        }
      } else {
        Alert.alert('Aucun achat', 'Aucun achat trouvé à restaurer.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Erreur', 'Impossible de restaurer les achats.');
    } finally {
      setIsLoading(false);
    }
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

  const displayPrice = products.length > 0 ? products[0].price : '5,00 $';

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

      <ScrollView showsVerticalScrollIndicator={false}>
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
            {subscription?.is_premium ? 'Premium ⭐' : 'Gratuit'}
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
          
          <View style={styles.featuresHeader}>
            <Text style={styles.featureHeaderName}></Text>
            <Text style={styles.featureHeaderFree}>Gratuit</Text>
            <Text style={styles.featureHeaderPremium}>Premium</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureName}>Swipes par jour</Text>
            <Text style={styles.featureFree}>5</Text>
            <Text style={styles.featurePremium}>∞</Text>
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

          <View style={styles.featureRow}>
            <Text style={styles.featureName}>Super Likes</Text>
            <Text style={styles.featureFree}>0</Text>
            <Text style={styles.featurePremium}>5/jour</Text>
          </View>
        </View>

        {/* Pricing */}
        {!subscription?.is_premium && (
          <View style={styles.pricingSection}>
            <View style={styles.priceCard}>
              <View style={styles.priceBadge}>
                <Ionicons name="star" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.priceTitle}>Premium</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>{displayPrice}</Text>
                <Text style={styles.pricePeriod}>/semaine</Text>
              </View>
              <Text style={styles.priceNote}>Annulez à tout moment</Text>
              
              {/* Payment methods */}
              <View style={styles.paymentMethods}>
                <View style={styles.paymentMethod}>
                  <Ionicons name="card" size={20} color={COLORS.blue} />
                  <Text style={styles.paymentMethodText}>Carte bancaire</Text>
                </View>
                {Platform.OS === 'ios' && (
                  <View style={styles.paymentMethod}>
                    <Ionicons name="logo-apple" size={20} color={COLORS.text} />
                    <Text style={styles.paymentMethodText}>Apple Pay</Text>
                  </View>
                )}
                {Platform.OS === 'android' && (
                  <View style={styles.paymentMethod}>
                    <Ionicons name="logo-google" size={20} color={COLORS.text} />
                    <Text style={styles.paymentMethodText}>Google Pay</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <>
                    <Ionicons name="flash" size={20} color={COLORS.background} />
                    <Text style={styles.upgradeButtonText}>Devenir Premium</Text>
                  </>
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

        {/* Restore purchases */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
          <Text style={styles.restoreButtonText}>Restaurer mes achats</Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimer}>
            Le paiement sera prélevé sur votre compte {Platform.OS === 'ios' ? 'Apple' : Platform.OS === 'android' ? 'Google Play' : ''} lors de la confirmation de l'achat.
          </Text>
          <Text style={styles.disclaimer}>
            L'abonnement se renouvelle automatiquement sauf s'il est annulé au moins 24 heures avant la fin de la période en cours.
          </Text>
          {!isIAPAvailable && (
            <Text style={[styles.disclaimer, styles.demoNote]}>
              ⚠️ Mode démo - Les paiements réels sont disponibles uniquement sur l'application mobile publiée.
            </Text>
          )}
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
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  featureHeaderName: {
    flex: 1,
  },
  featureHeaderFree: {
    width: 70,
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  featureHeaderPremium: {
    width: 70,
    textAlign: 'center',
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: '600',
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
    width: 70,
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 14,
  },
  featurePremium: {
    width: 70,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,230,109,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  priceTitle: {
    fontSize: 22,
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
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  paymentMethodText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    marginTop: SPACING.lg,
    width: '100%',
    gap: SPACING.sm,
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
  restoreButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: COLORS.blue,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  disclaimerSection: {
    padding: SPACING.lg,
    paddingTop: 0,
    gap: SPACING.sm,
  },
  disclaimer: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  demoNote: {
    color: COLORS.warning,
    fontWeight: '500',
    marginTop: SPACING.sm,
  },
});
