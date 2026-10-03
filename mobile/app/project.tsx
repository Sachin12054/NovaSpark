import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../constants/theme';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectRecommendInput, ProjectRecommendation } from '../types';
import { recommendProject } from '../services/api';
import { logCampaignEvent } from '../services/events';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectRecommendInput>({
    branch: 'CSE',
    year: 'Final Year',
    coding_experience: 'Beginner',
    preferred_area: 'Generative AI & LLMs',
    ai_experience: 'Basic',
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<ProjectRecommendation | null>(null);

  const branches = ['CSE', 'AIDS', 'IT', 'ECE', 'EEE', 'Mech/Other'];
  const years = ['Final Year', '3rd Year', '2nd Year'];
  const codingLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const aiLevels = ['None', 'Basic', 'Tutorials', 'Deployed'];
  
  const areas = [
    { label: 'Generative AI & LLMs', icon: 'sparkles' },
    { label: 'Cybersecurity & Threat Detection', icon: 'shield-checkmark' },
    { label: 'Computer Vision & Media', icon: 'camera' },
    { label: 'Edge AI & IoT Sensors', icon: 'hardware-chip' },
    { label: 'Fintech & Personal Finance', icon: 'cash' },
    { label: 'AI Chatbots & RAG', icon: 'chatbubbles' },
    { label: 'Healthcare & Medical AI', icon: 'medkit' },
    { label: 'Machine Learning & Data', icon: 'analytics' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const rec = await recommendProject(formData);
      setRecommendation(rec);
      logCampaignEvent('PROJECT_GENERATED', undefined, 'Project Finder', {
        branch: formData.branch,
        area: formData.preferred_area,
        project: rec.project_title,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Navbar title="AI Project Finder" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!recommendation ? (
          <Card style={styles.formCard}>
            <View style={styles.headerBox}>
              <Text style={styles.formTitle}>Find Your AI Project</Text>
              <Text style={styles.formSubtitle}>
                Match your engineering branch & skill level to a working 60-minute build plan.
              </Text>
            </View>

            {/* Branch Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ENGINEERING BRANCH</Text>
              <View style={styles.chipRow}>
                {branches.map(b => (
                  <TouchableOpacity
                    key={b}
                    onPress={() => setFormData({ ...formData, branch: b })}
                    style={[styles.chip, formData.branch === b && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, formData.branch === b && styles.chipTextActive]}>
                      {b}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Year Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ACADEMIC YEAR</Text>
              <View style={styles.chipRow}>
                {years.map(y => (
                  <TouchableOpacity
                    key={y}
                    onPress={() => setFormData({ ...formData, year: y })}
                    style={[styles.chip, formData.year === y && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, formData.year === y && styles.chipTextActive]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Coding Experience */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CODING EXPERIENCE</Text>
              <View style={styles.chipRow}>
                {codingLevels.map(c => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setFormData({ ...formData, coding_experience: c })}
                    style={[styles.chip, formData.coding_experience === c && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, formData.coding_experience === c && styles.chipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* AI Experience */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>AI KNOWLEDGE</Text>
              <View style={styles.chipRow}>
                {aiLevels.map(a => (
                  <TouchableOpacity
                    key={a}
                    onPress={() => setFormData({ ...formData, ai_experience: a })}
                    style={[styles.chip, formData.ai_experience === a && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, formData.ai_experience === a && styles.chipTextActive]}>
                      {a}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preferred Interest Area */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>TARGET AI DOMAIN</Text>
              <View style={styles.areaGrid}>
                {areas.map(area => {
                  const isSelected = formData.preferred_area === area.label;
                  return (
                    <TouchableOpacity
                      key={area.label}
                      onPress={() => setFormData({ ...formData, preferred_area: area.label })}
                      style={[styles.areaCard, isSelected && styles.areaCardActive]}
                    >
                      <Ionicons
                        name={area.icon as any}
                        size={18}
                        color={isSelected ? Colors.primaryLight : Colors.textDim}
                      />
                      <Text style={[styles.areaText, isSelected && styles.areaTextActive]}>
                        {area.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit Button */}
            <Button
              title="Generate My Custom AI Project"
              onPress={handleGenerate}
              loading={loading}
              variant="primary"
              icon={<Ionicons name="sparkles" size={18} color="#ffffff" />}
              style={{ marginTop: 8 }}
            />
          </Card>
        ) : (
          <View style={{ gap: 16 }}>
            <ProjectCard
              project={recommendation}
              onBuildPress={() => router.push('/register')}
              onResetPress={() => setRecommendation(null)}
            />
          </View>
        )}

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
  formCard: {
    gap: 16,
  },
  headerBox: {
    gap: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  formSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textDim,
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  chipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaCard: {
    width: '48%',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    gap: 6,
  },
  areaCardActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: Colors.primary,
  },
  areaText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  areaTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
