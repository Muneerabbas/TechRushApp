// app/(tabs)/components/home/QuickActions.jsx
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../assets/utils/colors';
import { useRouter, Link} from 'expo-router';
import { useCameraPermissions } from "expo-camera";

export const QuickActions = ({ splitAmount, setSplitAmount }) => {
  const router = useRouter();
  return (
    <>
    
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => {console.log("Scan Pressed"), router.push('/src/screens/Scanner')}}
      >
        <Ionicons name="qr-code-outline" size={35} color={colors.white} />
        <Text style={styles.scanButtonText}>Scan to Pay</Text>
      </TouchableOpacity>
      <View style={styles.splitSection}>
        <Text style={styles.splitHeader}>Split a Payment</Text>
        <View style={styles.splitInputContainer}>
          <TextInput
            placeholder="Enter Amount to Split"
            value={splitAmount}
            onChangeText={setSplitAmount}
            keyboardType="numeric"
            style={styles.splitInput}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={[styles.splitButton, !splitAmount.trim() && styles.splitButtonDisabled]}
            onPress={() =>
              router.push({
                pathname: "/src/screens/Split",
                params: { prevamount: splitAmount },
              })
            }
            disabled={!splitAmount.trim()}
          >
            <Text style={styles.splitButtonText}>Split</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 3,
  },
  scanButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
  splitSection: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  splitHeader: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginBottom: 15,
  },
  splitInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 15,
    paddingLeft: 15,
  },
  splitInput: {
    flex: 1,
    height: 50,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#333",
  },
  splitButton: {
    width: 100,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  splitButtonDisabled: {
    backgroundColor: "#a0c4ff",
  },
  splitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
});