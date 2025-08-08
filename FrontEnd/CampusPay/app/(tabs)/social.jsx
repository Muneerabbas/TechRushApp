import { useEffect, useState, useCallback } from "react";
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
} from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SectionList } from "react-native";

import colors from "../assets/utils/colors";
import SocialModal from "../components/SocialModal";

const axiosInstance = axios.create({
  baseURL: "https://techrush-backend.onrender.com/api",
});

const BasicLoader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loaderText}>Loading Content...</Text>
  </View>
);

const ErrorState = ({ onRetry }) => (
  <View style={styles.loaderContainer}>
    <Ionicons name="cloud-offline-outline" size={60} color="#888" />
    <Text style={styles.errorText}>Couldn't load content</Text>
    <Text style={styles.errorSubtext}>Please check your connection and try again.</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

export default function Social() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState("");
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const userRole = await AsyncStorage.getItem("role");

      const [clubsRes, eventsRes, socialsRes] = await Promise.all([
        axiosInstance.get("/clubs"),
        axiosInstance.get("/events"),
        axiosInstance.get("/social/community"),
      ]);

      const newSections = [
        {
          title: "Clubs",
          data: clubsRes.data,
          renderCard: renderClubCard,
        },
        {
          title: "Upcoming Events",
          data: eventsRes.data,
          renderCard: renderEventCard,
        },
        {
          title: "Community Activity",
          data: socialsRes.data,
          renderCard: renderSocialCard,
        },
      ].filter(section => section.data && section.data.length > 0);

      setSections(newSections);
      setRole(userRole);
    } catch (err) {
      setError(err);
      console.error("Error fetching data:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  const renderClubCard = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{ uri: item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : "https://via.placeholder.com/180x100.png?text=Club" }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardInfo}>Type: {item.membershipType}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const renderEventCard = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{ uri: item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : "https://via.placeholder.com/180x100.png?text=Event" }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.club?.name}</Text>
        <Text style={styles.cardPrice}>
          {item.eventType === "Paid" ? `₹${item.ticketPrice}` : "Free"}
        </Text>
      </View>
    </TouchableOpacity>
  ), []);

  const renderSocialCard = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image
        source={{ uri: item.image ? `https://techrush-backend.onrender.com${item.image}` : "https://via.placeholder.com/180x100.png?text=Post" }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.author?.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const renderSection = ({ section }) => {
    if (!section.data || section.data.length === 0) {
      return null;
    }
    return (
      <FlatList
        data={section.data}
        renderItem={section.renderCard}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    );
  };
  
  if (!fontsLoaded || isLoading) {
    return <BasicLoader />;
  }
  
  if (error && !refreshing) {
      return <ErrorState onRetry={fetchData} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item._id + index}
        renderItem={renderSection}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.heading}>{title}</Text>
        )}
        ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.footerText}>Made with ❤️ in Pune</Text>
            </View>
        }
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

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
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  heading: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginBottom: 12,
    marginTop: 20,
    marginLeft: 16,
    color: '#1c1e21'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginRight: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: "100%",
    height: 100,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    padding: 12,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 2,
  },
   cardDescription: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginTop: 4,
  },
  cardInfo: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: colors.primary,
    marginTop: 8,
  },
  cardPrice: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    color: "#2e7d32",
    marginTop: 8,
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
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    padding: 20,
  },
  loaderText: {
    marginTop: 10, 
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#555'
  },
  errorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#444',
    marginTop: 16,
    textAlign: 'center'
  },
  errorSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 24,
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16
  },
});