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
          fontSize: 10,
          marginBottom: 5,
        },
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 90 : 70,
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'happy' : 'happy-outline'}
              size={24}
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
              name={focused ? 'cash' : 'cash-outline'}
              size={24}
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
              size={24}
              color={focused ? colors.background : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
