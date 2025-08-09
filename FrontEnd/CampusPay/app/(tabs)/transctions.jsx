// app/(tabs)/transactions.jsx (Transactions Screen)
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../assets/utils/colors";
import { getTransactionHistory } from "./services/apiService";
import { UserBalanceCard } from "./components/transactions/UserBalanceCard";
import { TransactionCard } from "./components/transactions/TransactionCard";

export default function TransactionsScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState({ id: '', name: 'User' });
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!refreshing) setStatus('loading');
    try {
      const [history, currentUserID, currentUserName] = await Promise.all([
        getTransactionHistory(),
        AsyncStorage.getItem("userID"),
        AsyncStorage.getItem("name"),
      ]);
      setUser({ id: currentUserID, name: currentUserName || 'User' });
      setTransactions(history);
      setStatus(history.length > 0 ? 'success' : 'empty');
    } catch (error) {
      setStatus('error');
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderContent = () => {
    if (status === 'loading' && !refreshing) {
      return <ActivityIndicator size="large" color={colors.white} style={{ flex: 1 }} />;
    }
    if (status === 'error') {
      return <View style={styles.centeredMessageContainer}><Text style={styles.messageTitle}>Error loading history</Text></View>;
    }
    if (status === 'empty') {
      return <View style={styles.centeredMessageContainer}><Text style={styles.messageTitle}>No Transactions Yet</Text></View>;
    }
    return (
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionCard item={item} currentUserID={user.id} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.white]} tintColor={colors.white} />}
      />
    );
  };

  if (!fontsLoaded) {
    return <View style={styles.container}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Wallet</Text>
      <UserBalanceCard name={user.name} balance={25469.52} />
      <View style={styles.main}>
        <Text style={styles.listHeader}>Recent History</Text>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  heading: { fontSize: 28, fontFamily: "Poppins-Bold", paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15, color: "#121212" },
  main: { flex: 1, backgroundColor: colors.primary, marginTop: -30, paddingTop: 35, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  listHeader: { fontFamily: 'Poppins-Bold', fontSize: 18, color: colors.white, paddingHorizontal: 25, paddingTop: 15, paddingBottom: 10 },
  centeredMessageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messageTitle: { fontFamily: "Poppins-Bold", fontSize: 18, color: 'white' },
});