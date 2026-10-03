import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { ChatMessage } from '../types';
import { ProjectCard } from './ProjectCard';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';

interface ChatBubbleProps {
  message: ChatMessage;
  onActionSelect: (action: string) => void;
  onRegisterPress: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onActionSelect,
  onRegisterPress,
}) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      {/* Avatar Icon */}
      {!isUser && (
        <View style={styles.botAvatar}>
          <Ionicons name="sparkles" size={14} color="#ffffff" />
        </View>
      )}

      <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {/* Main Message Bubble */}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
            {message.content}
          </Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>

        {/* Embedded Recommended Project Card */}
        {message.recommended_project && (
          <View style={{ width: '100%', marginTop: 8 }}>
            <ProjectCard
              project={message.recommended_project}
              onBuildPress={onRegisterPress}
            />
          </View>
        )}

        {/* Quick CTA Button */}
        {message.quick_cta && !message.recommended_project && (
          <View style={{ marginTop: 8 }}>
            <Button
              title={message.quick_cta.label}
              onPress={() => {
                if (message.quick_cta?.action) {
                  onActionSelect(message.quick_cta.action);
                } else {
                  onRegisterPress();
                }
              }}
              variant="primary"
              style={{ paddingVertical: 8, paddingHorizontal: 14 }}
              textStyle={{ fontSize: 13 }}
            />
          </View>
        )}

        {/* Suggested Quick Prompt Chips */}
        {message.suggested_actions && message.suggested_actions.length > 0 && (
          <View style={styles.chipsContainer}>
            {message.suggested_actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => onActionSelect(action)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    gap: 8,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '88%',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  botText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  chip: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  chipText: {
    fontSize: 12,
    color: '#c7d2fe',
    fontWeight: '600',
  },
});
