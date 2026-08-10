import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import TabNavigator from './TabNavigator';
import ScannerScreen from '../screens/ScannerScreen';
import HealthResultScreen from '../screens/HealthResultScreen';
import FoodResultScreen from '../screens/FoodResultScreen';

const Stack = createNativeStackNavigator();

function HealthScannerRoute(props) {
  return <ScannerScreen {...props} mode="health" />;
}

function FoodScannerRoute(props) {
  return <ScannerScreen {...props} mode="food" />;
}

export default function AppNavigator({ onboardingDone, onOnboardingDone }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#001117' },
        }}
      >
        {!onboardingDone ? (
          <Stack.Screen name="Onboarding">
            {(props) => <OnboardingScreen {...props} onDone={onOnboardingDone} />}
          </Stack.Screen>
        ) : null}

        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="HealthScanner"
          component={HealthScannerRoute}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="FoodScanner"
          component={FoodScannerRoute}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="HealthResult" component={HealthResultScreen} />
        <Stack.Screen name="FoodResult" component={FoodResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
