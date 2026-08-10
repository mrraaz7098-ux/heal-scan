import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'healscan_history_v1';
const PROFILE_KEY = 'healscan_profile_v1';
const SETTINGS_KEY = 'healscan_settings_v1';
const ONBOARDING_KEY = 'healscan_onboarding_done_v1';
const USER_KEY = 'healscan_user_id_v1';

export function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    return [];
  }
}

export async function saveScan(record) {
  const list = await getHistory();
  const withMeta = {
    id: record.id || uid(),
    createdAt: record.createdAt || Date.now(),
    ...record,
  };
  const existingIndex = list.findIndex((s) => s.id === withMeta.id);
  if (existingIndex >= 0) {
    list[existingIndex] = withMeta;
  } else {
    list.unshift(withMeta);
  }
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  return withMeta;
}

export async function deleteScan(id) {
  const list = await getHistory();
  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(list.filter((s) => s.id !== id))
  );
}

export async function clearHistory() {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}

export async function getProfile() {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw
      ? JSON.parse(raw)
      : { name: '', email: '', createdAt: Date.now() };
  } catch (e) {
    return { name: '', email: '', createdAt: Date.now() };
  }
}

export async function saveProfile(profile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return (
      raw || {
        notifications: true,
        language: 'English',
        saveHistory: true,
        syncEnabled: false,
      }
    );
  } catch (e) {
    return { notifications: true, language: 'English', saveHistory: true, syncEnabled: false };
  }
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function getUserId() {
  try {
    let id = await AsyncStorage.getItem(USER_KEY);
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      await AsyncStorage.setItem(USER_KEY, id);
    }
    return id;
  } catch (e) {
    return `user_${Date.now()}`;
  }
}

export async function isOnboardingDone() {
  try {
    const v = await AsyncStorage.getItem(ONBOARDING_KEY);
    return v === 'true';
  } catch (e) {
    return false;
  }
}

export async function setOnboardingDone() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
