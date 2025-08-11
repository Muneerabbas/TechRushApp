import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
  } from 'react-native';
  import * as Font from 'expo-font';
  import { Ionicons } from '@expo/vector-icons';
  import colors from './assets/utils/colors';
  import { useRouter } from 'expo-router';
  import axios from 'axios';
  import { useState } from 'react';
  import { scanIdCard } from './services/idCardScanner';
  
  export default function admin() {
    const [name, setName] = useState('');
    const [nameverify, setNameverify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailverify] = useState(false);
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureConfirm, setSecureConfirm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [adminpin, setAdminpin] = useState("");
    const isDisabled = adminpin.trim() === "" || adminpin.trim()!=="20252024";
    



    const [fontsLoaded] = Font.useFonts({
      'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
      'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    });
  
    const [highQuality, setHighQuality] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [image, setImage] = useState(null);
  
    function log(m) {
      const s = typeof m === 'string' ? m : JSON.stringify(m);
      setLogs((p) => [s, ...p].slice(0, 60));
      console.log(s);
    }
  
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
  
    async function handleSubmit() {
      setIsLoading(true);
      try {
        const userdata = new FormData();
        userdata.append('name', name);
        userdata.append('email', email);
        userdata.append('password', password);
        userdata.append('role', 'Admin');

  
  
        const res = await axios.post(
          `/auth/register`,
          userdata,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (res) {
          Alert.alert('Success', 'Registered Successfully!');
          router.navigate('/login');
        } else {
          Alert.alert('Error', 'SignUp Failed');
        }
      } catch (error) {
        console.error('Signup error:', error.response?.data || error.message);
        Alert.alert('Error', 'SignUp Failed!');
      } finally {
        setIsLoading(false);
      }
    }
  
  
    async function handleScanId() {
      setOcrLoading(true);
      try {
          const extractedName = await scanIdCard(highQuality, log);
          if (extractedName) {
              setName(extractedName);
              setNameverify(extractedName.length > 1);
          }
      } catch (err) {
          log(`Scan process failed: ${err.message}`);
      } finally {
          setOcrLoading(false);
      }
    }
  
    return (
      <View style={styles.container}>
        <Text style={[styles.heading, { fontFamily: 'Poppins-SemiBold' }]}>Admin SignUp</Text>
        <Text style={styles.heading}>Campus Pay!</Text>
  
        <View style={styles.main}>
          {/* <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', top:-20, }}>
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
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              ) : (
                <Ionicons name="person" size={50} color="#333333" />
              )}
            </View>
          </TouchableOpacity> */}
          <View style={[{ marginTop: 40 }, styles.input]}>
            <View style={styles.iconWrapper}>
              <Ionicons name="person" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Enter Your Name"
              value={name}
              editable={false}
              onChangeText={handleNameverify}
              style={styles.textInput}
            />
            <TouchableOpacity onPress={handleScanId} style={{ paddingHorizontal: 10 }}>
              {ocrLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="id-card" size={22} color="#333" />
              )}
            </TouchableOpacity>
          </View>
          {name.length > 1 && !nameverify && (
            <Text style={styles.errorText}>Name must be at least 2 characters</Text>
          )}
  
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
            <View style={[{ marginTop: 25 }, styles.input]}>
            <View style={styles.iconWrapper}>
              <Ionicons name="key" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Admin Security Pin"
              value={adminpin}
              onChangeText={setAdminpin}
              secureTextEntry={secureConfirm}
              style={styles.textInput}
              disabled={isDisabled}
            />
            <TouchableOpacity style={styles.eyeWrapper} onPress={() => setSecureConfirm(!secureConfirm)}>
              <Ionicons name={secureConfirm ? 'eye-off' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>
  
          <TouchableOpacity
            style={[styles.button, isLoading || isDisabled && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isDisabled}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.black} />
            ) : (
              <Text style={styles.logintxt}>SignUp</Text>
            )}
          </TouchableOpacity>
  
          <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
            <Text style={styles.noaccountText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.navigate('/login')}>
              <Text style={styles.signuptext}>Login</Text>
            </TouchableOpacity>
          </View>
  
          
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
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
    errorText: {
      color: 'red',
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      marginLeft: 25,
      marginTop: 5,
    },
  });