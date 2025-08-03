import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import colors from '../../assets/utils/colors';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: colors.primary,
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                height: 90,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                backgroundColor: 'white',
                overflow: 'hidden',
                borderTopWidth: 0,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Pay',
                    tabBarLabelStyle: { fontFamily: 'Poppins-SemiBold', fontSize: 10 },
                    tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "cash" : "cash-outline"} size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="social"
                options={{
                    title: 'Social',
                    tabBarLabelStyle: { fontFamily: 'Poppins-SemiBold', fontSize: 10 },
                    tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "happy" : "happy-outline"} size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transactions',
                    tabBarLabelStyle: { fontFamily: 'Poppins-SemiBold', fontSize: 10 },
                    tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "receipt" : "receipt-outline"} size={25} color={color} />,
                }}
            />
        </Tabs>
    );
}
