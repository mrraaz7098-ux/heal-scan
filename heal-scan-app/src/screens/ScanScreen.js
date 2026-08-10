import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import ScanModeCard from '../components/ScanModeCard';
import { colors, spacing } from '../theme';

export default function ScanScreen({ navigation }) {
  return (
    <ScreenBackground>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan</Text>
          <Text style={styles.headerSub}>Choose what you want to analyze</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.cards}>
            <ScanModeCard
              title="AI Health Scan"
              subtitle="Skin symptoms • Rashes • Spots"
              icon="medical-outline"
              tone="health"
              onPress={() => navigation.navigate('HealthScanner')}
            />
            <ScanModeCard
              title="AI Food Scan"
              subtitle="Calories • Nutrition • Benefits"
              icon="nutrition-outline"
              tone="food"
              onPress={() => navigation.navigate('FoodScanner')}
            />
          </View>

          <View style={styles.tip}>
            <Ionicons name="sparkles-outline" size={20} color={colors.warning} />
            <Text style={styles.tipText}>
              Tip: Use good lighting and keep the camera steady for the most accurate results.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  headerSub: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  content: {
    padding: spacing.lg,
    paddingTop: 8,
    paddingBottom: 30,
  },
  cards: {
    gap: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,194,75,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,194,75,0.25)',
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
  },
  tipText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
    fontFamily: 'Poppins_400Regular',
  },
});
