import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  color = Colors.primaryLight,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {icon}
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: 16,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  sublabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
