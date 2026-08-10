import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, gradients, radii, shadow3D } from '../theme';

export default function GradientButton({
  title,
  colors: buttonColors,
  icon,
  onPress,
  style,
  disabled,
  loading,
  size = 'lg',
  textColor = '#fff',
}) {
  const scale = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const pressed = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 4, useNativeDriver: true }),
    ]).start();
  };

  const released = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  const pad = size === 'lg' ? { paddingVertical: 18 } : { paddingVertical: 12 };

  return (
    <Animated.View
      style={[
        styles.wrap,
        shadow3D,
        { transform: [{ scale }, { translateY }] },
        style,
      ]}
    >
      <Pressable
        onPressIn={pressed}
        onPressOut={released}
        onPress={onPress}
        disabled={disabled || loading}
        style={styles.pressable}
      >
        <LinearGradient
          colors={buttonColors || gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, pad]}
        >
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
          <Text
            style={[
              styles.title,
              { color: textColor },
              size === 'sm' && styles.titleSm,
            ]}
          >
            {loading ? 'Analyzing...' : title}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.md,
  },
  pressable: {
    borderRadius: radii.md,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  iconWrap: {
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  titleSm: {
    fontSize: 14,
  },
});
