//app/src/screens/profile.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/utils/colors';
import LogoutAlert from '../../components/LogoutAlert';

export default function ProfileScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [name, setName] = useState('Name');
  const [email, setEmail] = useState('user@gmail.com');
  const [alertVisible, setAlertVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const storedName = await AsyncStorage.getItem('name');
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    }

    fetchUserData();
  }, []);

  const handleConfirm = async () => {
    setAlertVisible(false);
    try {
      await AsyncStorage.clear();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      router.replace('/startup');
      Alert.alert('Success', 'Logged Out Successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleCancel = () => {
    setAlertVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
<View style={{width:'100%', alignContent:"center", alignItems:"center"}}>
<TouchableOpacity
        onPress={() => router.navigate('/(tabs)')}
        style={{ alignSelf: 'flex-start', top: 0, padding: 20 }}
      >
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>

      <View style={styles.profileCard}>
        
        <Image
          source={require('../../assets/images/student.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => Alert.alert("No Settings Section")}

        >
          <Ionicons name="settings" size={22} color="black" />
          <Text style={[styles.optionText, { color: 'black' }]}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => Alert.alert("No Edit Section")}
        >
          <Ionicons name="create-outline" size={22} color="black" />
          <Text style={[styles.optionText, { color: 'black' }]}>Edit Profile</Text>
        </TouchableOpacity> 
        
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setAlertVisible(true)}

        >
          <Ionicons name="log-out-outline" size={22} color="red" />
          <Text style={[styles.optionText, { color: 'black' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <LogoutAlert
        visible={alertVisible}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      /></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F5F7FB',
    flexGrow: 1,
    width: '100%',

    justifyContent: 'flex-start',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 20,
    elevation: 4,
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 30,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    fontFamily: 'Poppins-Bold',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});
