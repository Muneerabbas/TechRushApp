// api/transactionApi.js
import axiosInstance from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTransactionHistory = async () => {
  return axiosInstance.get('/transactions/history');
};

export const getUserId = async () => {
  return await AsyncStorage.getItem('userID');
};
