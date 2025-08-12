import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import axios from 'axios';
import { LogBox } from 'react-native';

if (__DEV__) {
  LogBox.ignoreAllLogs(true);           
  console.log = () => {};            
  console.warn = () => {};             
  console.error = () => {};            
}
axios.defaults.baseURL = 'https://techrush-backend.onrender.com/api'
export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    }

    checkLogin();
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return isLoggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/startup" />;
}
