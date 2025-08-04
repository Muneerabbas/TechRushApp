import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/utils/colors";

export default function TransactionCard({ item, userID, formatDateTime }) {
  const isSender = item.sender._id === userID;
  const from = item.sender.name;
  const to = item.receiver.name;
  const status = item.status || "Pending";

  return (
    <View style={[styles.card, isSender ? styles.debited : styles.credited]}>
      <View style={styles.headerRow}>
        <Ionicons
          name={isSender ? "arrow-up-circle" : "arrow-down-circle"}
          size={20}
          color={isSender ? "#c0392b" : "#2e7d32"}
        />
        <Text style={styles.amountText}>₹{item.amount}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}><Text style={styles.bold}>From:</Text> {from}</Text>
        <Text style={styles.label}><Text style={styles.bold}>To:</Text> {to}</Text>
      </View>

      <View style={styles.footerRow}>
        <Ionicons name="time-outline" size={12} color="#555" />
        <Text style={styles.timeText}>{formatDateTime(item.createdAt)}</Text>
      </View>

      <Text style={[styles.transactionType, { color: isSender ? "#c0392b" : "#2e7d32" }]}>
        {isSender ? "Debited" : "Credited"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "92%",
    alignSelf: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },

  debited: {
    backgroundColor: "#ffeaea", // lighter red
  },
  credited: {
    backgroundColor: "#e4f7ea", // lighter green
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  amountText: {
    flex: 1,
    fontFamily: "Poppins-Bold",
    fontSize: 17,
    color: "#000",
  },
  statusBadge: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#444",
  },
  description: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  bold: {
    fontFamily: "Poppins-SemiBold",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#666",
  },
  transactionType: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "flex-end",
  },
});
