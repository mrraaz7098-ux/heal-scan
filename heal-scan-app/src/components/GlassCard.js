import { StyleSheet, View } from 'react-native';
import { colors, radii, shadow3D } from '../theme';

export default function GlassCard({
  children,
  style,
  glow,
  onPress: PressableProps,
}) {
  return (
    <View
      style={[
        styles.card,
        glow && styles.glow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(22, 38, 56, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.lg,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  glow: {
    borderColor: 'rgba(77,124,254,0.4)',
    shadowColor: '#4D7CFE',
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },
});
