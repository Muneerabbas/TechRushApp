import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React, { Component,useState } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios';

axios.defaults.baseURL = 'https://vienna-remarkable-think-asylum.trycloudflare.com/api'

export default function _layout() {
 
    const [active, setActive] = useState(false);

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'black',

          headerShown: false,
          tabBarStyle: {
            elevation:9,
            position: 'absolute',
            height: '8%',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: 'white',
            overflow: 'hidden',
          }
        }}>

<Tabs.Screen
          name="social"
          
          options={{
            title: 'Social',
            tabBarLabelStyle: {
              fontFamily: 'Poppins-SemiBold', 
              fontSize: 10,
            },
            tabBarIcon:({color})=><Ionicons name="happy-outline" size={25} color='#333333'  />,
          tabBarActiveBackgroundColor:"#E5C54F"

          }}
        />
        
        <Tabs.Screen
          name="index"

          options={{
            title: 'Pay',
            tabBarLabelStyle: {
              fontFamily: 'Poppins-SemiBold', 
              fontSize: 10,
            },
            tabBarIcon:({color})=><Ionicons name="cash-outline" size={25} color='#333333'  />,
            tabBarActiveBackgroundColor:"#E5C54F"


          }}
        />
     
         <Tabs.Screen
          name="transctions"
          
          options={{
            title: 'Transctions',
            tabBarLabelStyle: {
              fontFamily: 'Poppins-SemiBold', 
              fontSize: 10,
            },
            tabBarIcon:({color})=><Ionicons name="receipt-outline" size={25} color='#333333'  />,
            tabBarActiveBackgroundColor:"#E5C54F"

          }}
        />
         
    
        



        
      </Tabs>
    )
  }



