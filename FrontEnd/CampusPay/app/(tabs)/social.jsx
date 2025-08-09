import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList, 
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  ScrollView, 
} from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import colors from "../assets/utils/colors";
import SocialModal from "../components/SocialModal";

// Simplified axios instance
const api = axios.create({
  baseURL: "https://techrush-backend.onrender.com/api",
});

const LoadingScreen = () => (
  <View style={styles.centerScreen}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Loading stuff...</Text>
  </View>
);

const ErrorScreen = ({ onRetry }) => (
  <View style={styles.centerScreen}>
    <Text style={styles.errorText}>Oops! Something went wrong.</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

export default function Social() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState("");
  // Separate state for each data type for clarity
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const getAllData = useCallback(async () => {
    setIsError(false);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const userRole = await AsyncStorage.getItem("role");
      setRole(userRole);

      const [clubsRes, eventsRes, socialsRes] = await Promise.all([
        api.get("/clubs"),
        api.get("/events"),
        api.get("/social/community"),
      ]);

      setClubs(clubsRes.data);
      setEvents(eventsRes.data);
      setCommunityPosts(socialsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setIsError(true);
      Alert.alert("Error", "Failed to get data from the server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    getAllData();
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  // Recreating the card rendering functions for each list
  const renderClubCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{ uri: item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : "https://via.placeholder.com/180x100.png?text=Club" }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={[styles.cardText,{color:"green"}]}>{item.eventType === "Paid" ? `₹${item.ticketPrice}` : "Free"}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{ uri: item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : "https://via.placeholder.com/180x100.png?text=Event" }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.club?.name}</Text>
        <Text style={[styles.cardText,{color:"green"}]}>{item.eventType === "Paid" ? `₹${item.ticketPrice}` : "Free"}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSocialPost = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{ uri: item.image ? `https://techrush-backend.onrender.com${item.image}` : '../assets/images/club.webp' }
      
      }
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.author?.name}</Text>
        <Text style={styles.cardText} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded || isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorScreen onRetry={getAllData} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.sectionHeader}>Clubs</Text>
        <FlatList
          data={clubs}
          renderItem={renderClubCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
        />
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
        />
        <Text style={styles.sectionHeader}>Community Activity</Text>
        <FlatList
          data={communityPosts}
          renderItem={renderSocialPost}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Crafted with ❤️ in Pict</Text>
        </View>
      </ScrollView>

      {role === "Admin" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.navigate("/src/screens/Postform")}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {selectedItem && (
        <SocialModal
          visible={modalVisible}
          item={selectedItem}
          onClose={() => {
            setModalVisible(false);
            setSelectedItem(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20,
    backgroundColor: "#f0f2f5",
  },
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "red",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
  sectionHeader: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    marginLeft: 16,
    color: '#1c1e21',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  card: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 25,
    marginRight: 16,
    marginTop: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  cardText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: '#333333',
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingVertical: 50,
    width: "100%",
    height:200,
    justifyContent: "center",
    alignItems: 'center',
    },
    footerText: {
    fontFamily: "Poppins-Regular",
    color: "#999",
    fontSize: 14,
    },
});