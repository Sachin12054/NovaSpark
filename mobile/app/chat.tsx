import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../constants/theme';
import { Navbar } from '../components/Navbar';
import { ChatBubble } from '../components/ChatBubble';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';
import { logCampaignEvent } from '../services/events';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hey! I'm Nova 👋\nI'll help you find an AI project you can actually build in 60 minutes.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_actions: [
        "Give me a project",
        "I'm a beginner",
        "AI project ideas",
        "Workshop details",
        "How do referrals work?",
        "Is the workshop free?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logCampaignEvent('CHAT_STARTED', undefined, 'Chat Screen');
  }, []);

  const handleSend = async (userText?: string) => {
    const text = userText || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await sendChatMessage(text, messages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: resp.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions: resp.suggested_actions,
        recommended_project: resp.recommended_project,
        quick_cta: resp.quick_cta
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: "You don't need any prior AI knowledge! We will build an AI application step-by-step with free sandbox API access.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions: ["Discover My Project", "Register Now"],
        quick_cta: { label: "Claim Free Seat →", action: "/register" }
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Navbar title="Nova AI Assistant" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              onActionSelect={(action) => {
                if (action.includes('Discover My Project') || action.includes('Build This Project') || action.includes('Find my project') || action === '/project') {
                  router.push('/project');
                } else if (action.includes('Claim Free Seat') || action.includes('Reserve') || action.includes('Register') || action === '/register') {
                  router.push('/register');
                } else if (action.includes('Leaderboard') || action === '/leaderboard') {
                  router.push('/leaderboard');
                } else {
                  handleSend(action);
                }
              }}
              onRegisterPress={() => router.push('/project')}
            />
          )}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={Colors.primaryLight} />
            <Text style={styles.loadingText}>Nova is formulating AI guidance...</Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Nova about projects, free seats..."
            placeholderTextColor={Colors.textDim}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!input.trim() || loading}
            onPress={() => handleSend()}
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          >
            <Ionicons name="send" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textDim,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: '#0a0e17',
    borderTopWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
