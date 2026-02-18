import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface MatchModalProps {
  visible: boolean;
  matchData: {
    match_id: string;
    user: {
      id: string;
      nickname: string;
      photo?: string;
      console?: string;
    };
    your_nickname: string;
  } | null;
  onClose: () => void;
  onChat: () => void;
}

export default function MatchModal({ visible, matchData, onClose, onChat }: MatchModalProps) {
  if (!matchData) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Hearts animation placeholder */}
          <View style={styles.heartsContainer}>
            <Ionicons name="heart" size={60} color={COLORS.match} />
            <Ionicons name="heart" size={40} color={COLORS.primary} style={styles.heartSmall} />
          </View>
          
          <Text style={styles.matchText}>C'est un Match!</Text>
          
          {/* Photos */}
          <View style={styles.photosContainer}>
            <View style={styles.photoWrapper}>
              {matchData.user.photo ? (
                <Image source={{ uri: matchData.user.photo }} style={styles.photo} />
              ) : (
                <View style={[styles.photo, styles.noPhoto]}>
                  <Ionicons name="person" size={40} color={COLORS.textMuted} />
                </View>
              )}
            </View>
          </View>
          
          {/* Nicknames revealed */}
          <View style={styles.nicknamesContainer}>
            <Text style={styles.revealText}>Vos nicknames sont maintenant visibles!</Text>
            <View style={styles.nicknameRow}>
              <View style={styles.nicknameBox}>
                <Text style={styles.nicknameLabel}>Votre nickname</Text>
                <Text style={styles.nickname}>{matchData.your_nickname}</Text>
              </View>
              <Ionicons name="swap-horizontal" size={24} color={COLORS.textMuted} />
              <View style={styles.nicknameBox}>
                <Text style={styles.nicknameLabel}>Son nickname</Text>
                <Text style={styles.nickname}>{matchData.user.nickname}</Text>
              </View>
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.chatButton} onPress={onChat}>
              <Ionicons name="chatbubble" size={20} color="white" />
              <Text style={styles.chatButtonText}>Envoyer un message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.continueButton} onPress={onClose}>
              <Text style={styles.continueButtonText}>Continuer à swiper</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width - 40,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heartSmall: {
    marginLeft: -10,
    marginTop: -20,
  },
  matchText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.match,
    marginBottom: 24,
  },
  photosContainer: {
    marginBottom: 24,
  },
  photoWrapper: {
    borderWidth: 3,
    borderColor: COLORS.match,
    borderRadius: 60,
    padding: 3,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  noPhoto: {
    backgroundColor: COLORS.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nicknamesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  revealText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nicknameBox: {
    flex: 1,
    alignItems: 'center',
  },
  nicknameLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  nickname: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
