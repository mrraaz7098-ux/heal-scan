import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import ScanModeCard from '../components/ScanModeCard';
import IconButton from '../components/IconButton';
import { getHistory } from '../storage';
import { colors, radii, spacing } from '../theme';

const quickScans = [
  { label: 'Skin', icon: 'body-outline', tone: 'blue' },
  { label: 'Eye', icon: 'eye-outline', tone: 'purple' },
  { label: 'Hair', icon: 'sparkles-outline', tone: 'green' },
  { label: 'Food', icon: 'restaurant-outline', tone: 'orange' },
];

export default function HomeScreen({ navigation }) {
  const [recent, setRecent] = useState([]);
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setRecent);
    }, [])
  );

  const renderRecent = ({ item }) => (
    <Pressable
      style={styles.recentCard}
      onPress={() =>
        navigation.navigate(
          item.type === 'health' ? 'HealthResult' : 'FoodResult',
          { record: item }
        )
      }
    >
      <View style={styles.recentThumb}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumbImg} />
        ) : (
          <Ionicons
            name={item.type === 'health' ? 'body-outline' : 'restaurant-outline'}
            size={26}
            color={item.type === 'health' ? colors.neonBlue : colors.neonGreen}
          />
        )}
      </View>
      <View style={styles.recentText}>
        <Text style={styles.recentTitle} numberOfLines={1}>
          {item.title || 'Scan'}
        </Text>
        <Text style={styles.recentDate}>
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.welcome}>Welcome to Heal Scan</Text>
          </View>
          <IconButton
            name="notifications-outline"
            onPress={() => {}}
            bg="rgba(255,255,255,0.06)"
          />
        </View>

        <View style={styles.cards}>
          <ScanModeCard
            title="AI Health Scan"
            subtitle="Analyze skin symptoms instantly"
            icon="medical-outline"
            tone="health"
            onPress={() => navigation.navigate('HealthScanner')}
          />
          <ScanModeCard
            title="AI Food Scan"
            subtitle="Discover nutrition in seconds"
            icon="nutrition-outline"
            tone="food"
            onPress={() => navigation.navigate('FoodScanner')}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Scan</Text>
        <View style={styles.quickRow}>
          {quickScans.map((q) => (
            <Pressable
              key={q.label}
              style={styles.quickItem}
              onPress={() =>
                navigation.navigate(
                  q.label === 'Food' ? 'FoodScanner' : 'HealthScanner'
                )
              }
            >
              <View style={styles.quickIconWrap}>
                <Ionicons name={q.icon} size={24} color={colors.text} />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <Pressable onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {recent.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="scan-outline" size={34} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptySub}>
              Your scan history will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={recent.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={renderRecent}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 22,
  },
  greeting: {
    color: colors.neonSky,
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    letterSpacing: 0.5,
  },
  welcome: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: 'Poppins_700Bold',
  },
  cards: {
    gap: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 26,
  },
  quickItem: {
    alignItems: 'center',
    width: 74,
  },
  quickIconWrap: {
    width: 58,
    height: 58,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    color: colors.textSoft,
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 4,
  },
  seeAll: {
    color: colors.neonBlue,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22,38,56,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.md,
    padding: 12,
  },
  recentThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  recentText: {
    flex: 1,
    marginLeft: 12,
  },
  recentTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins_500Medium',
  },
  recentDate: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: 'rgba(22,38,56,0.4)',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    color: colors.textSoft,
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins_500Medium',
  },
  emptySub: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
});
