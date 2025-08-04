import { useEffect, useState } from "react";
import { SafeAreaView, Text, View, StyleSheet, FlatList } from "react-native";
import { useFonts } from "expo-font";
import colors from "../assets/utils/colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Transctions() {
  useEffect(() => {
    getData();
  }, []);

  const [fontsLoaded] = useFonts({
    // 'Poppins-Bold': require('../assests/fonts/Poppins-Bold.ttf'),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [data, SetData] = useState([]);
  const [userID, setUserID] = useState("");

  async function getData() {
    const token = await AsyncStorage.getItem("authToken");
    const userid = await AsyncStorage.getItem("userID");
    setUserID(userid);
    const res = await axios.get(
      `https://eu-practitioners-manor-arrival.trycloudflare.com/api/transactions/history`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    SetData(res.data);
  }
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-IN', options); // Format: "03 Aug 2025, 10:45 AM"
  }
  

  // const renderItem = ({ item }) => (
  //   <View style={styles.card}>
  //     <Text style={styles.jokeText}>{item.joke}</Text>
  //   </View>
  // );
  // const [credited, setcredited]= useState(false)
  // {{
  // setcredited(true)

  // }}

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction History</Text>

      <View style={styles.main}>
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                userID !== item.receiver._id ?{ backgroundColor: "#FFAFAF" }:{ backgroundColor: "#DFF7E2" },
              ]}
            >
              <View style={{}}>
                {userID == item.receiver._id ? (
                  <Text style={[styles.title]}>Credited</Text>
                ) : (
                  <Text style={[styles.title]}>Debited</Text>
                )}
                <Text style={styles.jokeText}>
                  {item.amount}rs to {item.receiver.name}
                </Text>
              </View>

              <Text style={[styles.timetxt, { textAlign: "right" }]}>
              {formatDateTime(item.createdAt)}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F9FAFF",
  },
  heading: {
    fontSize: 24,

    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "Poppins-SemiBold",
  },
  main: {
    height: "80%",
    marginTop: 10,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    width: "90%",
    height: "auto",
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
  },
  jokeText: {
    fontSize: 15,
    color: colors.black,
    fontFamily: "Poppins-Regular",
  },
  title: {
    fontSize: 16,
    color: colors.black,
    fontFamily: "Poppins-SemiBold",
  },
  timetxt: {
    fontSize: 12,
    color: colors.black,
    fontFamily: "Poppins-Regular",
  },
});
