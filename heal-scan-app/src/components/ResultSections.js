import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii } from '../theme';

export function SectionCard({ title, icon, tone = 'blue', children, style }) {
  const toneColors = {
    blue: colors.neonBlue,
    green: colors.success,
    orange: colors.neonOrange,
    red: colors.danger,
    yellow: colors.warning,
    purple: colors.neonPurple,
  };
  const c = toneColors[tone] || colors.neonBlue;
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBubble, { backgroundColor: `${c}22` }]}>
          <Ionicons name={icon} size={17} color={c} />
        </View>
        <Text style={[styles.cardTitle, { color: c }]}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

export function BulletRow({ icon, color, text, sub }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletIcon}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <View style={styles.bulletTextWrap}>
        <Text style={styles.bulletText}>{text}</Text>
        {sub ? <Text style={styles.bulletSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

export function UrgencyBadge({ level }) {
  const map = {
    Low: { color: colors.success, bg: 'rgba(0,229,160,0.15)', icon: 'checkmark-circle' },
    Moderate: { color: colors.warning, bg: 'rgba(255,194,75,0.15)', icon: 'warning' },
    High: { color: colors.danger, bg: 'rgba(255,84,112,0.15)', icon: 'alert-circle' },
  };
  const m = map[level] || map.Low;
  return (
    <View style={[styles.badge, { backgroundColor: m.bg }]}>
      <Ionicons name={m.icon} size={18} color={m.color} />
      <Text style={[styles.badgeText, { color: m.color }]}>{level} urgency</Text>
    </View>
  );
}

export function ResultImage({ uri, height = 190 }) {
  return (
    <View style={[styles.imageWrap, { height }]}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      <View style={styles.imageGlow} />
    </View>
  );
}

export function DisclaimerBox({ text }) {
  return (
    <View style={styles.disclaimer}>
      <Ionicons name="information-circle-outline" size={18} color={colors.warning} />
      <Text style={styles.disclaimerText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(22,38,56,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  cardBody: {},
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  bulletTextWrap: { flex: 1 },
  bulletText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  bulletSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  imageWrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 14,
  },
  image: { width: '100%', height: '100%' },
  imageGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,194,75,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,194,75,0.25)',
    borderRadius: radii.md,
    padding: 14,
    marginTop: 4,
    marginBottom: 6,
  },
  disclaimerText: {
    color: colors.textSoft,
    fontSize: 12.5,
    lineHeight: 19,
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
  },
});
