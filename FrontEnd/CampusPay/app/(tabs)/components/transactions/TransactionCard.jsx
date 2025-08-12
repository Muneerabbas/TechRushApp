import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const TransactionCard = memo(({ item, currentUserID }) => {
  const isCredit = item.receiver._id === currentUserID;
  const iconName = isCredit ? "arrow-down-outline" : "arrow-up-outline";
  const iconColor = isCredit ? "#16A34A" : "#DC2626";
  const amountColor = isCredit ? styles.creditAmount : styles.debitAmount;
  const transactionParty = isCredit ? `From: ${item.sender.name}` : `To: ${item.receiver.name}`;
  const tintColor = isCredit ? "rgba(209, 250, 229, 0.4)" : "rgba(254, 226, 226, 0.4)";

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={styles.transactionItem}>
      <View style={[styles.tintOverlay, { backgroundColor: tintColor }]} />
      <View style={[styles.transactionIcon, { backgroundColor: isCredit ? '#D1FAE5' : '#FEE2E2' }]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionParty} numberOfLines={1}>{transactionParty}</Text>
        {item.description ? (
            <Text style={styles.transactionDescription} numberOfLines={1}>
                {item.description}
            </Text>
        ) : null}
        <Text style={styles.transactionTime}>{formatDateTime(item.createdAt)}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.transactionAmount, amountColor]}>
          {`${isCredit ? "+" : "-"}₹${Number(item.amount).toFixed(2)}`}
        </Text>
      </View>
    </View>
  );
});

TransactionCard.displayName = "TransactionCard";

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden', // Important for the tint overlay
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    zIndex: 1,
  },
  transactionDetails: { 
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  transactionParty: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#2D3748",
  },
  transactionDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
  },
  transactionTime: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#A0AEC0",
    marginTop: 4,
  },
  amountContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingLeft: 10,
    zIndex: 1,
  },
  transactionAmount: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  creditAmount: { color: "#16A34A" },
  debitAmount: { color: "#DC2626" },
});
