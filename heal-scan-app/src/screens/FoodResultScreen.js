import { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import GradientButton from '../components/GradientButton';
import IconButton from '../components/IconButton';
import {
  BulletRow,
  DisclaimerBox,
  ResultImage,
  SectionCard,
} from '../components/ResultSections';
import { saveScan } from '../storage';
import { colors, gradients, radii, spacing } from '../theme';

const NUTRITION_META = [
  { key: 'calories', label: 'Calories', icon: 'flame-outline', color: colors.neonOrange },
  { key: 'carbs', label: 'Carbs', icon: 'speedometer-outline', color: colors.neonBlue },
  { key: 'protein', label: 'Protein', icon: 'fitness-outline', color: colors.neonPurple },
  { key: 'fat', label: 'Fat', icon: 'water-outline', color: colors.neonPink },
  { key: 'fiber', label: 'Fiber', icon: 'leaf-outline', color: colors.success },
  { key: 'sugar', label: 'Sugar', icon: 'cafe-outline', color: colors.warning },
];

export default function FoodResultScreen({ route, navigation }) {
  const { record, autoSaved } = route.params;
  const r = record.result;
  const [saved, setSaved] = useState(autoSaved);

  const nutrition = r.nutritionFacts || {};

  const onSave = async () => {
    if (saved) return;
    await saveScan(record);
    setSaved(true);
    Alert.alert('Saved', 'Scan added to your history.');
  };

  const onShare = () => {
    const text = [
      `Heal Scan — ${r.foodName || r.title || 'Food Analysis'}`,
      '',
      `Calories: ${nutrition.calories || r.calories || '—'}`,
      `Carbs: ${nutrition.carbs || '—'} • Protein: ${nutrition.protein || '—'}`,
      `Fat: ${nutrition.fat || '—'} • Fiber: ${nutrition.fiber || '—'} • Sugar: ${nutrition.sugar || '—'}`,
      '',
      'Health benefits:',
      ...(r.healthBenefits || []).map((b) => `• ${b}`),
      '',
      'Possible side effects:',
      ...(r.sideEffects || []).map((s) => `• ${s}`),
      '',
      `Recommended intake: ${r.recommendedIntake || '—'}`,
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
          <Text style={styles.headerTitle}>Food Result</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ResultImage uri={record.imageUri} height={200} />

          <View style={styles.titleCard}>
            <Text style={styles.foodName}>{r.foodName || r.title || 'Food'}</Text>
            <Text style={styles.foodCal}>
              {nutrition.calories || r.calories || '—'} per 100g
            </Text>
          </View>

          <SectionCard title="Nutrition Facts (per 100g)" icon="nutrition-outline" tone="green">
            <View style={styles.grid}>
              {NUTRITION_META.map((n) => (
                <View key={n.key} style={styles.gridItem}>
                  <Ionicons name={n.icon} size={18} color={n.color} />
                  <Text style={styles.gridValue}>{nutrition[n.key] || '—'}</Text>
                  <Text style={styles.gridLabel}>{n.label}</Text>
                </View>
              ))}
            </View>
          </SectionCard>

          <SectionCard title="Health Benefits" icon="checkmark-done-outline" tone="green">
            {(r.healthBenefits || []).map((b, i) => (
              <BulletRow key={i} icon="checkmark" color={colors.success} text={b} />
            ))}
          </SectionCard>

          <SectionCard title="Possible Side Effects" icon="warning-outline" tone="orange">
            {(r.sideEffects || []).map((s, i) => (
              <BulletRow key={i} icon="warning" color={colors.neonOrange} text={s} />
            ))}
          </SectionCard>

          {r.recommendedIntake ? (
            <SectionCard title="Recommended Daily Intake" icon="calendar-outline" tone="blue">
              <BulletRow
                icon="information"
                color={colors.neonBlue}
                text={r.recommendedIntake}
              />
            </SectionCard>
          ) : null}

          <DisclaimerBox
            text={
              r.disclaimer ||
              'Nutrition values are estimates and may vary by brand and preparation. This is not medical advice.'
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
  titleCard: {
    backgroundColor: 'rgba(22,38,56,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,160,0.25)',
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 14,
  },
  foodName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  foodCal: {
    color: colors.neonGreen,
    fontSize: 15,
    marginTop: 4,
    fontFamily: 'Poppins_500Medium',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '31%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  gridValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  gridLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  actionBtn: {
    flex: 1,
  },
});
