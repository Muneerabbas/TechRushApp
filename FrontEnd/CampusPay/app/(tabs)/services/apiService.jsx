import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://techrush-backend.onrender.com/api',
});

const setAuthToken = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const searchUsers = async (query) => {
  if (!query.trim()) return [];
  await setAuthToken();
  const response = await axiosInstance.get('/search', { params: { query } });
  return response.data.users || [];
};

export const getSocialFeed = async () => {
  await setAuthToken();
  const [clubs, events, socials] = await Promise.all([
    axiosInstance.get("/clubs"),
    axiosInstance.get("/events"),
    axiosInstance.get("/social/community"),
  ]);
  return { clubs: clubs.data, events: events.data, socials: socials.data };
};

export const getTransactionHistory = async () => {
    await setAuthToken();
    const response = await axiosInstance.get('/transactions/history');
    return response.data;
};
