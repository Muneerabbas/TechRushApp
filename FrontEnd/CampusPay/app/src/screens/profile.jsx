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

export default function ProfileScreen() {


      const [fontsLoaded] = useFonts({
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
      });
    
      if (!fontsLoaded) return null;
  const [name, setName] = useState('Name');
  const [email, setEmail] = useState('user@gmail.com');
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const name = await AsyncStorage.getItem('name');
      const email = await AsyncStorage.getItem('email');
      if (name) setName(name);
      if (email) setEmail(name);
    }

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    console.log('Edit Profile Pressed');
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");

      router.replace("/startup");
   Alert.alert("Logged Out Sucessfully")
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity 
        onPress={()=>{router.back()}}
        style={{alignSelf:"flex-start" , top:-150, padding:20 }}>


        <Ionicons name="arrow-back-outline" size={30} color="black" />

        </TouchableOpacity 
        >
      <View style={styles.profileCard}>
        <Image
          source={require('../../assets/images/react-logo.png')} // replace with your image
          style={styles.profileImage}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>

        <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
     
        <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="red" />
          <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F5F7FB',
    flexGrow: 1,
    justifyContent:"center"
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
fontFamily:"Poppins-SemiBold",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    fontFamily:"Poppins-SemiBold",

    color: '#666',
    marginBottom: 15,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary || '#4C9EEB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editText: {
    color: 'white',
    fontFamily:"Poppins-SemiBold",

    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
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
    fontFamily:"Poppins-Bold",

    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});
