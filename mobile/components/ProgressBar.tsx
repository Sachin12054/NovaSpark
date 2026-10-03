import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  sublabel?: string;
  color?: 'primary' | 'emerald' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  sublabel,
  color = 'primary',
}) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));

  const getBarColor = () => {
    switch (color) {
      case 'emerald':
        return Colors.emerald;
      case 'amber':
        return Colors.amber;
      case 'primary':
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {(label || sublabel) && (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.progressText}>
            <Text style={styles.current}>{current}</Text> / {target}{' '}
            <Text style={{ color: getBarColor(), fontWeight: 'bold' }}>({percentage}%)</Text>
          </Text>
        </View>
      )}

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%`, backgroundColor: getBarColor() },
          ]}
        />
      </View>

      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textDim,
  },
  current: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  track: {
    height: 10,
    backgroundColor: '#131927',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
  sublabel: {
    fontSize: 11,
    color: Colors.textDim,
    marginTop: 4,
  },
});
