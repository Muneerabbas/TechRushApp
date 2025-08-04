// AuthContext.js
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token,user) => {
    setToken(token);
    await AsyncStorage.setItem('authToken', token);
     await AsyncStorage.setItem("userID", user._id);
      await AsyncStorage.setItem("userName", user.name);
      await AsyncStorage.setItem("userRole",user.role);
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('authToken');
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) setToken(storedToken);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
