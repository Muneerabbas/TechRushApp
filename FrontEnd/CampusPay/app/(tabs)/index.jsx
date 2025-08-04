import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import colors from "../assets/utils/colors";
import { useState } from 'react';

export default function Index() {
  const router = useRouter();

  const [fontsLoaded] = Font.useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf')
  });

  const [imageUri, setImageUri] = useState(null);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      router.replace('/startup');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
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
      <View style={styles.main}>
        <TouchableOpacity onPress={handleOpenCamera}>
          <Image
            source={require("../assets/images/qr-code.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>Or</Text>

      <View style={styles.paymentSection}>
        <View style={styles.input}>
          <View style={styles.iconBox}>
            <Ionicons name="cash" size={15} color="white" />
          </View>
          <TextInput
            placeholder="Enter name To Pay"
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.logintxt}>Pay</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Favorites</Text>
      <View style={styles.favRow}>
        {[1, 2, 3, 4].map((_, i) => (
          <View key={i} style={styles.favperson}>
            <Ionicons name="person" size={35} color="white" />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Split The Bills</Text>
      <View style={styles.splitRow}>
        <View style={styles.input}>
          <View style={styles.iconBox}>
            <Ionicons name="people-outline" size={15} color="white" />
          </View>
          <TextInput
            placeholder="Enter Amount To Split"
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logintxt, { color: colors.white }]}>Split</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignOut}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    paddingTop: 70,
    justifyContent: 'space-around',
    paddingBottom: 150,
  },
  main: {
    width: 150,
    height: 150,
    borderRadius: 22,
    padding: 15,
    alignSelf: "center",
    backgroundColor: colors.primary,
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  orText: {
    fontFamily: "Poppins-SemiBold",
    color: colors.text,
    fontSize: 25,
    textAlign: "center",
    margin: 10,
  },
  paymentSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 18,
  },
  input: {
    width: '75%',
    height: 50,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    paddingLeft: 10,
  },
  iconBox: {
    backgroundColor: colors.background,
    height: 30,
    width: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    marginHorizontal: 10,
    width: '100%',
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    width: '100%',
    color: colors.black,
  },
  sectionTitle: {
    fontSize: 25,
    color: colors.text,
    fontFamily: "Poppins-SemiBold",
    marginTop: 10,
  },
  favRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  favperson: {
    backgroundColor: colors.background,
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  splitRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
});
