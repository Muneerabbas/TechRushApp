import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  TextInput,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import FooterComponent from "../components/Footer";
import PaymentModal from "../components/PaymentModal";
import colors from "../assets/utils/colors";
import { Header } from "./components/home/Header";
import { QuickActions } from "./components/home/QuickActions";
import { RecentGroups } from "../components/RecentGroups";
import { scanIdCard } from "../services/idCardScanner";

// Loading modal for initial font loading
const LoadingModal = ({ visible }) => (
  <Modal transparent={true} animationType="fade" visible={visible}>
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  </Modal>
);

export default function HomeScreen() {
  // Font loading state
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  // Component state variables
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [splitAmount, setSplitAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  
  // Animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  // Function to load initial user data and groups
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
      // Silently fail on group fetch error
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle search query changes with a debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Function to search for users
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

  // Function to handle selecting a user from search results
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    setSearchQuery(user.name);
  };

  // Function to handle scanning an ID card
  const handleScanId = async () => {
    setOcrLoading(true);
    try {
      const extractedName = await scanIdCard(false, console.log);
      if (extractedName) {
        setSearchQuery(extractedName);
      }
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setOcrLoading(false);
    }
  };
  
  // Interpolations for scroll animation
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

  // Show loading modal until fonts are loaded
  if (!fontsLoaded) {
    return <LoadingModal visible={true} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LoadingModal visible={!fontsLoaded} />
      <Header name={name} role={role} onReload={loadInitialData} />
      <View style={styles.mainContentArea}>
        <Animated.ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
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
              <TouchableOpacity onPress={handleScanId} style={styles.scanButton}>
                {ocrLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Ionicons name="id-card-outline" size={24} color={colors.primary} />
                )}
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

          <View>
            <RecentGroups groups={groups} />
          </View>

          <View>
            <FooterComponent />
          </View>
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
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  loadingText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
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
