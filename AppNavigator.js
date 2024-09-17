import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CombinedScreen from '../Screens/CombinedScreen';
import SyncContactsScreen from '../Screens/SyncContactsScreen';
import NariAssistScreen from '../Screens/NariAssistScreen';
import SheShieldScreen from '../Screens/SheShieldScreen';
import GuidelinesScreen from '../Screens/GuidelinesScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="CombinedScreen" component={CombinedScreen} />
    <Stack.Screen name="GuidelinesScreen" component={GuidelinesScreen} />
    <Stack.Screen name="NariAssistScreen" component={NariAssistScreen} />
    <Stack.Screen name="SyncContactsScreen" component={SyncContactsScreen} />
    <Stack.Screen name="SheShieldScreen" component={SheShieldScreen} />
  </Stack.Navigator>
);

export default AppNavigator;

