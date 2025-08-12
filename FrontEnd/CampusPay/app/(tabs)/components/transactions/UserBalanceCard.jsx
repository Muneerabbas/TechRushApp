import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../assets/utils/colors";
import { Ionicons } from "@expo/vector-icons";

export const UserBalanceCard = memo(({ name, balance }) => (
  <View style={styles.userCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.userName}>{name}</Text>
      <View style={styles.cardTypeContainer}>
        <Ionicons name="card" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
        <Text style={styles.cardType}>Campus Card</Text>
      </View>
    </View>
    <View>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{`₹ ${balance.toLocaleString("en-IN")}`}</Text>
    </View>
  </View>
));
UserBalanceCard.displayName = "UserBalanceCard";

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 28,
    elevation: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 16 },
    borderWidth: 1,
    borderColor: "#A7C4A0", 
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  userName: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    flexWrap:"wrap",
    color: colors.text,
  },
  cardTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardType: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  balanceLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  balanceAmount: {
    fontFamily: "Poppins-Bold",
    fontSize: 36,
    color: colors.text,
    letterSpacing: 1,
  },
});