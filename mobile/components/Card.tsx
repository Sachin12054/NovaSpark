import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlight' | 'emerald';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'highlight' && styles.highlightCard,
        variant === 'emerald' && styles.emeraldCard,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  highlightCard: {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    backgroundColor: 'rgba(15, 20, 38, 0.95)',
  },
  emeraldCard: {
    borderColor: 'rgba(34, 197, 94, 0.35)',
    backgroundColor: 'rgba(11, 26, 20, 0.95)',
  },
});
