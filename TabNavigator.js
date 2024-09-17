import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NariAssistScreen from './path/to/NariAssistScreen';
import SheShieldScreen from './path/to/SheShieldScreen.js';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="NariAssistScreen" // Must match the name used in navigate
      component={NariAssistScreen}
      options={{ title: 'Nari Assist' }}
    />
      <Tab.Screen
      name="SyncContactsScreen" // Must match the name used in navigate
      component={SyncContactsScreen}
      options={{ title: 'Sync' }}
    />
     <Tab.Screen
      name="SheShieldScreen" // Must match the name used in navigate
      component={SheShieldScreen}
      options={{ title: 'SheShieldScreen' }}
    />
    {/* Add other screens here if needed */}
  </Tab.Navigator>
);

export default TabNavigator;
