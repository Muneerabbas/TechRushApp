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
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/utils/colors';
import LogoutAlert from '../../components/LogoutAlert';
import { getMyProfile } from '../../(tabs)/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FallbackImage = ({ uri, style }) => {
    const [hasError, setHasError] = useState(!uri);
    return (
      <Image
        source={hasError ? require('../../assets/images/studentProfile.png') : { uri }}
        style={style}
        onError={() => setHasError(true)}
      />
    );
};

export default function ProfileScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [name, setName] = useState('User');
  const [email, setEmail] = useState('user@example.com');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    const storedName = await AsyncStorage.getItem('name');
    const storedEmail = await AsyncStorage.getItem('email');
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);

    try {
      const serverData = await getMyProfile();
      setName(serverData.name);
      setEmail(serverData.email);
      setDescription(serverData.description || '');
      if (serverData.profilePicture) {
        setProfilePicture(`https://techrush-backend.onrender.com${serverData.profilePicture}`);
      }
    } catch (error) {
      console.error('Failed to fetch profile data from server:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleConfirmLogout = async () => {
    setAlertVisible(false);
    try {
      await AsyncStorage.clear();
      router.replace('/startup');
      Alert.alert('Success', 'Logged Out Successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
                 <FallbackImage 
                    uri={profilePicture} 
                    style={styles.profileImage} 
                />
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        <View style={styles.optionsContainer}>
            <OptionRow icon="create-outline" text="Edit Profile" onPress={() => router.navigate('/src/screens/EditProfile')} />
            <OptionRow icon="keypad-outline" text="Set up PIN" onPress={() => router.navigate('/src/screens/PinSetup')} />
            <OptionRow icon="settings-outline" text="Settings" onPress={() => Alert.alert("No Settings Section")} />
            <OptionRow icon="log-out-outline" text="Logout" color="red" onPress={() => setAlertVisible(true)} />
        </View>

        <LogoutAlert
            visible={alertVisible}
            title="Confirm Logout"
            message="Are you sure you want to log out?"
            onCancel={() => setAlertVisible(false)}
            onConfirm={handleConfirmLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const OptionRow = ({ icon, text, color = '#333', onPress }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
        <Ionicons name={icon} size={24} color={color} style={styles.optionIcon} />
        <Text style={[styles.optionText, { color }]}>{text}</Text>
        <Ionicons name="chevron-forward-outline" size={22} color="#A0AEC0" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    container: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        width: '100%',
        paddingHorizontal: 15,
        paddingTop: 20,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 5,
    },
    profileCard: {
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20,
        paddingHorizontal: 20,
    },
    profileImageContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 10,
        borderRadius: 60,
    },
    profileImage: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'white',
    },
    name: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        marginTop: 20,
        color: '#2D3748',
    },
    email: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#718096',
        marginTop: 4,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#4A5568',
        textAlign: 'center',
        marginTop: 15,
    },
    optionsContainer: {
        marginTop: 40,
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    optionIcon: {
        width: 30,
    },
    optionText: {
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 15,
        fontSize: 16,
        flex: 1,
    },
});
