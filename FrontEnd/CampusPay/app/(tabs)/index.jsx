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
      <View style={{  width:"auto"}} > 
        <View style={{alignSelf:"flex-end",}}>
        <Ionicons name="person" size={30} color={colors.text} style={{}}/>

        </View>
</View>
      <View style={styles.main}>

        <TouchableOpacity onPress={handleOpenCamera}>
          {/* <Image
            source={require("../assets/images/qr-code.png")}
            style={styles.image}
          /> */}
            <Ionicons name="scan-circle-outline" size={150} color="white"  style={{alignSelf:"center"}}/>
            </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: "Poppins-SemiBold",
          color: colors.text,
          fontSize: 25,
          textAlign: "center",
          margin: 10,
        }}
      >
        Or
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 18,
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
            <Ionicons name="cash" size={15} color="white" />
          </View>
          <TextInput
            placeholder="Enter name To Pay"
            style={{
              marginHorizontal: 10,
              width: "100%",
              fontFamily: "Poppins-Regular",
            }}
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.logintxt}>Pay</Text>
        </TouchableOpacity>
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
      <View style={{ marginTop: 50 }}>
        <Text
          style={{
            fontSize: 25,
            color: colors.text,
            marginTop: 20,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          Split The Bills
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: colors.secondary,
            padding: 10,
            borderRadius: 20,
            marginTop: 20,
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
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.logintxt, { color: colors.white }]}>
              Split
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    verticalAlign: "center",
    flex: 1,
    paddingTop: 40,
    alignContent: "center",
    backgroundColor:'#F9FAFB',
    justifyContent: "space-around",
    paddingBottom: 150,
  },

  main: {
    width: 150,
    height: 150,
    borderRadius: 100,
    
    justifyContent:"center",
    alignSelf: "center",
    backgroundColor: colors.primary,
  },

  button: {
    width: "20%",
    height: 50,
    borderRadius: 18,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  logintxt: {
    fontSize: 15,
    textAlign: "center",
    width: "100%",
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
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
