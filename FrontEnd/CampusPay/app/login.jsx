import { Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import colors from './assets/utils/colors';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();
  const [fontsLoaded] = Font.useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) return <AppLoading />;

  async function handleSubmit() {
    setIsLoading(true); 
    try {
      const userdata = new FormData();
      userdata.append('email', email);
      userdata.append('password', password);

      const res = await axios.post(
        `/auth/login`,
        userdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const token = res.data.token;
      const userID = res.data.user._id;
      const name = res.data.user.name;
      const mail = res.data.user.email;
      const role = res.data.user.role;

      if (token) {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userID', userID);
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('email', mail);
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        await AsyncStorage.setItem('role',role);
console.log(role);
        const storedToken = await AsyncStorage.getItem('authToken');
        console.log('Token from AsyncStorage:', storedToken);

        Alert.alert('Success', `Login Successful! Token stored: ${storedToken}`);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Failed', 'Token not found in response');
        router.replace('./startup');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Failed', 'Login Failed!');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login To</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center', gap: 12, margin: 10 }}>
        <View>
          <Image
            source={require('./assets/images/freepik__upload__59206.png')}
            style={styles.image}
          />
        </View>
        <Text style={{ textAlign: 'center', alignSelf: 'center', fontFamily: 'Poppins-Bold', color: colors.text, fontSize: 30 }}>
          Campus Pay!
        </Text>
      </View>
      <View style={styles.main}>
        <View
          style={{
            backgroundColor: colors.white,
            height: 90,
            width: 90,
            margin: 10,
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: 90,
            padding: 4,
            position: 'absolute',
            top: -60,
            overflow: 'none',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="person" size={50} color="#333333" />
        </View>

        <View style={[styles.input, { marginTop: 40 }]}>
          <View
            style={{
              backgroundColor: colors.background,
              height: 30,
              width: 30,
              marginTop: 10,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Email ID"
            onChangeText={setEmail}
            style={{
              marginHorizontal: 10,
              fontFamily: 'Poppins-Regular',
            }}
          />
        </View>

        <View style={[{ marginTop: 25 }, styles.input]}>
          <View style={styles.iconWrapper}>
            <Ionicons name="key" size={20} color="white" />
          </View>

          <TextInput
            placeholder="Enter Your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={{
              flex: 1,
              marginHorizontal: 10,
              fontFamily: 'Poppins-Regular',
            }}
          />

          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            style={styles.eyeWrapper}
          >
            <Ionicons
              name={secure ? 'eye-off' : 'eye'}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={isLoading} 
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <Text style={styles.logintxt}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
          <Text style={styles.noaccountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('/signup')}>
            <Text style={styles.signuptext}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 5,
  },
  heading: {
    marginTop: -50,
    color: colors.text,
    marginLeft: 20,
    fontSize: 35,
    lineHeight: 60,
    textAlign: 'left',
    fontFamily: 'Poppins-SemiBold',
  },
  main: {
    width: '90%',
    height: 'auto',
    paddingVertical: 20,
    marginTop: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  image: {
    width: 70,
    height: 70,
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 15,
    backgroundColor: 'white',
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    width: '30%',
    height: 45,
    borderRadius: 22,
    alignSelf: 'center',
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  logintxt: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },
  noaccountText: {
    fontFamily: 'Poppins-Regular',
    color: colors.white,
  },
  signuptext: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.secondary,
  },
  eyeWrapper: {
    height: 30,
    width: 30,
    marginRight: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    backgroundColor: colors.background,
    height: 30,
    width: 30,
    marginTop: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});