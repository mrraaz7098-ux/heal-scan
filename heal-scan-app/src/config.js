import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_PORT = 4000;

function getDevHost() {
  try {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri && typeof hostUri === 'string') {
      return hostUri.split(':')[0];
    }
  } catch (e) {}
  return null;
}

const devHost = getDevHost();

export const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://localhost:${DEFAULT_PORT}`
    : devHost
      ? `http://${devHost}:${DEFAULT_PORT}`
      : `http://localhost:${DEFAULT_PORT}`;
