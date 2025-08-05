import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Alert from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// import * as ImagePicker from 'expo-image-picker';

import colors from "../assets/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

export default function index() {
  const router = useRouter();
  const [name, setName] = useState("");


async  function getusername() {
  const username = await AsyncStorage.getItem("name");
  setName(username);

  }
useEffect(()=>{
getusername()


},[])
  const [fontsLoaded] = Font.useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });
  const [imageUri, setImageUri] = useState(null);
  async function handleSignOut() {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");

      router.replace("/startup");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  
  return (
    <View style={styles.container}>
      <View style={{  width:"auto",backgroundColor:colors.primary, borderBottomEndRadius:30, borderBottomLeftRadius:30,
      padding:15,
      paddingTop:50,
      justifyContent:"space-between",
      flexDirection:"row",
      alignItems:"center",
      alignContent:"center",
      height:"30%",
}} >   <View> 
{name?<Text
style={{
  fontSize: 35,
  color: colors.white,
  marginLeft: 10,

  fontFamily: "Poppins-Bold",
}}
>
Hello,{"\n"}
{name}
</Text>:<Text
style={{
  fontSize: 35,
  color: colors.white,
  marginLeft: 10,

  fontFamily: "Poppins-Bold",
}}
>
Hello,{"\n"}
Buddy!
</Text>}


</View>


<View
              style={{
                backgroundColor: colors.secondary,
                height: 45,
                width: 45,
                marginRight:10,
                marginTop:20,
                borderRadius: 50,
                alignItems: "center",
                alignSelf:"flex-start",
                justifyContent: "center",
              }}
            >
            <TouchableOpacity onPress={()=>{      router.navigate("/src/screens/profile");
}}><Ionicons name="person-outline" size={25} color="black" /></TouchableOpacity>
            </View>
     
</View>
    

    <View style={{backgroundColor:colors.background, borderRadius:25, marginTop:100, alignSelf:"center",   width:'95%',}}>
    <View>
      <TouchableOpacity onPress={handleOpenCamera} >

<Ionicons name="scan-circle-outline" size={120} color="white" style={{elevation:4, borderRadius:100,alignSelf: "center",position:"absolute",bottom:-40 ,backgroundColor:colors.secondary, }} />
</TouchableOpacity>;
<Text
          style={{
            fontSize: 30,
            color: colors.white,
            marginTop: 50,
            marginLeft:20,
            textAlign:"center",
            fontFamily: "Poppins-Bold",
          }}
        >
          Pay !
        </Text>
  
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: colors.background,
          padding: 10,
          marginTop:10,
      
          borderRadius: 35,
        }}
      >
        <View style={[styles.input, { flexDirection: "row" }]}>
          <View
            style={{
              backgroundColor: colors.background,
              height: 30,
              width: 30,
              marginTop: 10,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="cash-outline" size={15} color="white" />
          </View>
          <TextInput
            placeholder="Paying Who ?"
            style={{
              marginHorizontal: 10,
              width: "100%",
              fontFamily: "Poppins-Regular",
            }}
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={[styles.logintxt]}>Pay</Text>
        </TouchableOpacity>
      </View>
</View>
      {/* <View>
        <Text
          style={{
            fontSize: 25,
            color: colors.text,
            marginTop: 10,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          Favroites
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <View style={styles.favperson}>
            <Ionicons name="person" size={35} color="white" />
          </View>
          <View style={styles.favperson}>
            <Ionicons name="person" size={35} color="white" />
          </View>{" "}
          <View style={styles.favperson}>
            <Ionicons name="person" size={35} color="white" />
          </View>{" "}
          <View style={styles.favperson}>
            <Ionicons name="person" size={35} color="white" />
          </View>
        </View>
      </View> */}
      <View style={{ marginTop: 20, backgroundColor:colors.primary ,  paddingBottom:20, borderRadius:25}}>
        <Text
          style={{
            fontSize: 20,
            color: colors.white,
            marginTop: 20,
            marginLeft:20,
            fontFamily: "Poppins-Bold",
          }}
        >Make The Group!
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 20,
            // marginTop: 0,
          }}
        >
          <View style={[styles.input, { flexDirection: "row" }]}>
            <View
              style={{
                backgroundColor: colors.primary,
                height: 30,
                width: 30,
                marginTop: 10,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="people-outline" size={15} color="white" />
            </View>
            <TextInput
              placeholder="Enter Amount To Split"
              style={{
                marginHorizontal: 10,
                fontFamily: "Poppins-Regular",
                width: "100%",
              }}
            ></TextInput>
          </View>{" "}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary }]}
          >
            <Text style={[styles.logintxt, { color: colors.text }]}>
              Split
            </Text>
          </TouchableOpacity>
        </View>
      </View></View>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 15,
    verticalAlign: "center",
    flex: 1,
    // paddingTop: 40,
    alignContent: "center",
    backgroundColor:'#F9FAFB',
    justifyContent: "space-between",
    paddingBottom: 150,
  },

  main: {
    width: 150,
    height: 150,
    borderRadius: 100,
    
    justifyContent:"center",
    alignSelf: "center",
    // backgroundColor: colors.white,
  },

  button: {
    width: "20%",
    height: 50,
    borderRadius: 18,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary   },
  logintxt: {
    fontSize: 15,
    textAlign: "center",
    width: "100%",
    fontFamily: "Poppins-SemiBold",
    color: colors.text,
  },

  favperson: {
    backgroundColor: colors.background,
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "75%",
    height: 50,
    alignSelf: "center",

    borderRadius: 15,
    backgroundColor: "white",
    fontFamily: "Poppins-Regular",
    paddingLeft: 10,
    flexDirection: "row",

    alignSelf: "center",
  },

  image: {
    height: 100,
    width: 100,
    marginBottom: 20,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
    marginTop: 10,
  },
});
