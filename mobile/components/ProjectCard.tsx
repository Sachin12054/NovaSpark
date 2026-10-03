import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Card } from './Card';
import { Button } from './Button';
import { ProjectRecommendation } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface ProjectCardProps {
  project: ProjectRecommendation;
  onBuildPress: () => void;
  onResetPress?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onBuildPress,
  onResetPress,
}) => {
  return (
    <Card variant="highlight" style={styles.container}>
      {/* Badges */}
      <View style={styles.badgeRow}>
        <View style={styles.badgeDifficulty}>
          <Text style={styles.badgeDifficultyText}>Difficulty: {project.difficulty}</Text>
        </View>
        <View style={styles.badgeTime}>
          <Ionicons name="time-outline" size={12} color={Colors.primaryLight} />
          <Text style={styles.badgeTimeText}>{project.estimated_build_time}</Text>
        </View>
      </View>

      {/* Project Title */}
      <Text style={styles.categoryLabel}>RECOMMENDED AI WORKSHOP BUILD</Text>
      <Text style={styles.title}>{project.project_title}</Text>
      <Text style={styles.tagline}>{project.tagline}</Text>

      {/* Why This Fits You */}
      <View style={styles.whyBox}>
        <Text style={styles.whyHeader}>🎯 Why this fits you:</Text>
        <Text style={styles.whyText}>{project.why_this_fits_you}</Text>
      </View>

      {/* Tech Stack */}
      <Text style={styles.sectionHeader}>Tech Stack:</Text>
      <View style={styles.techRow}>
        {project.tech_stack.map((tech, index) => (
          <View key={index} style={styles.techPill}>
            <Text style={styles.techText}>{tech}</Text>
          </View>
        ))}
      </View>

      {/* What You'll Learn */}
      <Text style={styles.sectionHeader}>What you'll build & learn in 60 mins:</Text>
      <View style={styles.learnList}>
        {project.what_you_will_learn.map((item, index) => (
          <View key={index} style={styles.learnItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
            <Text style={styles.learnText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Code preview */}
      {project.starter_code_preview && (
        <View style={styles.codeBox}>
          <Text style={styles.codeHeader}>Starter Blueprint Preview:</Text>
          <Text style={styles.codeText}>{project.starter_code_preview}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Button
          title={project.cta_text || "Build this project in the workshop →"}
          onPress={onBuildPress}
          variant="primary"
          style={{ flex: 1 }}
        />
        {onResetPress && (
          <Button
            title="Another Idea"
            onPress={onResetPress}
            variant="secondary"
            style={{ paddingHorizontal: 12 }}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeDifficulty: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  badgeDifficultyText: {
    color: Colors.emeraldLight,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  badgeTimeText: {
    color: Colors.primaryLight,
    fontSize: 11,
    fontWeight: '600',
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 26,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  whyBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  whyHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  whyText: {
    fontSize: 12,
    color: '#c7d2fe',
    lineHeight: 17,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techPill: {
    backgroundColor: '#172033',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  techText: {
    color: Colors.primaryLight,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  learnList: {
    gap: 6,
  },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  learnText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  codeBox: {
    backgroundColor: '#070a10',
    borderRadius: 10,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  codeHeader: {
    fontSize: 10,
    color: Colors.textDim,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 11,
    color: Colors.emeraldLight,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
});
