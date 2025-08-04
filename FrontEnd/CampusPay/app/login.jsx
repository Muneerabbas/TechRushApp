import { Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from './assets/utils/colors';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const router = useRouter();
  const { login, loading } = useAuth();

  const handleLogin = () => {
    login(email, password).catch(err => {
      Alert.alert("Login Failed", err.response?.data?.message || "Please check your credentials.");
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Login to</Text>

      <View style={styles.logoRow}>
        <Image source={require('./assets/images/freepik__upload__59206.png')} style={styles.image} />
        <Text style={styles.logoText}>Campus Pay!</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={50} color="#333" />
        </View>

        <View style={[styles.inputBox, { marginTop: 50 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="person" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Email ID"
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputBox, { marginTop: 20 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="key" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeWrap}>
            <Ionicons name={secure ? 'eye-off' : 'eye'} size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('/signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  heading: {
    fontSize: 30,
    color: colors.text,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    marginLeft: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
    marginLeft: 10,
  },
  logoText: {
    fontSize: 26,
    color: colors.text,
    fontFamily: 'Poppins-Bold',
  },
  image: {
    width: 60,
    height: 60,
  },
  main: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  profileIcon: {
    backgroundColor: colors.white,
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: -40,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    height: 50,
    paddingHorizontal: 10,
  },
  iconWrap: {
    backgroundColor: colors.background,
    borderRadius: 50,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  eyeWrap: {
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: colors.secondary,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
    fontSize: 16,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 5,
  },
  signupText: {
    fontFamily: 'Poppins-Regular',
    color: colors.white,
  },
  signupLink: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.secondary,
  },
});
