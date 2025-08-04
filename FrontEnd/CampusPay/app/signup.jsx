import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from './assets/utils/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; 

export default function Signup() {
  const { signup, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [passwordValid, setPasswordValid] = useState(false);

  const handleNameChange = (text) => {
    setName(text);
    setNameValid(text.length >= 2);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(regex.test(text));
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const strong = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordValid(strong.test(text));
  };

  const handleSubmit = async () => {
    if (!nameValid || !emailValid || !passwordValid) {
      Alert.alert("Error", "Please enter valid details.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      await signup(name, email, password);
    } catch (err) {
      // error is already shown from hook
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>SignUp For</Text>
      <Text style={styles.heading}>Campus Pay!</Text>

      <View style={styles.main}>
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={50} color="#333" />
        </View>

        <View style={[styles.inputBox, { marginTop: 50 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="person" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Your Name"
            value={name}
            onChangeText={handleNameChange}
            style={styles.textInput}
          />
        </View>
        {name.length > 0 && !nameValid && (
          <Text style={styles.errorText}>Name must be at least 2 characters</Text>
        )}

        <View style={[styles.inputBox, { marginTop: 20 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="mail" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Your Email"
            value={email}
            onChangeText={handleEmailChange}
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {email.length > 0 && !emailValid && (
          <Text style={styles.errorText}>Enter a valid email address</Text>
        )}

        <View style={[styles.inputBox, { marginTop: 20 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="key" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={secure}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeWrap}>
            <Ionicons name={secure ? 'eye-off' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        </View>
        {password.length > 0 && !passwordValid && (
          <Text style={styles.errorText}>Password must be 8+ chars with letters & numbers</Text>
        )}

        <View style={[styles.inputBox, { marginTop: 25 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="key" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureConfirm}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={styles.eyeWrap}>
            <Ionicons name={secureConfirm ? 'eye-off' : 'eye'} size={20} color="#555" />
          </TouchableOpacity>
        </View>
        {confirmPassword.length > 0 && confirmPassword !== password && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'SignUp'}</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('/login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: '#ecf0f1',
    padding: 5,
  },
  heading: {
    color: colors.text,
    marginLeft: 20,
    fontSize: 32,
    lineHeight: 50,
    textAlign: 'left',
    fontFamily: 'Poppins-Bold',
  },
  main: {
    width: '90%',
    paddingVertical: 20,
    marginTop: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  profileIcon: {
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: '90%',
    height: 50,
    borderRadius: 15,
    backgroundColor: 'white',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconWrap: {
    backgroundColor: colors.background,
    height: 30,
    width: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeWrap: {
    height: 30,
    width: 30,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    width: '30%',
    height: 50,
    borderRadius: 22,
    alignSelf: 'center',
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },
  loginRow: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    color: colors.white,
  },
  loginLink: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.secondary,
  },
  errorText: {
    color: 'red',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 25,
    marginTop: 5,
  },
});
