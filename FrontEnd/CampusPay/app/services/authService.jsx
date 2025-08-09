import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://techrush-backend.onrender.com/api',
});

export const registerUser = async (name, email, password, image) => {
  const userdata = new FormData();
  userdata.append('name', name);
  userdata.append('email', email);
  userdata.append('password', password);

  if (image) {
    const filename = image.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    userdata.append('profilePicture', { uri: image.uri, name: filename, type });
  }

  try {
    const response = await axiosInstance.post('/auth/register', userdata, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Signup API error:', error.response?.data || error.message);
    Alert.alert('Registration Failed', error.response?.data?.message || 'An unexpected error occurred.');
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userID', user._id);
    await AsyncStorage.setItem('name', user.name);
    await AsyncStorage.setItem('email', user.email);
    await AsyncStorage.setItem('role', user.role);
    await AsyncStorage.setItem('userPin', '1234'); // Placeholder PIN

    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    Alert.alert('Login Failed', error.response?.data?.message || 'An unexpected error occurred.');
    throw error;
  }
};
