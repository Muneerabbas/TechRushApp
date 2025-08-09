// app/(tabs)/components/home/Header.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../assets/utils/colors';
import { useRouter } from 'expo-router';

export const Header = ({ name }) => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greetingText}>
          Hello,{"\n"}
          {name || 'Buddy!'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => router.replace("/src/screens/profile")}
      >
        <Ionicons name="person-outline" size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    backgroundColor: colors.primary,
  },
  greetingText: {
    fontSize: 35,
    color: colors.white,
    fontFamily: "Poppins-Bold",
  },
  profileBtn: {
    backgroundColor: colors.secondary,
    height: 45,
    width: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
  },
});