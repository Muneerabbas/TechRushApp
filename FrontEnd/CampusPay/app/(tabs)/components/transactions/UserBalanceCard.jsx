// app/(tabs)/components/transactions/UserBalanceCard.jsx
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../../assets/utils/colors';

export const UserBalanceCard = memo(({ name, balance }) => (
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

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: colors.secondary, marginHorizontal: 20, borderRadius: 20,
    padding: 25, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2,
    shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, zIndex: 10,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 25,
  },
  userName: { fontFamily: 'Poppins-Bold', fontSize: 20, color: colors.text },
  cardType: { fontFamily: 'Poppins-Regular', fontSize: 14, color: 'rgba(51, 51, 51, 0.7)' },
  balanceLabel: { fontFamily: 'Poppins-Regular', fontSize: 14, color: 'rgba(51, 51, 51, 0.7)' },
  balanceAmount: { fontFamily: 'Poppins-Bold', fontSize: 34, color: colors.text, marginTop: 5, letterSpacing: 1 },
});