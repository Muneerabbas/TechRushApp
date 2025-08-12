import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_STORAGE_KEY = 'userSecurityPIN';

export default function PinSetupScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [screenState, setScreenState] = useState('loading'); // loading, verify, create
  const [oldPin, setOldPin] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkExistingPin = async () => {
      const existingPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (existingPin) {
        setScreenState('verify');
      } else {
        setScreenState('create');
      }
    };
    checkExistingPin();
  }, []);

  const handleVerifyPin = async () => {
    setIsLoading(true);
    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (oldPin === storedPin) {
        setScreenState('create');
      } else {
        Alert.alert('Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not verify your PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePin = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Your new PIN must be 4 digits long.');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('PINs Do Not Match', 'Please ensure both new PINs are the same.');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem(PIN_STORAGE_KEY, pin);
      Alert.alert('Success', 'Your new PIN has been set successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save your new PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!fontsLoaded || screenState === 'loading') {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{screenState === 'verify' ? 'Verify Your PIN' : 'Set Security PIN'}</Text>
            <View style={{width: 44}}/>
        </View>

        {screenState === 'verify' ? (
          <>
            <View style={styles.form}>
                <Text style={styles.label}>Enter Your Current 4-Digit PIN</Text>
                <TextInput
                    style={styles.input}
                    value={oldPin}
                    onChangeText={setOldPin}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    placeholder="****"
                />
            </View>
            <TouchableOpacity 
                style={[styles.saveButton, (isLoading || oldPin.length !== 4) && styles.disabledButton]} 
                onPress={handleVerifyPin}
                disabled={isLoading || oldPin.length !== 4}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Verify PIN</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.form}>
                <Text style={styles.label}>Create a New 4-Digit PIN</Text>
                <TextInput
                    style={styles.input}
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    placeholder="****"
                />

                <Text style={[styles.label, { marginTop: 30 }]}>Confirm Your New PIN</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    placeholder="****"
                />
            </View>
            <TouchableOpacity 
                style={[styles.saveButton, (isLoading || pin.length !== 4 || pin !== confirmPin) && styles.disabledButton]} 
                onPress={handleSavePin}
                disabled={isLoading || pin.length !== 4 || pin !== confirmPin}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Set New PIN</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical:20,

    backgroundColor: '#F8F7FF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
  },
  form: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    letterSpacing: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  }
});
