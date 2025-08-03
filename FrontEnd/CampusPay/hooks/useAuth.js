import { useState, useContext } from 'react';
import { AuthContext } from '../state/AuthContext';
import * as authApi from '../api/authApi';
import { useRouter } from 'expo-router';
import Alert from 'react-native'
export const useAuth = () => {
    const { login: loginContext, logout: logoutContext } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
        const response = await authApi.loginUser(email, password);
        console.log(response.data); 
        await loginContext(response.data.token, response.data.user);
        router.replace('/(tabs)');
    } catch (err) {
        console.error("Login error:", err);
        Alert.alert("Login Failed", err.response?.data?.message || "Please check your credentials.");
        setError(err.response?.data?.message || 'Login failed.');
        return Promise.reject(err);
    } finally {
        setLoading(false);
    }
};


    const signup = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            await authApi.registerUser(name, email, password);
            router.replace('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed.');
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await logoutContext();
    };

    return { login, signup, logout, loading, error };
};