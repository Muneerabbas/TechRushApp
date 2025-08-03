import { Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../assets/utils/colors'; // Corrected path
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth'; // Logic is now in the hook

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [secure, setSecure] = useState(true);
  const { login, loading } = useAuth();

  const handleLogin = () => {
      login(email, password).catch(err => {
          Alert.alert("Login Failed", err.response?.data?.message || "Please check your credentials.");
      });
  };

  return (
    <ScrollView contentContainerStyle={loginStyles.container}>
      <Text style={loginStyles.heading}>Login To</Text>
      <View style={{flexDirection:'row', justifyContent:"flex-start", alignItems:"center", gap:12,margin:10,}}> 
        <Image source={require('../assets/images/freepik__upload__59206.png')} style={loginStyles.image}/>
        <Text style={{textAlign:"center", alignSelf:"center", fontFamily:"Poppins-Bold", color:colors.text, fontSize:30}}>Campus Pay!</Text>
      </View>
      <View style={loginStyles.main}>
        <View style={loginStyles.profileIcon}>
          <Ionicons name="person" size={50} color= '#333333' />
        </View>
        
        <View style={[loginStyles.input,{marginTop:40}]}>
          <View style={loginStyles.iconWrapper}>
            <Ionicons name="person" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Email ID"
            value={email}
            onChangeText={setEmail}
            style={loginStyles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[{ marginTop: 25 }, loginStyles.input]}>
          <View style={loginStyles.iconWrapper}>
            <Ionicons name="key" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={loginStyles.textInput}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)} style={loginStyles.eyeWrapper}>
            <Ionicons name={secure ? 'eye-off' : 'eye'} size={24} color="#555"/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={loginStyles.button} onPress={handleLogin} disabled={loading}>
            <Text style={loginStyles.logintxt}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row', gap:5,justifyContent:"center"}}>
            <Text style={loginStyles.noaccountText}> have an account?</Text>
            <TouchableOpacity onPress={() => router.navigate('/signup')}>
                <Text style={loginStyles.signuptext}>SignUp</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const loginStyles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent:"center", backgroundColor: '#ffffff', padding: 5, },
  heading: { color:colors.text, marginLeft: 20, fontSize: 35, lineHeight: 60, textAlign: 'left', fontFamily: 'Poppins-SemiBold', },
  main: { width: '90%', paddingVertical:20, marginTop: 60, borderRadius: 22, justifyContent: 'center', alignSelf: 'center', backgroundColor: colors.background, },
  profileIcon: { backgroundColor: colors.white, height: 90, width: 90, margin: 10, borderWidth:2, borderColor:colors.primary, borderRadius: 90, padding: 4, position:"absolute", top:-60, alignSelf:"center", alignItems: 'center', justifyContent: 'center', },
  image:{ width: 70, height: 70, },
  input: { width: '90%', height: 50, borderRadius: 15, backgroundColor: 'white', paddingLeft: 10, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', },
  textInput: { flex: 1, marginHorizontal: 10, fontFamily: 'Poppins-Regular' },
  button:{ width:'30%', height:50, borderRadius:22, alignSelf:"center", margin:25, justifyContent:"center", alignItems:"center", backgroundColor:colors.secondary, },
  logintxt:{ fontFamily:"Poppins-SemiBold", color:colors.black, },
  noaccountText:{ fontFamily:"Poppins-Regular", color:colors.white, },
  signuptext:{ fontFamily:"Poppins-SemiBold", color:colors.secondary },
  eyeWrapper: { height: 30, width: 30, marginRight: 10, alignItems: 'center', justifyContent: 'center', },
  iconWrapper: { backgroundColor: colors.background, height: 30, width: 30, borderRadius: 50, alignItems: 'center', justifyContent: 'center', },
});
