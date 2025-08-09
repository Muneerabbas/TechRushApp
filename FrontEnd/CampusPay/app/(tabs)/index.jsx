// app/(tabs)/index.jsx (Home Screen)
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";

import PaymentModal from "../components/PaymentModal";
import colors from "../assets/utils/colors";
import { searchUsers } from "./services/apiService";
import { Header } from "./components/home/Header";
import { PayUser } from "./components/home/PayUser";
import { QuickActions } from "./components/home/QuickActions";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });
  
  const [name, setName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [splitAmount, setSplitAmount] = useState("");
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadUsername = async () => {
      const username = await AsyncStorage.getItem("name");
      setName(username);
    };
    loadUsername();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    try {
      const users = await searchUsers(query);
      setSearchedUsers(users);
    } catch (error) {
      setSearchedUsers([]);
    }
  };
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    setSearchQuery(user.name);
  };

  if (!fontsLoaded) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Header name={name} />
      
      <View style={styles.mainContentArea}>
        <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <PayUser
                query={searchQuery}
                setQuery={setSearchQuery}
                users={searchedUsers}
                onSelectUser={handleSelectUser}
            />
            <QuickActions 
                splitAmount={splitAmount}
                setSplitAmount={setSplitAmount}
            />
        </ScrollView>
      </View>

      {isModalVisible && selectedUser && (
        <PaymentModal
          receiverid={selectedUser._id}
          Payto={selectedUser.name}
          data={() => setIsModalVisible(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainContentArea: { flex: 1, backgroundColor: "#f0f2f5", borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  contentContainer: { padding: 25 },
});