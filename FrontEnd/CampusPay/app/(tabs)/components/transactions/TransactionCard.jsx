// app/(tabs)/components/transactions/TransactionCard.jsx
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const TransactionCard = memo(({ item, currentUserID }) => {
  const isCredit = item.receiver._id === currentUserID;
  const iconName = isCredit ? "arrow-down" : "arrow-up";
  const iconColor = isCredit ? "#2E7D32" : "#C62828";
  const amountColor = isCredit ? styles.creditAmount : styles.debitAmount;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
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

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 15, padding: 12, marginBottom: 10,
  },
  transactionIcon: {
    width: 45, height: 45, borderRadius: 22.5,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  transactionDetails: { flex: 1 },
  transactionParty: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: '#333' },
  transactionTime: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#777', marginTop: 2 },
  transactionAmount: { fontFamily: 'Poppins-Bold', fontSize: 15 },
  creditAmount: { color: "#2E7D32" },
  debitAmount: { color: "#C62828" },
});