// app/(tabs)/_layout.jsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import colors from '../assets/utils/colors';
import { Platform } from 'react-native';

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary || '#000',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 11,
          marginBottom: Platform.OS === 'ios' ? 5 : 3,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 95 : 75, 
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: 'hidden', 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
          paddingBottom: Platform.OS === 'ios' ? 15 : 8,
        },
      }}
    >
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={26}
              color={focused ? colors.primary : color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={26}
              color={focused ? colors.primary : color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transctions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'receipt' : 'receipt-outline'}
              size={26}
              color={focused ? colors.primary : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
