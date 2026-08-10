import { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import { getProfile, getSettings, saveProfile, saveSettings } from '../storage';
import { colors, radii, spacing } from '../theme';

function SettingRow({ icon, color, title, subtitle, children }) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.settingSub}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '' });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setProfile(await getProfile());
        setSettings(await getSettings());
      })();
    }, [])
  );

  const toggleSetting = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  };

  const saveProfileEdit = async () => {
    const next = { ...profile, name: draft.name.trim(), email: draft.email.trim() };
    setProfile(next);
    await saveProfile(next);
    setEditing(false);
    Alert.alert('Saved', 'Profile updated.');
  };

  if (!profile || !settings) return <ScreenBackground />;

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile & Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons
                name="person-outline"
                size={34}
                color={colors.text}
              />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>
                {profile.name || 'Heal Scan User'}
              </Text>
              <Text style={styles.profileEmail}>
                {profile.email || 'Add your email to personalize'}
              </Text>
            </View>
            <Text style={styles.editBtn} onPress={() => { setDraft({ name: profile.name, email: profile.email }); setEditing(!editing); }}>
              {editing ? 'Cancel' : 'Edit'}
            </Text>
          </View>

          {editing ? (
            <View style={styles.editCard}>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.textMuted}
                value={draft.name}
                onChangeText={(name) => setDraft({ ...draft, name })}
              />
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                placeholder="Email address"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                value={draft.email}
                onChangeText={(email) => setDraft({ ...draft, email })}
              />
              <Text style={styles.saveBtn} onPress={saveProfileEdit}>
                Save Profile
              </Text>
            </View>
          ) : null}

          <Text style={styles.sectionLabel}>App Settings</Text>

          <View style={styles.settingsCard}>
            <SettingRow
              icon="notifications-outline"
              color={colors.neonBlue}
              title="Notifications"
              subtitle="Scan reminders and tips"
            >
              <Switch
                value={settings.notifications !== false}
                onValueChange={(v) => toggleSetting('notifications', v)}
                trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#4D7CFE' }}
                thumbColor="#fff"
              />
            </SettingRow>

            <View style={styles.divider} />

            <SettingRow
              icon="save-outline"
              color={colors.neonGreen}
              title="Save scan history"
              subtitle="Store scans locally on this device"
            >
              <Switch
                value={settings.saveHistory !== false}
                onValueChange={(v) => toggleSetting('saveHistory', v)}
                trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#00E5A0' }}
                thumbColor="#fff"
              />
            </SettingRow>

            <View style={styles.divider} />

            <SettingRow
              icon="cloud-upload-outline"
              color={colors.neonSky}
              title="Sync scans to cloud"
              subtitle="Back up history across devices"
            >
              <Switch
                value={settings.syncEnabled === true}
                onValueChange={(v) => toggleSetting('syncEnabled', v)}
                trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#00A3FF' }}
                thumbColor="#fff"
              />
            </SettingRow>

            <View style={styles.divider} />

            <SettingRow
              icon="language-outline"
              color={colors.neonPurple}
              title="Language"
              subtitle={settings.language || 'English'}
            >
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </SettingRow>
          </View>

          <Text style={styles.sectionLabel}>About</Text>

          <View style={styles.settingsCard}>
            <SettingRow icon="shield-checkmark-outline" color={colors.success} title="Disclaimer" subtitle="Not a medical diagnosis">
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </SettingRow>
            <View style={styles.divider} />
            <SettingRow icon="lock-closed-outline" color={colors.neonBlue} title="Privacy Policy" subtitle="Your data stays on your device">
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </SettingRow>
            <View style={styles.divider} />
            <SettingRow icon="star-outline" color={colors.warning} title="Rate App">
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </SettingRow>
            <View style={styles.divider} />
            <SettingRow icon="information-circle-outline" color={colors.neonPurple} title="Version" subtitle="Heal Scan 1.0.0" />
          </View>

          <Text
            style={styles.privacyNote}
            onPress={() =>
              Alert.alert(
                'Heal Scan Privacy',
                'Scan history and profile are stored locally on your device. Photos are sent to the AI provider only when you run a scan. Heal Scan provides informational analysis only and is not a medical device or diagnosis tool.'
              )
            }
          >
            How your data is used — tap to read
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
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
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22,38,56,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.lg,
    padding: 16,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(77,124,254,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(77,124,254,0.4)',
  },
  profileText: { flex: 1, marginLeft: 14 },
  profileName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  profileEmail: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3,
    fontFamily: 'Poppins_400Regular',
  },
  editBtn: {
    color: colors.neonBlue,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  editCard: {
    backgroundColor: 'rgba(22,38,56,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.lg,
    padding: 16,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  saveBtn: {
    color: colors.neonGreen,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'right',
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 10,
    fontFamily: 'Poppins_500Medium',
  },
  settingsCard: {
    backgroundColor: 'rgba(22,38,56,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radii.lg,
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: { flex: 1 },
  settingTitle: {
    color: colors.text,
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'Poppins_500Medium',
  },
  settingSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  privacyNote: {
    color: colors.textMuted,
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 26,
    textDecorationLine: 'underline',
    fontFamily: 'Poppins_400Regular',
  },
});
