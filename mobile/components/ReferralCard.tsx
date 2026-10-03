import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Card } from './Card';
import { Button } from './Button';
import { copyReferralLink, shareOnWhatsApp, getShareableReferralLink } from '../services/referral';
import { Ionicons } from '@expo/vector-icons';

interface ReferralCardProps {
  referralCode: string;
  referralCount?: number;
  onViewLeaderboard?: () => void;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  referralCount,
  onViewLeaderboard,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyReferralLink(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = async () => {
    await shareOnWhatsApp(referralCode);
  };

  return (
    <Card variant="emerald" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="gift" size={20} color={Colors.emerald} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Campus Referral Pass</Text>
          <Text style={styles.subtitle}>Invite 3 friends to unlock Certificate & AI Repo</Text>
        </View>
      </View>

      {/* Code Display Box */}
      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>YOUR UNIQUE CODE</Text>
        <Text style={styles.code}>{referralCode}</Text>
        <Text style={styles.link}>{getShareableReferralLink(referralCode)}</Text>
      </View>

      {/* Share Buttons */}
      <View style={styles.buttonRow}>
        <Button
          title="Share on WhatsApp"
          onPress={handleWhatsApp}
          variant="emerald"
          icon={<Ionicons name="logo-whatsapp" size={18} color="#ffffff" />}
          style={{ flex: 1 }}
        />
        <Button
          title={copied ? "Copied!" : "Copy Link"}
          onPress={handleCopy}
          variant="secondary"
          icon={<Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={Colors.text} />}
        />
      </View>

      {onViewLeaderboard && (
        <Button
          title="View Campus Leaderboard →"
          onPress={onViewLeaderboard}
          variant="ghost"
          style={{ paddingVertical: 8 }}
          textStyle={{ fontSize: 13, color: Colors.primaryLight }}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  codeBox: {
    backgroundColor: '#070f0b',
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.emeraldLight,
    letterSpacing: 0.5,
  },
  code: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginVertical: 4,
    letterSpacing: 1.5,
  },
  link: {
    fontSize: 10,
    color: Colors.textDim,
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
