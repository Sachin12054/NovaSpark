import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const SimulatedBanner: React.FC = () => {
  return (
    <View style={styles.banner}>
      <Ionicons name="pulse" size={14} color={Colors.amber} />
      <Text style={styles.text}>
        SIMULATION MODE: 500 Registrations • ₹2k Budget Challenge
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderBottomWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fcd34d',
    letterSpacing: 0.2,
  },
});
