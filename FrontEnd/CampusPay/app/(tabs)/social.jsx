import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios"; // Make sure to import axios
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../assets/utils/colors";
import SocialModal from "../components/SocialModal";

// --- Best Practice: Create an Axios instance with a base URL ---
const axiosInstance = axios.create({
  baseURL: "https://techrush-backend.onrender.com/api", // Set the base URL for all API requests
});

export default function Social() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState("");
  const [clubs, setClubs] = useState([]);
  const [socials, setSocials] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  // --- Setup Axios interceptor to add the auth token to every request ---
  useEffect(() => {
    const setAuthToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    };
    setAuthToken();
  }, []);

  const fetchData = async () => {
    try {
      const userRole = await AsyncStorage.getItem("role");

      // --- FIX: Use correct API endpoints and Promise.all for parallel fetching ---
      const [clubsRes, socialsRes, eventsRes] = await Promise.all([
        axiosInstance.get("/clubs"), // Corrected endpoint
        axiosInstance.get("/social/community"), // Corrected endpoint for socials
        axiosInstance.get("/events"), // Corrected endpoint
      ]);

      setClubs(clubsRes.data || []);
      setSocials(socialsRes.data || []);
      setEvents(eventsRes.data || []);
      setRole(userRole);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      // Optional: Add user-friendly error handling (e.g., a toast message)
    } finally {
      setLoading(false);
      setRefreshing(false); // Ensure refreshing is turned off
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(); // No need to wrap in an async function here
  };

  // --- UI IMPROVEMENT: Helper function for opening the modal ---
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  // --- UI IMPROVEMENT: A component to show when a list is empty ---
  const EmptyListComponent = ({ message }) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  // --- REFACTOR: Create separate render functions for each card type for clarity and maintainability ---
  const renderClubCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{
          uri: item.coverImage
            ? `https://techrush-backend.onrender.com${item.coverImage}`
            : "https://via.placeholder.com/160x90.png?text=Club",
        }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.cardInfo}>Type: {item.membershipType}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{
          uri: item.coverImage
            ? `https://techrush-backend.onrender.com${item.coverImage}`
            : "https://via.placeholder.com/160x90.png?text=Event",
        }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>Organized by: {item.club?.name}</Text>
        <Text style={styles.cardPrice}>
          {item.eventType === "Paid" ? `₹${item.ticketPrice}` : "Free"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSocialCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{
          uri: item.image // 'social' posts use 'image' field according to backend
            ? `https://techrush-backend.onrender.com${item.image}`
            : "https://via.placeholder.com/160x90.png?text=Post",
        }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.author?.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={3}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );


  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, fontFamily: "Poppins-SemiBold" }}>Loading content...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.container}>
          {/* Clubs Section */}
          <Text style={styles.heading}>Clubs</Text>
          <FlatList
            data={clubs}
            keyExtractor={(item) => item._id}
            renderItem={renderClubCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<EmptyListComponent message="No clubs available right now." />}
          />

          {/* Events Section */}
          <Text style={styles.heading}>Upcoming Events</Text>
          <FlatList
            data={events}
            keyExtractor={(item) => item._id}
            renderItem={renderEventCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<EmptyListComponent message="No events scheduled." />}
          />

          {/* Socials Section */}
          <Text style={styles.heading}>Community Activity</Text>
          <FlatList
            data={socials}
            keyExtractor={(item) => item._id}
            renderItem={renderSocialCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<EmptyListComponent message="No community posts yet." />}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in PICT</Text>
        </View>
      </ScrollView>

      {/* FAB for Admin */}
      {role === "Admin" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.navigate("/src/screens/Postform")}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Modal rendered once */}
      {selectedItem && (
        <SocialModal
          visible={modalVisible}
          item={selectedItem} // Use a generic 'item' prop for reusability
          onClose={() => {
            setModalVisible(false);
            setSelectedItem(null); // Clear selection on close
          }}
        />
      )}
    </View>
  );
}

// --- UI IMPROVEMENT: Updated and cleaned up styles ---
const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 0, // Padding will be on the list content
    backgroundColor: "#f5f5f5",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    marginLeft: 16, // Add left margin to align with cards
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    width: 170,
    height: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    overflow: 'hidden', // Ensures content respects border radius
  },
  image: {
    width: "100%",
    height: 110,
    backgroundColor: '#e0e0e0', // Placeholder color
  },
  cardContent: {
    padding: 10,
    flex: 1, // Allows content to fill remaining space
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
   cardSubtitle: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
    color: "#555",
    flex: 1, // Take up available space
  },
  cardInfo: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.primary,
    marginTop: 8,
  },
  cardPrice: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#2e7d32",
    marginTop: 8,
  },
  footer: {
    paddingVertical: 40,
    width: "100%",
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: 'center',
  },
  footerText: {
    fontFamily: "Poppins-SemiBold",
    color: "#888",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 100, // Adjusted position
    right: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  emptyContainer: {
    width: 250, // Give it a width to be visible in the horizontal list
    height: 240, // Match card height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 10,
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  }
});