import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

const toneColors = {
  low: { bg: 'rgba(0,229,160,0.14)', fg: colors.success },
  moderate: { bg: 'rgba(255,194,75,0.14)', fg: colors.warning },
  high: { bg: 'rgba(255,84,112,0.14)', fg: colors.danger },
  blue: { bg: 'rgba(77,124,254,0.14)', fg: colors.neonBlue },
  purple: { bg: 'rgba(139,92,246,0.14)', fg: colors.neonPurple },
  green: { bg: 'rgba(0,229,160,0.14)', fg: colors.success },
  orange: { bg: 'rgba(255,159,69,0.16)', fg: colors.neonOrange },
  neutral: { bg: 'rgba(255,255,255,0.08)', fg: colors.textSoft },
};

export default function Chip({ label, tone = 'neutral', icon, onPress, style }) {
  const t = toneColors[tone] || toneColors.neutral;
  const inner = (
    <View style={[styles.chip, { backgroundColor: t.bg }, style]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.press}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  press: { alignSelf: 'flex-start' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'flex-start',
  },
  icon: { marginRight: 6 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Poppins_500Medium',
  },
});
