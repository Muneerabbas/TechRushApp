import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import PaymentModal from "../components/PaymentModal";
import colors from "../assets/utils/colors";
import { Header } from "./components/home/Header";
import { QuickActions } from "./components/home/QuickActions";
import { RecentGroups } from "../components/RecentGroups";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [splitAmount, setSplitAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [groups, setGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const loadInitialData = useCallback(async () => {
    const username = await AsyncStorage.getItem("name");
    const userRole = await AsyncStorage.getItem("role");
    setName(username);
    setRole(userRole);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.get(
        `https://techrush-backend.onrender.com/api/groups/my-groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroups(res.data || []);
    } catch (error) {
        console.error("Failed to fetch groups:", error);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, [loadInitialData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchedUsers([]);
      return;
    }
    setIsSearching(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.get(
        `https://techrush-backend.onrender.com/api/search`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { query },
        }
      );
      setSearchedUsers(res.data.users || []);
    } catch (error) {
      setSearchedUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    setSearchQuery(user.name);
  };

  const payUserScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const payUserTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header name={name} role={role} />
      <View style={styles.mainContentArea}>
        <Animated.ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <Animated.View
            style={[
              styles.payUserContainer,
              {
                transform: [{ translateY: payUserTranslateY }, { scale: payUserScale }],
              },
            ]}
          >
            <Text style={styles.payUserTitle}>Scan & Pay</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={22} color="#999" style={styles.searchIcon} />
              <TextInput
                placeholder="Search user by name or ID..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.scanButton}>
                <Ionicons name="id-card-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {isSearching && <ActivityIndicator style={{ marginVertical: 10 }} />}
            {searchedUsers.length > 0 && (
              <View style={styles.searchResultsContainer}>
                <ScrollView nestedScrollEnabled={true}>
                  {searchedUsers.map((user) => (
                    <TouchableOpacity key={user._id} style={styles.userItem} onPress={() => handleSelectUser(user)}>
                      <Text style={styles.userName}>{user.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </Animated.View>

          <View style={{ paddingHorizontal: 25 }}>
            <QuickActions
              splitAmount={splitAmount}
              setSplitAmount={setSplitAmount}
            />
          </View>

          <RecentGroups groups={groups} />

        </Animated.ScrollView>
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
  mainContentArea: {
    flex: 1,
    backgroundColor: "#F8F7FF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  contentContainer: { paddingVertical: 25 },
  payUserContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 25,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  payUserTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  scanButton: {
    padding: 10,
  },
  searchResultsContainer: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    maxHeight: 250,
  },
  userItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});
