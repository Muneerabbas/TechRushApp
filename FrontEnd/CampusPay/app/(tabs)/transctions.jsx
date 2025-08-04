import { useEffect, useState } from "react";
import { SafeAreaView, Text, View, StyleSheet, FlatList } from "react-native";
import { useFonts } from "expo-font";
import colors from "../assets/utils/colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl } from "react-native";
export default function Transctions() {
  useEffect(() => {
    getData();
  }, []);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
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
      `transactions/history`,

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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-IN", options); // Format: "03 Aug 2025, 10:45 AM"
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    SetData([]);

    setTimeout(() => {
      setRefreshing(false);
    }, await getData());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction History</Text>

      <View style={styles.main}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressBackgroundColor={colors.secondary}
            />
          }
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                userID !== item.receiver._id
                  ? { backgroundColor: "#FFAFAF" }
                  : { backgroundColor: "#DFF7E2" },
              ]}
            >
              <View style={{}}>
                {userID == item.receiver._id ? (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.title, { color: "#228B22" }]}>
                      Credited{" "}
                    </Text>{" "}
                    <Ionicons
                      name="arrow-down-circle-outline"
                      size={25}
                      color={"#228B22"}
                    />
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Text style={[styles.title, { color: "#CD1C18" }]}>
                      Debited
                    </Text>{" "}
                    <Ionicons
                      name="arrow-up-circle-outline"
                      size={25}
                      color={"#CD1C18"}
                    />
                  </View>
                )}
                {userID == item.receiver._id ? (
                  <Text style={styles.textstyle}>
                    {item.amount}rs By {item.sender.name}
                  </Text>
                ) : (
                  <Text style={styles.textstyle}>
                    {item.amount}rs To {item.receiver.name}
                  </Text>
                )}
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
    fontFamily: "Poppins-Bold",
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
  textstyle: {
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
