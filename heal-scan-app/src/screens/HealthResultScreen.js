import { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import GradientButton from '../components/GradientButton';
import Chip from '../components/Chip';
import IconButton from '../components/IconButton';
import {
  BulletRow,
  DisclaimerBox,
  ResultImage,
  SectionCard,
  UrgencyBadge,
} from '../components/ResultSections';
import { saveScan } from '../storage';
import { colors, gradients, radii, spacing } from '../theme';

const confidenceTone = {
  Likely: 'high',
  Possible: 'moderate',
  'Less Likely': 'low',
};

export default function HealthResultScreen({ route, navigation }) {
  const { record, autoSaved } = route.params;
  const r = record.result;
  const [saved, setSaved] = useState(autoSaved);

  const onSave = async () => {
    if (saved) return;
    await saveScan(record);
    setSaved(true);
    Alert.alert('Saved', 'Scan added to your history.');
  };

  const onShare = () => {
    const text = [
      `Heal Scan — ${r.title || 'Health Analysis'}`,
      '',
      'Visual findings:',
      ...(r.visualFindings || []).map((f) => `• ${f}`),
      '',
      'Possible causes:',
      ...(r.possibleCauses || []).map((c) => `• ${c.cause} (${c.confidence})`),
      '',
      `Urgency: ${r.urgencyLevel}`,
      '',
      'What you can do now:',
      ...(r.whatYouCanDoNow || []).map((s) => `• ${s}`),
      '',
      'When to see a doctor:',
      ...(r.whenToSeeDoctor || []).map((s) => `• ${s}`),
      '',
      r.disclaimer || '',
    ].join('\n');
    Share.share({ message: text });
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <IconButton name="arrow-back" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Health Result</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ResultImage uri={record.imageUri} />

          <SectionCard title="Visual Findings" icon="eye-outline" tone="blue">
            {(r.visualFindings || []).map((f, i) => (
              <BulletRow key={i} icon="ellipse" color={colors.neonBlue} text={f} />
            ))}
          </SectionCard>

          <SectionCard title="Possible Causes" icon="pulse-outline" tone="purple">
            {(r.possibleCauses || []).map((c, i) => (
              <View key={i} style={styles.causeRow}>
                <View style={styles.causeTextWrap}>
                  <Text style={styles.causeText}>{c.cause}</Text>
                </View>
                <Chip
                  label={c.confidence}
                  tone={confidenceTone[c.confidence] || 'neutral'}
                />
              </View>
            ))}
          </SectionCard>

          <View style={styles.urgencyCard}>
            <Text style={styles.urgencyLabel}>Urgency Level</Text>
            <UrgencyBadge level={r.urgencyLevel} />
          </View>

          <SectionCard title="What You Can Do Now" icon="hand-left-outline" tone="green">
            {(r.whatYouCanDoNow || []).map((s, i) => (
              <BulletRow key={i} icon="checkmark" color={colors.success} text={s} />
            ))}
          </SectionCard>

          <SectionCard title="When to See a Doctor" icon="medical-outline" tone="red">
            {(r.whenToSeeDoctor || []).map((s, i) => (
              <BulletRow key={i} icon="warning" color={colors.danger} text={s} />
            ))}
          </SectionCard>

          <DisclaimerBox
            text={
              r.disclaimer ||
              'This information is for educational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional.'
            }
          />

          <View style={styles.actions}>
            <GradientButton
              title={saved ? 'Saved' : 'Save'}
              icon={
                <Ionicons name={saved ? 'checkmark' : 'bookmark-outline'} size={20} color="#fff" />
              }
              onPress={onSave}
              colors={saved ? gradients.urgentLow : gradients.primary}
              style={styles.actionBtn}
            />
            <GradientButton
              title="Share"
              icon={<Ionicons name="share-social-outline" size={20} color="#fff" />}
              onPress={onShare}
              colors={gradients.accent}
              style={styles.actionBtn}
            />
          </View>

          <GradientButton
            title="Consult a Doctor"
            icon={<Ionicons name="call-outline" size={20} color="#fff" />}
            onPress={() =>
              Alert.alert(
                'Consult a Doctor',
                'Heal Scan cannot connect you to a doctor directly. If your urgency level is High or you have concerns, please contact a healthcare professional or visit a clinic as soon as possible.'
              )
            }
            colors={gradients.food}
            style={styles.consultBtn}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  causeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.sm,
    padding: 10,
  },
  causeTextWrap: { flex: 1, marginRight: 10 },
  causeText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  urgencyCard: {
    backgroundColor: 'rgba(22,38,56,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgencyLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  actionBtn: {
    flex: 1,
  },
  consultBtn: {
    marginTop: 14,
  },
});
