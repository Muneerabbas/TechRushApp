import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFonts } from "expo-font";
import colors from "../assets/utils/colors";
import TransactionCard from "../components/TransactionCard";
import { getTransactionHistory, getUserId } from "../../api/transactionApi";

export default function Transactions() {
  const [data, setData] = useState([]);
  const [userID, setUserID] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const id = await getUserId();
      setUserID(id);
      const res = await getTransactionHistory();
      setData(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-IN", options);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction History</Text>

      {/* Optional: show logged in user ID */}
      {/* <Text style={styles.userIdText}>User ID: {userID}</Text> */}

      <View style={styles.main}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TransactionCard
                item={item}
                userID={userID}
                formatDateTime={formatDateTime}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchData(true);
                }}
              />
            }
          />
        )}
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
  userIdText: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 5,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  main: {
    height: "80%",
    marginTop: 10,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
  },
});
