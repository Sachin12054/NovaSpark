import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ title = 'NovaSpark', showBack = false }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.brandIcon}>
          <Ionicons name="sparkles" size={16} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.brandTitle}>{title}</Text>
          <Text style={styles.brandSubtitle}>Turn your idea into an AI project.</Text>
        </View>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/growth' as any)}
          style={styles.growthBadge}
        >
          <Ionicons name="analytics" size={13} color={Colors.emeraldLight} />
          <Text style={styles.growthText}>Growth Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    color: Colors.textDim,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  growthText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.emeraldLight,
  },
});
