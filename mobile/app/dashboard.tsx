import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../constants/theme';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ReferralCard } from '../components/ReferralCard';
import { StatCard } from '../components/StatCard';
import { StudentReferralStats, Student } from '../types';
import { getReferralStats, getActiveStudent, getActiveReferralCode } from '../services/api';
import { logCampaignEvent } from '../services/events';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<StudentReferralStats | null>(null);
  const [activeStudent, setActiveStudentState] = useState<Student | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const studentCode = getActiveReferralCode();

  const loadData = async () => {
    try {
      const current = getActiveStudent();
      setActiveStudentState(current);
      const data = await getReferralStats(current?.referral_code || studentCode);
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    logCampaignEvent('PAGE_VIEW', undefined, 'Mobile App', { screen: 'Dashboard' });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalReferrals = stats?.total_referrals ?? (activeStudent ? 0 : 5);
  const rank = stats?.rank ?? 12;
  const nextMilestone = stats?.next_milestone ?? 10;
  const needed = stats?.referrals_needed_for_milestone ?? (nextMilestone - totalReferrals);
  const displayName = activeStudent?.name || "Sachin";
  const displayCollege = activeStudent?.college || "RVCE Bangalore";
  const displayBranch = activeStudent?.branch || "CSE";

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Navbar title="Student Dashboard" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
      >
        {/* Welcome Header */}
        <Card variant="highlight" style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.confirmedBadge}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.emeraldLight} />
                <Text style={styles.confirmedText}>Workshop Seat Confirmed</Text>
              </View>
              <Text style={styles.welcomeTitle}>Welcome, {displayName} 👋</Text>
              <Text style={styles.welcomeSubtitle}>{displayCollege} • {displayBranch}</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>Sat 6:00 PM</Text>
              <Text style={styles.timeSubtext}>Live Online</Text>
            </View>
          </View>
        </Card>

        {/* 3 Metric Cards */}
        <View style={styles.statsGrid}>
          <View style={{ flex: 1 }}>
            <StatCard
              label="Referrals"
              value={totalReferrals}
              sublabel="friends joined"
              color={Colors.emeraldLight}
              icon={<Ionicons name="people" size={16} color={Colors.emeraldLight} />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatCard
              label="Rank"
              value={`#${rank}`}
              sublabel="on leaderboard"
              color={Colors.amber}
              icon={<Ionicons name="trophy" size={16} color={Colors.amber} />}
            />
          </View>
        </View>

        {/* Next Milestone Reward Card */}
        <Card style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <Ionicons name="gift" size={18} color={Colors.primaryLight} />
            <Text style={styles.milestoneTitle}>Next Milestone: Tier 3</Text>
          </View>

          <ProgressBar
            current={totalReferrals}
            target={nextMilestone}
            label={`Progress: ${totalReferrals} / ${nextMilestone}`}
            sublabel={`${needed} more referrals to unlock 1-on-1 AI Resume Review`}
            color="emerald"
          />
        </Card>

        {/* Viral Referral Pass Card */}
        <ReferralCard
          referralCode={studentCode}
          referralCount={totalReferrals}
          onViewLeaderboard={() => router.push('/leaderboard')}
        />

        {/* Joined Friends List */}
        <Card style={styles.friendsCard}>
          <View style={styles.friendsHeader}>
            <Text style={styles.friendsTitle}>Friends Who Joined ({totalReferrals})</Text>
            <Text style={styles.friendsBadge}>Attributed</Text>
          </View>

          <View style={styles.friendsList}>
            {(stats?.recent_referrals || []).map((ref, idx) => (
              <View key={idx} style={styles.friendRow}>
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>
                    {ref.referred_student_name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.friendName}>{ref.referred_student_name}</Text>
                  <Text style={styles.friendCollege}>{ref.referred_student_college}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>✓ Joined</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

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
  welcomeCard: {
    gap: 10,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  confirmedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.emeraldLight,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  timeBadge: {
    backgroundColor: '#0c1220',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  timeSubtext: {
    fontSize: 9,
    color: Colors.textDim,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  milestoneCard: {
    gap: 10,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  friendsCard: {
    gap: 12,
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  friendsBadge: {
    fontSize: 10,
    color: Colors.emeraldLight,
    fontFamily: 'monospace',
  },
  friendsList: {
    gap: 8,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceLight,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryLight,
  },
  friendName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  friendCollege: {
    fontSize: 11,
    color: Colors.textDim,
  },
  statusBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.emeraldLight,
  },
});
