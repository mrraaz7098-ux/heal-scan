import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { isOnboardingDone, setOnboardingDone } from './src/storage';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [onboardingDone, setOnboardingDoneState] = useState(null);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    (async () => {
      const done = await isOnboardingDone();
      setOnboardingDoneState(done);
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded && onboardingDone !== null) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, onboardingDone]);

  const handleOnboardingDone = useCallback(async () => {
    await setOnboardingDone();
    setOnboardingDoneState(true);
  }, []);

  if (!fontsLoaded || onboardingDone === null) {
    return <View style={styles.loading} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator onboardingDone={onboardingDone} onOnboardingDone={handleOnboardingDone} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
