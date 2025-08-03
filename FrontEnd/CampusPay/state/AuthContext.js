import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrapAsync = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            setToken(userToken);
            if (userToken) {
                try {
                    const response = await axiosInstance.get('/auth/me');
                    setUser(response.data);
                } catch (e) {
                    await AsyncStorage.removeItem('userToken');
                    setToken(null);
                }
            }
            setIsLoading(false);
        };
        bootstrapAsync();
    }, []);

    const authContext = {
        login: async (apiToken, apiUser) => {
            setToken(apiToken);
            setUser(apiUser);
            await AsyncStorage.setItem('userToken', apiToken);
        },
        logout: async () => {
            setToken(null);
            setUser(null);
            await AsyncStorage.removeItem('userToken');
        },
        token,
        user,
        isLoading,
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};