import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
  } from 'react-native';
  import * as Font from 'expo-font';
  import { Ionicons } from '@expo/vector-icons';
  import colors from './assets/utils/colors';
  import { useRouter } from 'expo-router';

  
  import { useState } from 'react';
  
  export default function Signup({ navigation }) {
    const [name, setName] = useState('');
    const [nameverify, setNameverify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailverify] = useState(false);
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureConfirm, setSecureConfirm] = useState(true);
    const router = useRouter();

const [fontsLoaded] = Font.useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

    function handleNameverify(e) {
      setName(e);
      setNameverify(e.length > 1);
    }
  
    function handleEmailVerify(e) {
      setEmail(e);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailverify(emailRegex.test(e));
    }
  
    function handlePasswordValid(e) {
      setPassword(e);
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      setPasswordValid(passwordRegex.test(e));
    }
  
    if (!fontsLoaded) return <AppLoading />;
  
    return (
      <View
  style={styles.container}

>
        <Text style={[styles.heading, { fontFamily: 'Poppins-SemiBold' }]}>SignUp For</Text>
        <Text style={styles.heading}>Campus Pay!</Text>
  
        <View style={styles.main}>
          {/* Profile Icon */}
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
            }}>
            <Ionicons name="person" size={50} color="#333333" />
          </View>
  
          {/* Name Input */}
          <View style={[{ marginTop: 40 }, styles.input]}>
            <View style={styles.iconWrapper}>
              <Ionicons name="person" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Enter Your Name"
              value={name}
              onChangeText={handleNameverify}
              style={styles.textInput}
            />
          </View>
          {name.length > 1 && !nameverify && (
            <Text style={styles.errorText}>Name must be at least 2 characters</Text>
          )}
  
          {/* Email Input */}
          <View style={[{ marginTop: 20 }, styles.input]}>
            <View style={styles.iconWrapper}>
              <Ionicons name="mail" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Enter Your Email"
              value={email}
              onChangeText={handleEmailVerify}
              style={styles.textInput}
            />
          </View>
          {email.length > 1 && !emailVerify && (
            <Text style={styles.errorText}>Enter a valid email address</Text>
          )}
  
          {/* Password Input */}
          <View style={[{ marginTop: 20 }, styles.input]}>
            <View style={styles.iconWrapper}>
              <Ionicons name="key" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Enter Your Password"
              value={password}
              onChangeText={handlePasswordValid}
              secureTextEntry={secure}
              style={styles.textInput}
            />
            <TouchableOpacity style={styles.eyeWrapper} onPress={() => setSecure(!secure)}>
              <Ionicons name={secure ? 'eye-off' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {password.length > 0 && !passwordValid && (
            <Text style={styles.errorText}>
              Password must be 8+ characters and contain letters and numbers
            </Text>
          )}
  
          {/* Confirm Password Input */}
          <View style={[{ marginTop: 25 }, styles.input]}>
            <View style={styles.iconWrapper}>
              <Ionicons name="key" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirm}
              style={styles.textInput}
            />
            <TouchableOpacity style={styles.eyeWrapper} onPress={() => setSecureConfirm(!secureConfirm)}>
              <Ionicons name={secureConfirm ? 'eye-off' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && confirmPassword !== password && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
  
          {/* Sign Up Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.logintxt}>SignUp</Text>
          </TouchableOpacity>
  
          {/* Navigation Links */}
          <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
            <Text style={styles.noaccountText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.navigate('/login')}>
              <Text style={styles.signuptext}>Login</Text>
            </TouchableOpacity>
          </View>
  
          <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
            <Text style={styles.noaccountText}> Admin/Teacher?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
              <Text style={styles.signuptext}>SignUp Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex:1,
     justifyContent:"center",
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
    input: {
      width: '90%',
      height: 50,
      borderRadius: 15,
      backgroundColor: 'white',
      paddingLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    textInput: {
      flex: 1,
      marginHorizontal: 10,
      fontFamily: 'Poppins-Regular',
    },
    iconWrapper: {
      backgroundColor: colors.background,
      height: 30,
      width: 30,
      marginTop: 0,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    eyeWrapper: {
      height: 30,
      width: 30,
      marginTop: 10,
      marginRight: 15,
      alignItems: 'center',
      justifyContent: 'center',
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
    errorText: {
      color: 'red',
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      marginLeft: 25,
      marginTop: 5,
    },
  });
  