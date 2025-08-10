import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Made with ❤️ in PICT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    color: "#999",
    fontSize: 14,
  },
});
