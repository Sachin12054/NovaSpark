import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants/theme';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { StatCard } from '../components/StatCard';
import { GrowthAnalyticsResponse, GrowthCopilotResponse } from '../types';
import { getGrowthAnalytics, getGrowthCopilot } from '../services/api';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

import { CAMPAIGN_CONFIG } from '../constants/campaign';

export default function GrowthScreen() {
  const [stats, setStats] = useState<GrowthAnalyticsResponse | null>(null);
  const [copilot, setCopilot] = useState<GrowthCopilotResponse | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const s = await getGrowthAnalytics();
      setStats(s);
      loadCopilot('insights');
    } catch (e) {
      console.error(e);
    }
  };

  const loadCopilot = async (action: string) => {
    setCopilotLoading(true);
    try {
      const c = await getGrowthCopilot(action);
      setCopilot(c);
    } catch (e) {
      console.error(e);
    } finally {
      setCopilotLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalRegs = stats?.total_registrations || CAMPAIGN_CONFIG.CURRENT_REGISTRATIONS;
  const targetRegs = stats?.target_registrations || CAMPAIGN_CONFIG.TARGET_REGISTRATIONS;
  const cpa = stats?.cost_per_reg_overall || CAMPAIGN_CONFIG.BLENDED_CPA_INR;
  const viralK = stats?.viral_coefficient_k || CAMPAIGN_CONFIG.VIRAL_K_FACTOR;

  const handleCopy = async () => {
    if (copilot?.generated_copy) {
      await Clipboard.setStringAsync(copilot.generated_copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Navbar title="Growth Analytics Cockpit" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryLight} />}
      >
        {/* Header Intro */}
        <View style={styles.header}>
          <View style={styles.simBadge}>
            <Text style={styles.simBadgeText}>SIMULATED DATA • EVALUATION MODE</Text>
          </View>
          <Text style={styles.title}>Campaign Growth Performance</Text>
          <Text style={styles.subtitle}>
            Goal: 500 engineering student signups in 7 days with ₹2,000 max budget.
          </Text>
        </View>

        {/* 4 Core Metrics Grid */}
        <View style={styles.gridRow}>
          <View style={{ flex: 1 }}>
            <StatCard
              label="Registrations"
              value={`${totalRegs} / 500`}
              sublabel="65.4% goal achieved"
              color="#ffffff"
              icon={<Ionicons name="people" size={16} color={Colors.primaryLight} />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatCard
              label="Blended CPA"
              value={`₹${cpa}`}
              sublabel="Target: < ₹4.00"
              color={Colors.emeraldLight}
              icon={<Ionicons name="cash" size={16} color={Colors.emeraldLight} />}
            />
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={{ flex: 1 }}>
            <StatCard
              label="Referral K-Factor"
              value={viralK}
              sublabel="67 peer invites (₹0 CPA)"
              color={Colors.violet}
              icon={<Ionicons name="share-social" size={16} color={Colors.violet} />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatCard
              label="Budget Spent"
              value="₹1,250"
              sublabel="₹750 remaining of ₹2k"
              color={Colors.amber}
              icon={<Ionicons name="pie-chart" size={16} color={Colors.amber} />}
            />
          </View>
        </View>

        {/* 7-Day Velocity Progress Card */}
        <Card variant="highlight" style={styles.velocityCard}>
          <View style={styles.velocityHeader}>
            <Text style={styles.sectionTitle}>7-Day Velocity Tracking</Text>
            <Text style={styles.dayBadge}>Day 6 of 7 Active</Text>
          </View>

          <ProgressBar
            current={totalRegs}
            target={targetRegs}
            label="500 Registrations Target"
            sublabel="173 needed to complete sprint"
            color="primary"
          />

          {/* Mini 7-Day Bar Visualizer */}
          <View style={styles.daysRow}>
            {(stats?.daily_trends || []).map((d) => {
              const isToday = d.day_number === 6;
              const isRemaining = d.day_number === 7;
              const heightPct = isRemaining ? 10 : Math.min(100, Math.round((d.actual_cumulative / 500) * 100));

              return (
                <View key={d.day_number} style={styles.dayCol}>
                  <Text style={styles.dayVal}>{isRemaining ? '-' : d.actual_cumulative}</Text>
                  <View style={styles.dayBarTrack}>
                    <View
                      style={[
                        styles.dayBarFill,
                        { height: `${heightPct}%` },
                        isToday && styles.dayBarToday,
                        isRemaining && styles.dayBarRemaining,
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    D{d.day_number}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Channel Economics Table */}
        <Card style={styles.channelCard}>
          <Text style={styles.sectionTitle}>Acquisition Channels & Unit Economics</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Channel</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Regs</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Cost/Reg</Text>
          </View>

          {(stats?.channel_performance || []).map((ch) => (
            <View key={ch.channel} style={styles.tableRow}>
              <Text style={[styles.tdChannel, { flex: 2 }]}>{ch.channel}</Text>
              <Text style={[styles.tdVal, { flex: 1, textAlign: 'center' }]}>{ch.registrations}</Text>
              <Text style={[styles.tdCost, { flex: 1, textAlign: 'right' }]}>₹{ch.cost_per_reg.toFixed(2)}</Text>
            </View>
          ))}
        </Card>

        {/* AI Growth Copilot */}
        <Card variant="highlight" style={styles.copilotCard}>
          <View style={styles.copilotHeader}>
            <View style={styles.copilotIcon}>
              <Ionicons name="sparkles" size={18} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.copilotTitle}>AI Growth Copilot</Text>
              <Text style={styles.copilotSubtitle}>Automated campaign intelligence & sprint optimization</Text>
            </View>
          </View>

          {/* Action Trigger Buttons */}
          <View style={styles.copilotActions}>
            <Button
              title="Generate Experiment"
              onPress={() => loadCopilot('experiment')}
              loading={copilotLoading}
              variant="primary"
              style={{ flex: 1, paddingVertical: 10 }}
              textStyle={{ fontSize: 12 }}
            />
            <Button
              title="WhatsApp Copy"
              onPress={() => loadCopilot('whatsapp_copy')}
              loading={copilotLoading}
              variant="emerald"
              style={{ flex: 1, paddingVertical: 10 }}
              textStyle={{ fontSize: 12 }}
            />
          </View>

          {/* Analysis */}
          {copilot?.analysis && (
            <View style={styles.analysisBox}>
              <Text style={styles.analysisHeader}>💡 DIAGNOSIS & REASONING:</Text>
              <Text style={styles.analysisText}>{copilot.analysis}</Text>
            </View>
          )}

          {/* Experiments */}
          {copilot?.recommended_experiments && copilot.recommended_experiments.length > 0 && (
            <View style={styles.expList}>
              {copilot.recommended_experiments.map((exp, i) => (
                <View key={i} style={styles.expCard}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <Text style={styles.expImpact}>{exp.estimated_impact}</Text>
                  </View>
                  <Text style={styles.expHypothesis}>{exp.hypothesis}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Generated WhatsApp Copy */}
          {copilot?.generated_copy && (
            <View style={styles.copyBox}>
              <View style={styles.copyHeader}>
                <Text style={styles.copyLabel}>Generated High-CTR WhatsApp Broadcast:</Text>
                <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
                  <Ionicons name={copied ? "checkmark" : "copy-outline"} size={14} color="#ffffff" />
                  <Text style={styles.copyBtnText}>{copied ? "Copied!" : "Copy"}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.copyText}>{copilot.generated_copy}</Text>
            </View>
          )}
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
  header: {
    gap: 4,
  },
  simBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  simBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.amber,
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
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  velocityCard: {
    gap: 12,
  },
  velocityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  dayBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.emeraldLight,
    fontFamily: 'monospace',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
    paddingTop: 10,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  dayVal: {
    fontSize: 9,
    color: Colors.textDim,
    fontFamily: 'monospace',
  },
  dayBarTrack: {
    width: 14,
    height: 50,
    backgroundColor: '#111728',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  dayBarFill: {
    width: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
  },
  dayBarToday: {
    backgroundColor: Colors.emerald,
  },
  dayBarRemaining: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
  },
  dayLabel: {
    fontSize: 9,
    color: Colors.textDim,
  },
  dayLabelToday: {
    color: Colors.emeraldLight,
    fontWeight: '700',
  },
  channelCard: {
    gap: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.surfaceBorder,
    paddingBottom: 6,
  },
  th: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textDim,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  tdChannel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  tdVal: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  tdCost: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.emeraldLight,
    fontFamily: 'monospace',
  },
  copilotCard: {
    gap: 12,
  },
  copilotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  copilotIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copilotTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  copilotSubtitle: {
    fontSize: 11,
    color: Colors.textDim,
  },
  copilotActions: {
    flexDirection: 'row',
    gap: 8,
  },
  analysisBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    gap: 4,
  },
  analysisHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLight,
  },
  analysisText: {
    fontSize: 12,
    color: '#c7d2fe',
    lineHeight: 17,
  },
  expList: {
    gap: 8,
  },
  expCard: {
    backgroundColor: Colors.surfaceLight,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 4,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  expImpact: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.emeraldLight,
    fontFamily: 'monospace',
  },
  expHypothesis: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  copyBox: {
    backgroundColor: '#070a10',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    gap: 6,
  },
  copyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.emeraldLight,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  copyText: {
    fontSize: 11,
    color: '#bbf7d0',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
