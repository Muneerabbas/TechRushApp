import React, { useEffect, useState, useCallback, memo } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFonts } from "expo-font";
import colors from "../assets/utils/colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Create a memoized version of the UserBalanceCard for performance
const UserBalanceCard = memo(({ name, balance }) => (
  <View style={styles.userCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.cardType}>Campus Card</Text>
    </View>
    <View>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{`₹ ${balance.toLocaleString('en-IN')}`}</Text>
    </View>
  </View>
));
UserBalanceCard.displayName = 'UserBalanceCard';

// Create a memoized version of the TransactionCard for performance
const TransactionCard = memo(({ item, currentUserID }) => {
  const isCredit = item.receiver._id === currentUserID;
  const iconName = isCredit ? "arrow-down" : "arrow-up";
  const iconColor = isCredit ? "#2E7D32" : "#C62828";
  const amountColor = isCredit ? styles.creditAmount : styles.debitAmount;

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: isCredit ? '#DFF7E2' : '#FFEBEE' }]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionParty}>{isCredit ? `From: ${item.sender.name}` : `To: ${item.receiver.name}`}</Text>
        <Text style={styles.transactionTime}>{formatDateTime(item.createdAt)}</Text>
      </View>
      <Text style={[styles.transactionAmount, amountColor]}>{`${isCredit ? '+' : '-'}₹${item.amount}`}</Text>
    </View>
  );
});
TransactionCard.displayName = 'TransactionCard';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState({ id: '', name: 'User' });
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  // Function to fetch transaction data
  const fetchData = useCallback(async () => {
    if (!refreshing) setStatus('loading');
    try {
      const token = await AsyncStorage.getItem("authToken");
      const currentUserID = await AsyncStorage.getItem("userID");
      const currentUserName = await AsyncStorage.getItem("name");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      setUser({ id: currentUserID, name: currentUserName || 'User' });

      const res = await axios.get('https://techrush-backend.onrender.com/api/transactions/history');
      setTransactions(res.data);
      setStatus('success');
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      if (error.response && error.response.status === 404) {
        setTransactions([]);
        setStatus('empty');
      } else {
        setStatus('error');
      }
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
      return (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      );
    }
    if (status === 'error') {
      return (
        <View style={styles.centeredMessageContainer}>
          <Ionicons name="cloud-offline-outline" size={50} color="#FFD2D2" />
          <Text style={styles.messageTitle}>Something Went Wrong</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (status === 'empty' || transactions.length === 0) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Ionicons name="receipt-outline" size={50} color="#E0CFFF" />
          <Text style={styles.messageTitle}>No Transactions Yet</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionCard item={item} currentUserID={user.id} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 , height:'auto'}}
      />
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Wallet</Text>
      <UserBalanceCard name={user.name} balance={25469.52} />
      {/* This view now correctly applies the primary color background */}
      <View style={styles.main}>
        <Text style={styles.listHeader}>Recent History</Text>
        <View style={{ flex: 1 }}>
          {renderContent()}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Crafted with ❤️ in Pict</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },
  heading: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    color: "#121212",
  },
  userCard: {
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  cardType: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#F0E6D2',
  },
  balanceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#F0E6D2',
  },
  balanceAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 34,
    color: '#FFFFFF',
    marginTop: 5,
    letterSpacing: 1,
  },
  main: {
    flex: 1,
    backgroundColor: colors.primary,
    marginTop: -30,
    paddingTop: 35,
    height:'auto',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  listHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: colors.white,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionParty: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#333',
  },
  transactionTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  transactionAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  creditAmount: {
    color: "#2E7D32",
  },
  debitAmount: {
    color: "#C62828",
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: 'white',
    marginTop: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
   footer: {
    paddingVertical: 10,
    width: "100%",
    height:'auto',
    justifyContent: "center",
    alignItems: 'center',
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    color: "white",
    textAlign:"center",
    
   margin:20,
    fontSize: 14,
  },
});
