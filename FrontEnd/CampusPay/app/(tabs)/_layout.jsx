import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import colors from '../assets/utils/colors';
import { Platform } from 'react-native';

export default function _layout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text || '#000',
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
          backgroundColor: 'white',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarActiveBackgroundColor: colors.secondary,
      }}
    >
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => (
            <Ionicons name="happy-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="transctions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
