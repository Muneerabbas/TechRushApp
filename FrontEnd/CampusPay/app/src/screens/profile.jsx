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
  Modal,
  TextInput,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/utils/colors';
import LogoutAlert from '../../components/LogoutAlert';
import { getMyProfile } from '../../(tabs)/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

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
  const [userId, setUserId] = useState(null);
  const [isQrModalVisible, setQrModalVisible] = useState(false);
  const [isCreateQrModalVisible, setCreateQrModalVisible] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [generatedQrValue, setGeneratedQrValue] = useState('');
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    const storedName = await AsyncStorage.getItem('name');
    const storedEmail = await AsyncStorage.getItem('email');
    const storedUserID = await AsyncStorage.getItem('userID');

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedUserID) setUserId(storedUserID);

    try {
      const serverData = await getMyProfile();
      setName(serverData.name);
      setEmail(serverData.email);
      setUserId(serverData._id);
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

  const handleCreateQr = () => {
      if (qrInput.trim() === '') {
          Alert.alert("Input required", "Please enter a link or text to generate a QR code.");
          return;
      }
      setGeneratedQrValue(qrInput);
  }
  
  const closeCreateQrModal = () => {
    setCreateQrModalVisible(false);
    setQrInput('');
    setGeneratedQrValue('');
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
            <View style={styles.profileImageWrapper}>
              <FallbackImage
                uri={profilePicture}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.qrButton}
                onPress={() => {
                  if (userId) {
                    setQrModalVisible(true);
                  } else {
                    Alert.alert("Error", "User ID not found. Please try again later.");
                  }
                }}
              >
                <Ionicons name="qr-code-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        <View style={styles.optionsContainer}>
            <OptionRow icon="create-outline" text="Edit Profile" onPress={() => router.navigate('/src/screens/EditProfile')} />
            <OptionRow icon="qr-code-outline" text="Create QR Code" onPress={() => setCreateQrModalVisible(true)} />
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

        <Modal
          animationType="fade"
          transparent={true}
          visible={isQrModalVisible}
          onRequestClose={() => setQrModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalCloseIcon} onPress={() => setQrModalVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#A0AEC0" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>My User ID</Text>
              <View style={styles.qrContainer}>
                {userId && (
                  <QRCode
                    value={`CampusPay://pay?userId=${userId}&name=${encodeURIComponent(name)}`}
                    size={220}
                    logoBackgroundColor='transparent'
                  />
                )}
              </View>
              <Text style={styles.modalName}>{name}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setQrModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
            animationType="fade"
            transparent={true}
            visible={isCreateQrModalVisible}
            onRequestClose={closeCreateQrModal}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.modalCloseIcon} onPress={closeCreateQrModal}>
                        <Ionicons name="close-circle" size={32} color="#A0AEC0" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Create a QR Code</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter link or text"
                        placeholderTextColor="#A0AEC0"
                        value={qrInput}
                        onChangeText={setQrInput}
                    />
                    {generatedQrValue ? (
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={generatedQrValue}
                                size={180}
                            />
                        </View>
                    ) : <View style={styles.qrPlaceholder} /> }
                    <TouchableOpacity
                        style={styles.modalGenerateButton}
                        onPress={handleCreateQr}
                    >
                        <Text style={styles.modalCloseButtonText}>Generate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

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
    backgroundColor: '#F8F7FF',
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
  profileImageWrapper: {
      position: 'relative',
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
      backgroundColor: '#ffffffff',
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
  qrButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    paddingTop: 10,
    color: '#333',
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
  },
  modalName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#4A5568',
    marginBottom: 25,
  },
  modalCloseButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  modalGenerateButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  textInput: {
      height: 50,
      width: '100%',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      backgroundColor: '#F7FAFC',
  },
  qrPlaceholder: {
      width: 200,
      height: 200,
      backgroundColor: '#F7FAFC',
      borderRadius: 8,
      marginBottom: 20,
  },
  modalCloseIcon: {
      position: 'absolute',
      top: 15,
      right: 15,
  }
});