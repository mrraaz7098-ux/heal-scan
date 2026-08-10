import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated } from 'react-native';
import { colors, gradients, radii, shadow3D } from '../theme';

export default function ScanModeCard({ title, subtitle, icon, tone, onPress }) {
  const scale = useRef(new Animated.Value(0)).current;
  const c = tone === 'health' ? gradients.health : gradients.food;
  const accent = tone === 'health' ? colors.neonBlue : colors.neonGreen;
  const accentSoft = tone === 'health' ? 'rgba(77,124,254,0.22)' : 'rgba(0,229,160,0.22)';

  return (
    <Animated.View
      style={[styles.wrap, shadow3D, { transform: [{ scale }] }]}
    >
      <Pressable
        onPressIn={() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch (e) {}
          Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
        }}
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
        }
        onPress={onPress}
      >
        <LinearGradient
          colors={c}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.iconHalo}>
            <Ionicons name={icon} size={40} color="#fff" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={[styles.arrow, { backgroundColor: accentSoft }]}>
            <Ionicons name="arrow-forward" size={20} color={accent} />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    padding: 20,
    minHeight: 112,
  },
  iconHalo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  textWrap: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
