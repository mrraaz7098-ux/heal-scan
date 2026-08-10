import { useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import GradientButton from '../components/GradientButton';
import { colors, gradients, radii, spacing } from '../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'scan-circle-outline',
    colors: gradients.health,
    title: 'AI Health Scanner',
    subtitle:
      'Point your camera at a skin symptom and get instant AI analysis — visual findings, possible causes and urgency levels.',
    chip: 'Health',
  },
  {
    icon: 'nutrition-outline',
    colors: gradients.food,
    title: 'AI Food Scanner',
    subtitle:
      'Scan any food to see calories, nutrition facts per 100g, health benefits and possible side effects.',
    chip: 'Food',
  },
  {
    icon: 'shield-checkmark-outline',
    colors: gradients.scan,
    title: 'Safe & Private',
    subtitle:
      'Your scan history is saved on your device. Heal Scan is informational only — never a medical diagnosis.',
    chip: 'Privacy',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const isLast = index === slides.length - 1;

  const goTo = (i) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <LinearGradient colors={item.colors} style={styles.iconRing}>
        <View style={styles.iconBg}>
          <Ionicons name={item.icon} size={84} color="#fff" />
        </View>
      </LinearGradient>
      <View style={styles.chipWrap}>
        <Text style={styles.chip}>{item.chip}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <ScreenBackground>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={renderItem}
        style={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        {!isLast ? (
          <Pressable onPress={() => goTo(index + 1)} style={styles.skipRow}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        ) : null}

        {isLast ? (
          <GradientButton title="Get Started" onPress={onDone} icon={<Ionicons name="sparkles" size={20} color="#fff" />} />
        ) : null}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 0 },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 70,
  },
  iconRing: {
    width: 190,
    height: 190,
    borderRadius: 95,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D7CFE',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  iconBg: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  chipWrap: {
    marginTop: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chip: {
    color: colors.neonSky,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Poppins_600SemiBold',
  },
  title: {
    marginTop: 18,
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    marginTop: 12,
    color: colors.textSoft,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Poppins_400Regular',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 5,
  },
  dotActive: {
    width: 26,
    backgroundColor: colors.neonBlue,
  },
  skipRow: {
    paddingVertical: 14,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
  },
});
