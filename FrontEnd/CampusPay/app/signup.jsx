import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../assets/utils/colors'; // Corrected path
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Logic is now in the hook

export default function Signup() {
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
    const { signup, loading } = useAuth();

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

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        signup(name, email, password).catch(err => {
            Alert.alert("Signup Failed", err.response?.data?.message || "Please try again.");
        });
    };
  
    return (
      <ScrollView contentContainerStyle={signupStyles.container}>
        <Text style={[signupStyles.heading, { fontFamily: 'Poppins-SemiBold' }]}>SignUp For</Text>
        <Text style={signupStyles.heading}>Campus Pay!</Text>
  
        <View style={signupStyles.main}>
          <View style={signupStyles.profileIcon}>
            <Ionicons name="person" size={50} color="#333333" />
          </View>
  
          <View style={[{ marginTop: 40 }, signupStyles.input]}>
            <View style={signupStyles.iconWrapper}>
              <Ionicons name="person" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Enter Your Name"
              value={name}
              onChangeText={handleNameverify}
              style={signupStyles.textInput}
            />
          </View>
          {name.length > 1 && !nameverify && (
            <Text style={signupStyles.errorText}>Name must be at least 2 characters</Text>
          )}
  
          <View style={[{ marginTop: 20 }, signupStyles.input]}>
            <View style={signupStyles.iconWrapper}>
              <Ionicons name="mail" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Enter Your Email"
              value={email}
              onChangeText={handleEmailVerify}
              style={signupStyles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {email.length > 1 && !emailVerify && (
            <Text style={signupStyles.errorText}>Enter a valid email address</Text>
          )}
  
          <View style={[{ marginTop: 20 }, signupStyles.input]}>
            <View style={signupStyles.iconWrapper}>
              <Ionicons name="key" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Enter Your Password"
              value={password}
              onChangeText={handlePasswordValid}
              secureTextEntry={secure}
              style={signupStyles.textInput}
            />
            <TouchableOpacity style={signupStyles.eyeWrapper} onPress={() => setSecure(!secure)}>
              <Ionicons name={secure ? 'eye-off' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {password.length > 0 && !passwordValid && (
            <Text style={signupStyles.errorText}>
              Password must be 8+ characters and contain letters and numbers
            </Text>
          )}
  
          <View style={[{ marginTop: 25 }, signupStyles.input]}>
            <View style={signupStyles.iconWrapper}>
              <Ionicons name="key" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirm}
              style={signupStyles.textInput}
            />
            <TouchableOpacity style={signupStyles.eyeWrapper} onPress={() => setSecureConfirm(!secureConfirm)}>
              <Ionicons name={secureConfirm ? 'eye-off' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && confirmPassword !== password && (
            <Text style={signupStyles.errorText}>Passwords do not match</Text>
          )}
  
          <TouchableOpacity style={signupStyles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={signupStyles.logintxt}>{loading ? 'Signing up...' : 'SignUp'}</Text>
          </TouchableOpacity>
  
          <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
            <Text style={signupStyles.noaccountText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.navigate('/login')}>
              <Text style={signupStyles.signuptext}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
}
  
const signupStyles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent:"center", backgroundColor: '#ecf0f1', padding: 5, },
    heading: { color: colors.text, marginLeft: 20, fontSize: 32, lineHeight: 50, textAlign: 'left', fontFamily: 'Poppins-Bold', },
    main: { width: '90%', paddingVertical: 20, marginTop: 60, borderRadius: 22, justifyContent: 'center', alignSelf: 'center', backgroundColor: colors.background, },
    profileIcon: { backgroundColor: colors.white, height: 90, width: 90, margin: 10, borderWidth: 2, borderColor: colors.primary, borderRadius: 90, padding: 4, position: 'absolute', top: -60, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', },
    input: { width: '90%', height: 50, borderRadius: 15, backgroundColor: 'white', paddingLeft: 10, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', },
    textInput: { flex: 1, marginHorizontal: 10, fontFamily: 'Poppins-Regular', },
    iconWrapper: { backgroundColor: colors.background, height: 30, width: 30, borderRadius: 50, alignItems: 'center', justifyContent: 'center', },
    eyeWrapper: { height: 30, width: 30, marginTop: 10, marginRight: 15, alignItems: 'center', justifyContent: 'center', },
    button: { width: '30%', height: 50, borderRadius: 22, alignSelf: 'center', margin: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.secondary, },
    logintxt: { fontFamily: 'Poppins-SemiBold', color: colors.black, },
    noaccountText: { fontFamily: 'Poppins-Regular', color: colors.white, },
    signuptext: { fontFamily: 'Poppins-SemiBold', color: colors.secondary, },
    errorText: { color: 'red', fontFamily: 'Poppins-Regular', fontSize: 12, marginLeft: 25, marginTop: 5, },
});
