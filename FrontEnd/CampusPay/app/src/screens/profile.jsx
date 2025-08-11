import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/utils/colors';
import LogoutAlert from '../../components/LogoutAlert';
import { getMyProfile } from '../../(tabs)/services/apiService';

const API_URL = 'https://techrush-backend.onrender.com';

const ProfileOption = ({ icon, text, color = '#333', onPress }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={[styles.optionText, { color }]}>{text}</Text>
    <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [alertVisible, setAlertVisible] = useState(false);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await getMyProfile();
      setUser(data);
      setStatus('success');
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    setAlertVisible(false);
    try {
      await AsyncStorage.clear();
      router.replace('/(auth)/startup');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (!fontsLoaded || status === 'loading') {
    return <View style={styles.centeredContainer}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }
  
  if (status === 'error') {
     return (
      <View style={styles.centeredContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color="#888" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <Image
            source={user.profilePicture ? { uri: `${API_URL}${user.profilePicture}` } : require('../../assets/images/studentProfile.png')}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <ProfileOption icon="settings-outline" text="Settings" onPress={() => Alert.alert("No Settings Section")} />
          <ProfileOption icon="create-outline" text="Edit Profile" onPress={() => Alert.alert("No Edit Section")} />
          <View style={styles.divider} />
          <ProfileOption icon="log-out-outline" text="Logout" color="red" onPress={() => setAlertVisible(true)} />
        </View>

        <LogoutAlert
          visible={alertVisible}
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          onCancel={() => setAlertVisible(false)}
          onConfirm={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { alignItems: 'center', padding: 20, flexGrow: 1 },
  header: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: '#333', marginLeft: 15 },
  profileCard: {
    alignItems: 'center', backgroundColor: '#fff', padding: 25,
    width: '100%', borderRadius: 20, elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 15, marginTop: 20,
  },
  profileImage: {
    height: 120, width: 120, borderRadius: 60,
    marginBottom: 20, borderWidth: 3, borderColor: colors.primary,
  },
  name: { fontSize: 22, fontFamily: 'Poppins-Bold', color: '#1c1e21', marginBottom: 5 },
  email: { fontSize: 15, fontFamily: 'Poppins-Regular', color: '#666' },
  optionsContainer: {
    marginTop: 30, width: '100%', backgroundColor: '#fff',
    borderRadius: 20, paddingVertical: 10, elevation: 2,
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 15, paddingHorizontal: 20,
  },
  optionText: { fontFamily: 'Poppins-SemiBold', marginLeft: 15, fontSize: 16, flex: 1 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10, marginHorizontal: 20 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#444', marginTop: 16 },
  retryButton: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30, marginTop: 24 },
  retryButtonText: { color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
});
