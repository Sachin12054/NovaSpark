import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface LeaderboardItemProps {
  rank: number;
  title: string;
  subtitle: string;
  count: number;
  isCurrentUser?: boolean;
  type?: 'student' | 'college';
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  title,
  subtitle,
  count,
  isCurrentUser = false,
  type = 'student',
}) => {
  const getMedalColor = () => {
    switch (rank) {
      case 1:
        return '#f59e0b'; // Gold
      case 2:
        return '#94a3b8'; // Silver
      case 3:
        return '#d97706'; // Bronze
      default:
        return null;
    }
  };

  const medalColor = getMedalColor();

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.currentUserContainer,
      ]}
    >
      {/* Rank Icon / Number */}
      <View style={styles.rankBox}>
        {medalColor ? (
          <Ionicons name="medal" size={20} color={medalColor} />
        ) : (
          <Text style={styles.rankNumber}>#{rank}</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isCurrentUser && styles.currentUserText]}>
            {title}
          </Text>
          {isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>YOU</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Referral Count */}
      <View style={styles.countBox}>
        <Text style={styles.countText}>{count}</Text>
        <Text style={styles.countLabel}>
          {type === 'college' ? 'referrals' : 'referred'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 8,
  },
  currentUserContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  rankBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textDim,
    fontFamily: 'monospace',
  },
  infoBox: {
    flex: 1,
    marginLeft: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  currentUserText: {
    color: Colors.primaryLight,
  },
  youBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  youText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textDim,
    marginTop: 2,
  },
  countBox: {
    alignItems: 'flex-end',
  },
  countText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.emeraldLight,
    fontFamily: 'monospace',
  },
  countLabel: {
    fontSize: 9,
    color: Colors.textDim,
    textTransform: 'uppercase',
  },
});
