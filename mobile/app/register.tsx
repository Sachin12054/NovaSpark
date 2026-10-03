import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '../constants/theme';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ReferralCard } from '../components/ReferralCard';
import { StudentRegistrationInput, Student } from '../types';
import { registerStudent } from '../services/api';
import { logCampaignEvent } from '../services/events';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ ref?: string }>();

  const [formData, setFormData] = useState<StudentRegistrationInput>({
    name: '',
    email: '',
    phone: '',
    college: 'VIT Vellore',
    branch: 'CSE',
    year: 'Final Year',
    referral_code_used: (params.ref as string) || '',
    source: params.ref ? 'Referral' : 'Organic',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (params.ref) {
      setFormData(prev => ({
        ...prev,
        referral_code_used: params.ref as string,
        source: 'Referral'
      }));
    }
    logCampaignEvent('REGISTRATION_STARTED', undefined, 'Register Screen', {
      referredBy: params.ref
    });
  }, [params.ref]);

  const colleges = [
    'VIT Vellore', 'Amrita University', 'SRM University', 'IIT Madras',
    'BITS Pilani', 'RVCE Bangalore', 'DTU Delhi', 'PES University', 'PSG Tech',
    'Other Engineering College'
  ];

  const branches = ['CSE', 'AIDS', 'IT', 'ECE', 'EEE', 'Mech/Other'];

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Missing Name', 'Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const student = await registerStudent(formData);
      setRegisteredStudent(student);
      logCampaignEvent('REGISTRATION_COMPLETED', String(student.id), formData.source || 'Organic', {
        college: student.college,
        branch: student.branch,
        referralCode: student.referral_code,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Navbar title="Workshop Seat Reservation" showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {registeredStudent ? (
            /* Success State */
            <View style={{ gap: 16 }}>
              <Card variant="emerald" style={styles.successCard}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-circle" size={36} color={Colors.emerald} />
                </View>
                <Text style={styles.successTitle}>You're in! 🎉</Text>
                <Text style={styles.successSubtitle}>
                  Your seat is reserved for <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Build Your First AI Project in 60 Minutes</Text> (This Saturday, 6:00 PM IST).
                </Text>
              </Card>

              {/* Referral Pass */}
              <ReferralCard
                referralCode={registeredStudent.referral_code}
                referralCount={0}
                onViewLeaderboard={() => router.push('/leaderboard')}
              />

              <Button
                title="Go to My Student Dashboard →"
                onPress={() => router.push('/dashboard')}
                variant="primary"
                style={{ marginTop: 8 }}
              />
            </View>
          ) : (
            /* Registration Form */
            <Card style={styles.formCard}>
              <View style={styles.headerBox}>
                <Text style={styles.title}>Reserve Your Free Seat</Text>
                <Text style={styles.subtitle}>
                  Join 500 engineering students in deploying their first production AI project.
                </Text>
              </View>

              {errorMessage && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={Colors.error} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sachin Kumar"
                  placeholderTextColor={Colors.textDim}
                  value={formData.name}
                  onChangeText={(val) => setFormData({ ...formData, name: val })}
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>COLLEGE / PERSONAL EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="sachin@example.com"
                  placeholderTextColor={Colors.textDim}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(val) => setFormData({ ...formData, email: val })}
                />
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>WHATSAPP PHONE NUMBER</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor={Colors.textDim}
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(val) => setFormData({ ...formData, phone: val })}
                />
              </View>

              {/* College Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>COLLEGE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                  {colleges.map(c => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setFormData({ ...formData, college: c })}
                      style={[styles.smallChip, formData.college === c && styles.smallChipActive]}
                    >
                      <Text style={[styles.smallChipText, formData.college === c && styles.smallChipTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Branch Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BRANCH</Text>
                <View style={styles.chipRow}>
                  {branches.map(b => (
                    <TouchableOpacity
                      key={b}
                      onPress={() => setFormData({ ...formData, branch: b })}
                      style={[styles.smallChip, formData.branch === b && styles.smallChipActive]}
                    >
                      <Text style={[styles.smallChipText, formData.branch === b && styles.smallChipTextActive]}>
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Referral Code */}
              <View style={styles.inputGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.inputLabel}>REFERRAL CODE (OPTIONAL)</Text>
                  {formData.referral_code_used ? (
                    <Text style={{ fontSize: 10, color: Colors.emeraldLight, fontWeight: '700' }}>
                      Auto-Applied ✓
                    </Text>
                  ) : null}
                </View>
                <TextInput
                  style={[styles.input, { fontFamily: 'monospace', textTransform: 'uppercase' }]}
                  placeholder="e.g. SACHIN27"
                  placeholderTextColor={Colors.textDim}
                  value={formData.referral_code_used}
                  onChangeText={(val) => setFormData({ ...formData, referral_code_used: val })}
                />
              </View>

              {/* Submit CTA */}
              <Button
                title="Confirm Free Registration"
                onPress={handleSubmit}
                loading={loading}
                variant="primary"
                icon={<Ionicons name="checkmark-done" size={18} color="#ffffff" />}
                style={{ marginTop: 8 }}
              />

              <View style={styles.footerNote}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.emerald} />
                <Text style={styles.footerNoteText}>
                  100% Free • Sandbox API Tokens Included • Instant Referral Code
                </Text>
              </View>
            </Card>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    gap: 14,
  },
  headerBox: {
    gap: 4,
    marginBottom: 4,
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
  errorBox: {
    backgroundColor: Colors.errorBackground,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    fontSize: 12,
    color: '#fca5a5',
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textDim,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: Colors.text,
    fontSize: 14,
  },
  horizontalChips: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallChip: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginRight: 6,
  },
  smallChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: Colors.primary,
  },
  smallChipText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  smallChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  footerNoteText: {
    fontSize: 10,
    color: Colors.textDim,
  },
  successCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: 10,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  successSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
