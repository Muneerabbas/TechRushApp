import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React, { Component,useState } from 'react'
import { Text, View } from 'react-native'

export default function _layout() {
 
    const [active, setActive] = useState(false);

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'black',

          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            height: 90,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: 'white',
            overflow: 'hidden', // needed for Android clippin
          }
        }}>

<Tabs.Screen
          name="social"
          
          options={{
            title: 'Social',
            // tabBarIcon: ({color})=><Ionicons name="settings" size={20} color= '#333333' />,
            tabBarIcon:({color})=><Ionicons name="happy-outline" size={25} color='#333333'  />,
          tabBarActiveBackgroundColor:"#E5C54F"

          }}
        />
        
        <Tabs.Screen
          name="index"

          options={{
            title: 'Pay',
            tabBarIcon:({color})=><Ionicons name="cash-outline" size={25} color='#333333'  />,
            tabBarActiveBackgroundColor:"#E5C54F"


          }}
        />
     
         <Tabs.Screen
          name="transctions"
          
          options={{
            title: 'Transctions',
            // tabBarIcon: ({color})=><Ionicons name="settings" size={20} color= '#333333' />,
            tabBarIcon:({color})=><Ionicons name="receipt-outline" size={25} color='#333333'  />,
            tabBarActiveBackgroundColor:"#E5C54F"

          }}
        />
         
    
        



        
      </Tabs>
    )
  }



