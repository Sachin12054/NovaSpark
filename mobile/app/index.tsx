import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../constants/theme';
import { Navbar } from '../components/Navbar';
import { SimulatedBanner } from '../components/SimulatedBanner';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { getGrowthAnalytics } from '../services/api';
import { GrowthAnalyticsResponse } from '../types';
import { logCampaignEvent } from '../services/events';
import { Ionicons } from '@expo/vector-icons';
import { CAMPAIGN_CONFIG } from '../constants/campaign';

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<GrowthAnalyticsResponse | null>(null);

  useEffect(() => {
    getGrowthAnalytics().then(setStats).catch(() => {});
    logCampaignEvent('PAGE_VIEW', undefined, 'Mobile App', { screen: 'Home' });
  }, []);

  const totalRegs = stats?.total_registrations || CAMPAIGN_CONFIG.CURRENT_REGISTRATIONS;
  const targetRegs = stats?.target_registrations || CAMPAIGN_CONFIG.TARGET_REGISTRATIONS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SimulatedBanner />
      <Navbar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Pill Tag */}
        <View style={styles.tagPill}>
          <Ionicons name="sparkles" size={13} color={Colors.primaryLight} />
          <Text style={styles.tagText}>NovaSpark • Live Workshop for Engineers</Text>
        </View>

        {/* Hero Header */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Build Your First AI Project{'\n'}
            <Text style={styles.heroTitleHighlight}>in 60 Minutes</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Tell us what you're interested in. We'll help you find an AI project you can actually build and showcase on your resume.
          </Text>
        </View>

        {/* 500 Goal Progress Card */}
        <Card variant="highlight" style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.pingDot} />
              <Text style={styles.goalHeaderText}>Live Workshop Enrollment</Text>
            </View>
            <View style={styles.seatsBadge}>
              <Text style={styles.seatsText}>{targetRegs - totalRegs} Seats Left</Text>
            </View>
          </View>

          <ProgressBar
            current={totalRegs}
            target={targetRegs}
            label="500 Student Challenge"
            sublabel="7-Day Simulated Growth Sprint"
            color="primary"
          />

          <View style={styles.goalFooter}>
            <Text style={styles.goalFooterText}>⚡ {totalRegs} simulated registrations</Text>
            <Text style={styles.freeBadgeText}>100% Free • Online</Text>
          </View>
        </Card>

        {/* Primary Action Buttons */}
        <View style={styles.ctaRow}>
          <Button
            title="Build My AI Project"
            onPress={() => {
              logCampaignEvent('PROJECT_CTA_CLICKED', undefined, 'Home Hero');
              router.push('/project');
            }}
            variant="primary"
            icon={<Ionicons name="compass" size={18} color="#ffffff" />}
          />
          <Button
            title="Ask Nova AI"
            onPress={() => {
              logCampaignEvent('CHAT_STARTED', undefined, 'Home Hero');
              router.push('/chat');
            }}
            variant="secondary"
            icon={<Ionicons name="chatbubble-ellipses" size={16} color={Colors.primaryLight} />}
          />
          <Button
            title="Join the Free AI Workshop →"
            onPress={() => {
              logCampaignEvent('WORKSHOP_CTA_CLICKED', undefined, 'Home Hero');
              router.push('/register');
            }}
            variant="emerald"
            icon={<Ionicons name="ticket-outline" size={16} color="#ffffff" />}
          />
        </View>

        {/* 4 Feature Pills */}
        <View style={styles.pillsGrid}>
          <View style={styles.pillItem}>
            <Ionicons name="time" size={16} color={Colors.primaryLight} />
            <Text style={styles.pillText}>60 Mins Build</Text>
          </View>
          <View style={styles.pillItem}>
            <Ionicons name="gift" size={16} color={Colors.emeraldLight} />
            <Text style={styles.pillText}>100% Free</Text>
          </View>
          <View style={styles.pillItem}>
            <Ionicons name="code-slash" size={16} color={Colors.violet} />
            <Text style={styles.pillText}>Beginner Friendly</Text>
          </View>
          <View style={styles.pillItem}>
            <Ionicons name="medal" size={16} color={Colors.amber} />
            <Text style={styles.pillText}>Certificate</Text>
          </View>
        </View>

        {/* Philosophy Card: Stop Watching AI Tutorials */}
        <Card style={styles.philosophyCard}>
          <Text style={styles.philosophyTag}>THE STUDENT REALITY CHECK</Text>
          <Text style={styles.philosophyTitle}>
            Stop watching 10-hour AI tutorials.{'\n'}
            <Text style={{ color: Colors.primaryLight }}>Build something real today.</Text>
          </Text>
          <Text style={styles.philosophyBody}>
            Most final-year engineering students get stuck in "tutorial hell." In this 60-minute session, you'll clone code, connect live LLM APIs, and deploy a working tool to your GitHub.
          </Text>

          <View style={styles.checkList}>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
              <Text style={styles.checkText}>No heavy machine learning math required</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
              <Text style={styles.checkText}>Free sandbox API access provided</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
              <Text style={styles.checkText}>Stand out in placement technical interviews</Text>
            </View>
          </View>
        </Card>

        {/* Referral Challenge Promo Card */}
        <Card variant="emerald" style={styles.referralPromo}>
          <View style={styles.referralPromoHeader}>
            <Ionicons name="trophy" size={20} color={Colors.amber} />
            <Text style={styles.referralPromoTitle}>Campus Referral Challenge</Text>
          </View>
          <Text style={styles.referralPromoText}>
            Invite 3 batchmates to unlock the <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>AI Starter Kit</Text> and climb the college leaderboard.
          </Text>
          <Button
            title="View Leaderboard & Rewards →"
            onPress={() => router.push('/leaderboard')}
            variant="emerald"
            style={{ paddingVertical: 10 }}
            textStyle={{ fontSize: 13 }}
          />
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
    gap: 16,
  },
  tagPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  heroSection: {
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroTitleHighlight: {
    color: '#818cf8',
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: '92%',
  },
  goalCard: {
    gap: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.emerald,
  },
  goalHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  seatsBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  seatsText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.amber,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  goalFooterText: {
    fontSize: 11,
    color: Colors.textDim,
  },
  freeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.emeraldLight,
  },
  ctaRow: {
    gap: 10,
  },
  pillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  pillItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  philosophyCard: {
    gap: 10,
  },
  philosophyTag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.amber,
    letterSpacing: 0.5,
  },
  philosophyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 24,
  },
  philosophyBody: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  checkList: {
    gap: 6,
    marginTop: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 12,
    color: Colors.text,
  },
  referralPromo: {
    gap: 8,
  },
  referralPromoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referralPromoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  referralPromoText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
});
