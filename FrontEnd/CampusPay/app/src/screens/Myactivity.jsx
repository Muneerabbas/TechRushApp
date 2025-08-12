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
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/utils/colors";
import { SocialModal } from "../../(tabs)/components/social/SocialModal";
import { EventModal } from "../../(tabs)/components/social/EventModal";
import { ClubModal } from "../../(tabs)/components/social/ClubModal";
import { getMyContent } from "../../(tabs)/services/apiService";

const FallbackImage = ({ uri, style, type }) => {
  const [hasError, setHasError] = useState(!uri);

  const getDefaultImage = () => {
    switch (type) {
      case 'event':
        return require('../../assets/images/event.png');
      case 'social':
        return require('../../assets/images/social.png');
      case 'club':
      default:
        return require('../../assets/images/club.png');
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
    <Text style={styles.loadingText}>Loading Your Activity...</Text>
  </View>
);

const ErrorScreen = ({ onRetry }) => (
  <View style={styles.centerScreen}>
    <Text style={styles.errorText}>Could not load your activity.</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const EmptyState = ({ message }) => (
    <View style={styles.emptyContainer}>
        <Ionicons name="cloud-offline-outline" size={40} color="#A0AEC0" />
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

export default function MyActivity() {
  const [clubSelectedItem, setClubSelectedItem] = useState(null);
  const [isClubModalVisible, setClubModalVisible] = useState(false);
  const [eventSelectedItem, setEventSelectedItem] = useState(null);
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [socialSelectedItem, setSocialSelectedItem] = useState(null);
  const [isSocialModalVisible, setSocialModalVisible] = useState(false);
  
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const fetchData = useCallback(async () => {
    setIsError(false);
    if (!isRefreshing) setIsLoading(true);
    try {
      const { clubs, events, posts } = await getMyContent();
      setMyClubs(clubs);
      setMyEvents(events);
      setMyPosts(posts);
    } catch (err) {
      console.error("Error fetching my content:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
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

  const handleActionSuccess = () => {
    fetchData();
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
        <Text style={styles.cardText} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded || isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorScreen onRetry={fetchData} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Activity</Text>
          <View style={{width: 44}} />
      </View>
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
        <View style={styles.contentArea}>
            <Text style={styles.sectionHeader}>My Clubs</Text>
            {myClubs.length > 0 ? (
                <FlatList
                    data={myClubs}
                    renderItem={renderClubCard}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listPadding}
                />
            ) : <EmptyState message="You haven't joined any clubs yet." />}

            <Text style={styles.sectionHeader}>My Events</Text>
            {myEvents.length > 0 ? (
                <FlatList
                    data={myEvents}
                    renderItem={renderEventCard}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listPadding}
                />
            ) : <EmptyState message="You aren't registered for any events." />}

            <Text style={styles.sectionHeader}>My Posts</Text>
            {myPosts.length > 0 ? (
                <FlatList
                    data={myPosts}
                    renderItem={renderSocialPost}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listPadding}
                />
            ) : <EmptyState message="You haven't posted anything yet." />}
        </View>
      </ScrollView>

      <ClubModal
        visible={isClubModalVisible}
        item={clubSelectedItem}
        onClose={() => setClubModalVisible(false)}
        onJoinSuccess={handleActionSuccess}
      />

      <EventModal
        visible={isEventModalVisible}
        item={eventSelectedItem}
        onClose={() => setEventModalVisible(false)}
        onRegistrationSuccess={handleActionSuccess}
      />

      <SocialModal
        visible={isSocialModalVisible}
        item={socialSelectedItem}
        onClose={() => setSocialModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F7FF',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1A202C',
  },
  contentArea: {
    paddingTop: 10,
  },
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
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
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 16,
    color: '#2c3e50',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 16,
    elevation: 4,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: "100%",
    height: 110,
    backgroundColor: '#e9e9e9',
  },
  cardBody: {
    padding: 14,
    minHeight: 70,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  cardText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: '#555',
    marginTop: 4,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#A0AEC0',
    marginTop: 10,
  }
});
