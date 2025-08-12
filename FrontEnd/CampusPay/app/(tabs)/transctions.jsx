import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../assets/utils/colors";
import { getTransactionHistory, getBalance } from "./services/apiService";
import { UserBalanceCard } from "./components/transactions/UserBalanceCard";
import { TransactionCard } from "./components/transactions/TransactionCard";

export default function TransactionsScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState({ id: "", name: "User" });
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("loading");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) {
      setStatus("loading");
    }
    try {
      const currentUserID = await AsyncStorage.getItem("userID");
      const currentUserName = await AsyncStorage.getItem("name");
      setUser({ id: currentUserID, name: currentUserName || "User" });

      // Fetch balance and history separately to handle errors gracefully
      const balanceData = await getBalance();
      setBalance(balanceData.balance);

      let history = [];
      try {
        const historyData = await getTransactionHistory();
        history = historyData || [];
      } catch (error) {
        // A 404 error means no transactions, which is not a failure state.
        if (error.response && error.response.status === 404) {
          history = [];
        } else {
          // For other errors, we let the main catch block handle it.
          throw error;
        }
      }

      setTransactions(history);
      setStatus(history.length > 0 ? "success" : "empty");

    } catch (error) {
      console.error("Failed to fetch transaction data:", error);
      setStatus("error");
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const renderContent = () => {
    if (status === "loading" && !refreshing) {
      return (
        <ActivityIndicator
          size="large"
          color={colors.white}
          style={{ flex: 1 }}
        />
      );
    }
    if (status === "error") {
      return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.white]}
                    tintColor={colors.white}
                />
            }
        >
            <View style={styles.centeredMessageContainer}>
                <Text style={styles.messageTitle}>Error loading history</Text>
            </View>
        </ScrollView>
      );
    }
    if (status === "empty") {
      return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.white]}
                    tintColor={colors.white}
                />
            }
        >
            <View style={styles.centeredMessageContainer}>
                <Text style={styles.messageTitle}>No Transactions Yet</Text>
            </View>
        </ScrollView>
      );
    }
    return (
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionCard item={item} currentUserID={user.id} />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.white]}
            tintColor={colors.white}
          />
        }
      />
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Wallet</Text>
      <UserBalanceCard name={user.name?.split(" ")[1]} balance={balance} />
      <View style={styles.main}>
        <Text style={styles.listHeader}>Recent History</Text>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBEB" },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFBEB",
  },
  heading: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    color: "#121212",
  },
  main: {
    flex: 1,
    backgroundColor: colors.primary,
    marginTop: -30,
    paddingTop: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  listHeader: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.white,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageTitle: { fontFamily: "Poppins-Bold", fontSize: 18, color: "white" },
});
