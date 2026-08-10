import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import { clearHistory, deleteScan, getHistory, getSettings } from '../storage';
import { fetchCloudHistory } from '../api';
import { colors, radii, spacing } from '../theme';

const FILTERS = ['All', 'Health', 'Food'];

export default function HistoryScreen({ navigation }) {
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const local = await getHistory();
        setScans(local);

        const settings = await getSettings();
        if (!settings.syncEnabled) return;

        try {
          const cloud = await fetchCloudHistory();
          const byId = new Map(local.map((s) => [s.id, s]));
          cloud.forEach((c) => {
            if (!byId.has(c.id)) byId.set(c.id, c);
          });
          const merged = [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
          setScans(merged);
        } catch (e) {}
      })();
    }, [])
  );

  const filtered = scans.filter((s) => {
    const matchFilter = filter === 'All' || s.type === filter.toLowerCase();
    const matchQuery =
      !query ||
      (s.title || '').toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const onClearAll = () => {
    Alert.alert('Clear history', 'Delete all saved scans? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setScans([]);
        },
      },
    ]);
  };

  const onLongPress = (item) => {
    Alert.alert(item.title || 'Scan', 'Delete this scan?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteScan(item.id);
          setScans(await getHistory());
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const isHealth = item.type === 'health';
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() =>
          navigation.navigate(isHealth ? 'HealthResult' : 'FoodResult', {
            record: item,
            autoSaved: true,
          })
        }
        onLongPress={() => onLongPress(item)}
      >
        <View style={styles.thumbWrap}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
          ) : (
            <Ionicons
              name={isHealth ? 'medical-outline' : 'restaurant-outline'}
              size={26}
              color={isHealth ? colors.neonBlue : colors.neonGreen}
            />
          )}
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: isHealth ? 'rgba(77,124,254,0.2)' : 'rgba(0,229,160,0.2)' },
            ]}
          >
            <Text style={[styles.typeBadgeText, { color: isHealth ? colors.neonBlue : colors.neonGreen }]}>
              {isHealth ? 'Health' : 'Food'}
            </Text>
          </View>
        </View>

        <View style={styles.cardText}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title || 'Scan'}
          </Text>
          <Text style={styles.cardDate}>
            {new Date(item.createdAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.rowArrow}>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
          {scans.length > 0 ? (
            <Pressable onPress={onClearAll}>
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search scans..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[styles.filterChip, filter === f && styles.filterActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="folder-open-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No scans found</Text>
              <Text style={styles.emptySub}>
                {query || filter !== 'All'
                  ? 'Try a different search or filter'
                  : 'Your saved scans will appear here'}
              </Text>
            </View>
          }
        />
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
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  clear: {
    color: colors.danger,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    backgroundColor: 'rgba(22,38,56,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: 14,
    marginBottom: 16,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterActive: {
    backgroundColor: 'rgba(77,124,254,0.25)',
    borderColor: 'rgba(77,124,254,0.6)',
  },
  filterText: {
    color: colors.textSoft,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  filterTextActive: {
    color: colors.neonBlue,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22,38,56,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.lg,
    padding: 12,
  },
  pressed: { opacity: 0.75 },
  thumbWrap: {
    width: 58,
    height: 58,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { width: '100%', height: '100%' },
  typeBadge: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: radii.pill,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  cardText: { flex: 1, marginLeft: 12 },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins_500Medium',
  },
  cardDate: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
    fontFamily: 'Poppins_400Regular',
  },
  rowArrow: { marginLeft: 8 },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: colors.textSoft,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 14,
    fontFamily: 'Poppins_500Medium',
  },
  emptySub: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});
