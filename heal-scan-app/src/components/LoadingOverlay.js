import { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '../theme';

export default function LoadingOverlay({ visible, message }) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
    return () => {
      spin.stopAnimation();
      pulse.stopAnimation();
    };
  }, [visible]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={styles.halo} />
          <LinearGradient colors={gradients.scan} style={styles.ringWrap}>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Ionicons name="scan-outline" size={52} color="#fff" />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
        <Text style={styles.title}>{message || 'Analyzing image...'}</Text>
        <Text style={styles.subtitle}>
          Our AI is reviewing the image. This usually takes a few seconds.
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,17,23,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  halo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(77,124,254,0.25)',
    top: -25,
    left: -25,
  },
  ringWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  title: {
    marginTop: 40,
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
});
