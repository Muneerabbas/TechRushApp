import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../state/AuthContext';
import * as authApi from '../api/authApi';
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
            const { token, user } = response.data;

            console.log("Login success:", user);

            await loginContext(token, user);
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
            Alert.alert("Success", "Registration complete!");
            router.replace('/login');
        } catch (err) {
            Alert.alert("Signup Failed", err.response?.data?.message || "Please try again.");
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
