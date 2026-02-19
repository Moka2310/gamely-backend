import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../src/constants/theme';
import { messagesAPI, matchesAPI, blockAPI } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';

interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  is_mine: boolean;
}

interface MatchUser {
  id: string;
  nickname: string;
  photo?: string;
  console?: string;
  gender?: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [matchUser, setMatchUser] = useState<MatchUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadChat = useCallback(async () => {
    if (!id) return;
    
    try {
      const [messagesRes, matchesRes] = await Promise.all([
        messagesAPI.getMessages(id),
        matchesAPI.getMatches(),
      ]);
      
      setMessages(messagesRes.data);
      
      // Find the match and user
      const match = matchesRes.data.find((m: any) => m.id === id);
      if (match) {
        setMatchUser(match.user);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadChat();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      if (id) {
        messagesAPI.getMessages(id).then(res => {
          setMessages(res.data);
        }).catch(() => {});
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadChat, id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !id || isSending) return;
    
    setIsSending(true);
    try {
      const response = await messagesAPI.sendMessage(id, newMessage.trim());
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd();
      }, 100);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.detail || "Impossible d'envoyer le message");
    } finally {
      setIsSending(false);
    }
  };

  const handleBlock = () => {
    if (!matchUser) return;
    
    Alert.alert(
      'Bloquer cet utilisateur?',
      'Vous ne pourrez plus voir ce profil ni lui envoyer de messages.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Bloquer',
          style: 'destructive',
          onPress: async () => {
            try {
              await blockAPI.blockUser(matchUser.id);
              Alert.alert('Utilisateur bloqué', '', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Erreur', "Impossible de bloquer l'utilisateur");
            }
          },
        },
      ]
    );
  };

  const handleDeleteMatch = () => {
    if (!id) return;
    
    Alert.alert(
      'Supprimer ce match?',
      'Cette action est irréversible. Tous les messages seront supprimés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await matchesAPI.deleteMatch(id);
              router.back();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le match');
            }
          },
        },
      ]
    );
  };

  const showOptions = () => {
    Alert.alert(
      'Options',
      '',
      [
        { text: 'Bloquer', style: 'destructive', onPress: handleBlock },
        { text: 'Supprimer le match', style: 'destructive', onPress: handleDeleteMatch },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.is_mine ? styles.myMessage : styles.theirMessage]}>
      <View style={[styles.messageBubble, item.is_mine ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.messageText, item.is_mine && styles.myMessageText]}>{item.content}</Text>
        <Text style={[styles.messageTime, item.is_mine && styles.myMessageTime]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          {matchUser?.photo ? (
            <Image source={{ uri: matchUser.photo }} style={styles.headerPhoto} />
          ) : (
            <View style={[styles.headerPhoto, styles.noPhoto]}>
              <Ionicons name="person" size={20} color={COLORS.textMuted} />
            </View>
          )}
          <Text style={styles.headerName}>{matchUser?.nickname || 'Chat'}</Text>
        </View>
        
        <TouchableOpacity onPress={showOptions} style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubble-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyChatText}>Envoyez le premier message!</Text>
            </View>
          }
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Votre message..."
            placeholderTextColor={COLORS.textMuted}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    gap: SPACING.sm,
  },
  headerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  noPhoto: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionsButton: {
    padding: SPACING.xs,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyChatText: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginTop: SPACING.md,
  },
  messageContainer: {
    marginBottom: SPACING.sm,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.text,
  },
  myMessageText: {
    color: 'white',
  },
  messageTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
