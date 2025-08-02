import { Text, View, StyleSheet, TextInput,Image,ScrollView,TouchableOpacity} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import colors from './assets/utils/colors';
import { useState } from 'react';
import { useRouter } from 'expo-router';


export default function Login({navigation}) {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [secure, setSecure] = useState(true); // hide by default
 const [fontsLoaded] = Font.useFonts({
     'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
     'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
     'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
   });
  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login To</Text>
  <View style={{flexDirection:'row', justifyContent:"flex-start", alignContent:"center" , gap:12,margin:10,}}> 
 <View>  <Image
        source={require('./assets/images/freepik__upload__59206.png')} 
        style={styles.image}
      /></View>
           <Text style={{textAlign:"center", alignSelf:"center", fontFamily:"Poppins-Bold", color:colors.text,
fontSize:30}}>Campus Pay!</Text>
</View>
      <View style={styles.main}>
      <View
          style={{
            backgroundColor: colors.white,
            height: 90,
            width: 90,
            margin: 10,
            borderWidth:2,
            borderColor:colors.primary,
            borderRadius: 90,
            padding: 4,
            position:"absolute",
            top:-60,
            overflow:"none",
            alignSelf:"center",
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="person" size={50} color= '#333333' />
        </View>
         
      //Email Input
        <View style={[styles.input,{marginTop:40}]}>
          <View
            style={{
              backgroundColor: colors.background,
              height: 30,
              width: 30,
              marginTop: 10,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent:"center",
      
            }}>
            <Ionicons name="person" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Enter Email ID"
            style={{
              marginHorizontal: 10,
              fontFamily: 'Poppins-Regular',
            }}></TextInput>
        </View>

        //Password Input
         <View style={[{ marginTop: 25 }, styles.input]}>
  {/* 🔒 Password Icon */}
  <View style={styles.iconWrapper}>
    <Ionicons name="key" size={20} color="white" />
  </View>

  {/* 🔤 Password Input */}
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

  {/* 👁️ Eye Icon */}
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
              style={styles.button}
              onPress={() => router.replace('./(tabs)')}
            >
             <Text style={styles.logintxt}>Login</Text>
            </TouchableOpacity>
<View style={{flexDirection:'row', gap:5,justifyContent:"center"}}>
<Text style={styles.noaccountText}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.navigate('/signup')}>
                <Text style={styles.signuptext}>
                  SignUp
                </Text></TouchableOpacity></View>
                
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

flex:1,
    alignContent: 'center',
justifyContent:"center",
    backgroundColor: '#ffffff',
    padding: 5,
  },
  heading: {
    marginTop: -50,
    color:colors.text,

    marginLeft: 20,
    fontSize: 35,
    lineHeight: 60,
    textAlign: 'left',
    fontFamily: 'Poppins-SemiBold',
  },

  main: {
    width: '90%',
    height: 'auto',
    paddingVertical:"20",
    marginTop: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  image:{
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
  button:{
width:'30%',
height:50,
borderRadius:22,
alignSelf:"center",
margin:25,
justifyContent:"center",
alignItems:"center",
backgroundColor:colors.secondary,
  },
  logintxt:{

fontFamily:"Poppins-SemiBold",
color:colors.black,

  },noaccountText:{

fontFamily:"Poppins-Regular",
color:colors.white,


  },
  signuptext:{
fontFamily:"Poppins-SemiBold",

color:colors.secondary

  },eyeWrapper: {
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
