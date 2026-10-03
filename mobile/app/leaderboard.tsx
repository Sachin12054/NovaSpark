import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants/theme';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { LeaderboardItem } from '../components/LeaderboardItem';
import { LeaderboardResponse } from '../types';
import { getLeaderboard, getActiveReferralCode } from '../services/api';
import { logCampaignEvent } from '../services/events';
import { Ionicons } from '@expo/vector-icons';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<'students' | 'colleges'>('students');
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    try {
      const code = getActiveReferralCode();
      const res = await getLeaderboard(code);
      setData(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    logCampaignEvent('LEADERBOARD_VIEWED', undefined, 'Mobile App');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Navbar title="Campus Leaderboard" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
      >
        {/* Header Intro */}
        <View style={styles.header}>
          <Text style={styles.title}>Campus Referral Challenge</Text>
          <Text style={styles.subtitle}>
            Top student referrers unlock 1-on-1 portfolio reviews & fast-track recommendations.
          </Text>
          <Text style={styles.simNotice}>[SIMULATED CAMPAIGN DATA • NXTWAVE INTERN CHALLENGE]</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('students')}
            style={[styles.tabButton, activeTab === 'students' && styles.tabButtonActive]}
          >
            <Ionicons name="people" size={16} color={activeTab === 'students' ? '#ffffff' : Colors.textDim} />
            <Text style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}>
              Top Students
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('colleges')}
            style={[styles.tabButton, activeTab === 'colleges' && styles.tabButtonActive]}
          >
            <Ionicons name="school" size={16} color={activeTab === 'colleges' ? '#ffffff' : Colors.textDim} />
            <Text style={[styles.tabText, activeTab === 'colleges' && styles.tabTextActive]}>
              Top Colleges
            </Text>
          </TouchableOpacity>
        </View>

        {/* Milestone Unlock Strip */}
        <Card style={styles.milestoneBox}>
          <Text style={styles.milestoneHeader}>MILESTONE PERKS:</Text>
          <View style={styles.perksRow}>
            <View style={styles.perkBadge}>
              <Text style={styles.perkText}>🎁 3: Starter Kit</Text>
            </View>
            <View style={styles.perkBadge}>
              <Text style={styles.perkText}>⚡ 5: Python Repo</Text>
            </View>
            <View style={styles.perkBadge}>
              <Text style={styles.perkText}>✨ 10: Resume Review</Text>
            </View>
          </View>
        </Card>

        {/* Listings */}
        <View style={styles.listContainer}>
          {activeTab === 'students' ? (
            (data?.top_referrers || []).map((st) => (
              <LeaderboardItem
                key={st.rank}
                rank={st.rank}
                title={st.student_name}
                subtitle={`${st.college} • ${st.branch}`}
                count={st.referral_count}
                isCurrentUser={st.is_current_user || st.student_name.includes('Sachin')}
                type="student"
              />
            ))
          ) : (
            (data?.top_colleges || []).map((col) => (
              <LeaderboardItem
                key={col.rank}
                rank={col.rank}
                title={col.college_name}
                subtitle={`${col.student_count} registered students`}
                count={col.total_referrals}
                type="college"
              />
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: 14,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  simNotice: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.amber,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textDim,
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  milestoneBox: {
    padding: Spacing.md,
    gap: 8,
  },
  milestoneHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textDim,
    letterSpacing: 0.5,
  },
  perksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  perkBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  perkText: {
    fontSize: 11,
    color: '#c7d2fe',
    fontWeight: '600',
  },
  listContainer: {
    gap: 2,
  },
});
