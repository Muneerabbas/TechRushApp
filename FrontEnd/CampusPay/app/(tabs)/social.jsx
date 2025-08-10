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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import  FooterComponent  from "../components/Footer";
import colors from "../assets/utils/colors";
import {SocialModal} from "./components/social/SocialModal";
import {EventModal} from "./components/social/EventModal";
import {ClubModal} from "../(tabs)/components/social/ClubModal";

import { getSocialFeed } from "./services/apiService";

const FallbackImage = ({ uri, style, type }) => {
  const [hasError, setHasError] = useState(!uri);

  const getDefaultImage = () => {
    switch (type) {
      case 'event':
        return require('../assets/images/event.png');
      case 'social':
        return require('../assets/images/social.png');
      case 'club':
      default:
        return require('../assets/images/club.png');
    }
  };

  return (
    <Image
      source={hasError ? getDefaultImage() : { uri }}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

const LoadingScreen = () => (
  <View style={styles.centerScreen}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Loading Feed...</Text>
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
  const [ClubselectedItem, setClubSelectedItem] = useState(null);
  const [ClubmodalVisible, setClubModalVisible] = useState(false);
  const [EventselectedItem, setEventSelectedItem] = useState(null);
  const [EventmodalVisible, setEventModalVisible] = useState(false);
  const [SocialselectedItem, setSocialSelectedItem] = useState(null);
  const [SocialmodalVisible, setSocialModalVisible] = useState(false);
  const [role, setRole] = useState("");
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
      const { clubs, events, socials } = await getSocialFeed();
      const userRole = await AsyncStorage.getItem("role");

      setClubs(clubs);
      setEvents(events);
      setCommunityPosts(socials);
      setRole(userRole);
    } catch (err) {
      console.error("Error fetching data:", err);
      setIsError(true);
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

  const openClubModal = (item) => {
    setClubSelectedItem(item);
    setClubModalVisible(true);
  };
  
  const openEventModal = (item) => {
    setEventSelectedItem(item);
    setEventModalVisible(true);
  };
  const openSocialModal = (item) => {
    setSocialSelectedItem(item);
    setSocialModalVisible(true);
  };
  const renderClubCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openClubModal(item)}>
      <FallbackImage
        uri={item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : null}
        style={styles.cardImage}
        type="club"
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardPrice}>{item.eventType}</Text>
        {

item.ticketPrice==0?null:<Text style={styles.cardPrice}>₹{item.ticketPrice}</Text>

        }

      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openEventModal(item)}>
      <FallbackImage
        uri={item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : null}
        style={styles.cardImage}
        type="event"
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardPrice}>{item.eventType === "Paid" ? `₹${item.ticketPrice}` : "Free"}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSocialPost = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openSocialModal(item)}>
      <FallbackImage
        uri={item.image ? `https://techrush-backend.onrender.com${item.image}` : null}
        style={styles.cardImage}
        type="social"
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
        showsVerticalScrollIndicator={false}
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
      <FooterComponent/>
      </ScrollView>

      {role === "Admin" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.navigate("/src/screens/Postform")}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {ClubselectedItem && (
        <ClubModal
          visible={ClubmodalVisible}
          item={ClubselectedItem}
          onClose={() => {
            setClubModalVisible(false);
            setClubSelectedItem(null);
          }}
        />
      )}


{EventselectedItem && (
        <EventModal
          visible={EventmodalVisible}
          item={EventselectedItem}
          onClose={() => {
            setEventModalVisible(false);
            setEventSelectedItem(null);
          }}
        />
      )}


{SocialselectedItem && (
        <SocialModal
          visible={SocialmodalVisible}
          item={SocialselectedItem}
          onClose={() => {
            setSocialModalVisible(false);
            setSocialSelectedItem(null);
          }}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f0f2f5",
  },
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
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
    color: "#444",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    marginBottom: 10,
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
    borderRadius: 18,
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: "100%",
    height: 100,
    backgroundColor: '#e9e9e9',
  },
  cardBody: {
    padding: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  cardText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: '#555',
    marginTop: 4,
  },
  cardInfo: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: colors.primary,
    marginTop: 5,
  },
  cardPrice: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#2E7D32",
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
    elevation: 8,
  },
 
});