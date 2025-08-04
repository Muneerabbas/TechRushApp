import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const useHomeActions = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState(null);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      router.replace('/startup');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return {
    handleOpenCamera,
    handleSignOut,
    imageUri,
  };
};
