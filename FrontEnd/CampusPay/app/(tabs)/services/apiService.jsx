import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const axiosInstance = axios.create({
  baseURL: 'https://techrush-backend.onrender.com/api',
});

const setAuthToken = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};


export const getMyProfile = async () => {
    await setAuthToken();
    const response = await axiosInstance.get('/auth/me');
    return response.data;
};


export const search = async (query) => {
  if (!query.trim()) return { users: [], clubs: [], events: [], groups: [] };
  await setAuthToken();
  const response = await axiosInstance.get('/search', { params: { query } });
  return response.data;
};


export const createClub = async (formData) => {
    await setAuthToken();
    try {
        const response = await axiosInstance.post('/clubs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Success', 'Club created successfully!');
        return response.data;
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to create club.');
        throw error;
    }
};

export const getAllClubs = async () => {
  await setAuthToken();
  const response = await axiosInstance.get('/clubs');
  return response.data;
};

export const getClubDetails = async (clubId) => {
  await setAuthToken();
  const response = await axiosInstance.get(`/clubs/${clubId}`);
  return response.data;
};

export const joinClub = async (clubId) => {
  await setAuthToken();
  const response = await axiosInstance.post(`/clubs/${clubId}/join`);
  return response.data;
};

// --- EVENT APIs ---

export const createEvent = async (formData) => {
    await setAuthToken();
    try {
        const response = await axiosInstance.post('/events', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Success', 'Event created successfully!');
        return response.data;
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to create event.');
        throw error;
    }
};
export const searchUsers = async (query) => {
  if (!query.trim()) return [];
  await setAuthToken();
  const response = await axiosInstance.get('/search', { params: { query } });
  return response.data.users || [];
};

export const getAllPublicEvents = async () => {
  await setAuthToken();
  const response = await axiosInstance.get('/events');
  return response.data;
};

export const getEventDetails = async (eventId) => {
  await setAuthToken();
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data;
};

export const registerForEvent = async (eventId) => {
  await setAuthToken();
  const response = await axiosInstance.post(`/events/${eventId}/register`);
  return response.data;
};

// --- SOCIAL POST APIs ---

export const getSocialFeed = async () => {
  await setAuthToken();
  const [clubs, events, socials] = await Promise.all([
    axiosInstance.get("/clubs"),
    axiosInstance.get("/events"),
    axiosInstance.get("/social/community"),
  ]);
  return { clubs: clubs.data, events: events.data, socials: socials.data };
};

export const shareActivity = async (formData) => {
  await setAuthToken();
  const response = await axiosInstance.post('/social', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// --- TRANSACTION APIs ---

export const getTransactionHistory = async () => {
  await setAuthToken();
  const response = await axiosInstance.get('/transactions/history');
  return response.data;
};

export const sendPayment = async (receiverId, amount, description) => {
    await setAuthToken();
    const response = await axiosInstance.post('/transactions/send', { receiverId, amount, description });
    return response.data;
};

// --- GROUP APIs ---

export const createGroup = async (name, participants, description) => {
    await setAuthToken();
    const response = await axiosInstance.post('/groups', { name, participants, description });
    return response.data;
};

export const getGroupDetails = async (groupId) => {
    await setAuthToken();
    const response = await axiosInstance.get(`/groups/${groupId}`);
    return response.data;
};

export const getGroupActivity = async (groupId) => {
    await setAuthToken();
    const response = await axiosInstance.get(`/groups/${groupId}/activity`);
    return response.data;
};

export const sendGroupMessage = async (groupId, formData) => {
    await setAuthToken();
    const response = await axiosInstance.post(`/groups/${groupId}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const splitBill = async (groupId, totalAmount, description, splits) => {
    await setAuthToken();
    const response = await axiosInstance.post(`/groups/${groupId}/split-bill`, { totalAmount, description, splits });
    return response.data;
};

export const settlePayment = async (billId) => {
    await setAuthToken();
    const response = await axiosInstance.post(`/bills/${billId}/settle`);
    return response.data;
};


export const getNotifications = async () => {
    await setAuthToken();
    const response = await axiosInstance.get('/notifications');
    return response.data;
};
