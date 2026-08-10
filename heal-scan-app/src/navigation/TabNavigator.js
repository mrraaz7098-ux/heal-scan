import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, radii } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: 'home-outline',
  HomeActive: 'home',
  Scan: 'scan-outline',
  ScanActive: 'scan',
  History: 'time-outline',
  HistoryActive: 'time',
  Profile: 'person-outline',
  ProfileActive: 'person',
};

const TAB_COLORS = {
  Home: colors.neonBlue,
  Scan: colors.neonGreen,
  History: colors.neonPurple,
  Profile: colors.neonOrange,
};

function TabIcon({ name, focused }) {
  const active = focused ? `${name}Active` : name;
  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: `${TAB_COLORS[name]}22` }]}>
      <Ionicons
        name={TAB_ICONS[active]}
        size={focused ? 23 : 22}
        color={focused ? TAB_COLORS[name] : colors.textMuted}
      />
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(10, 20, 28, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 82,
    paddingTop: 8,
    paddingBottom: 20,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    fontWeight: '600',
  },
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
