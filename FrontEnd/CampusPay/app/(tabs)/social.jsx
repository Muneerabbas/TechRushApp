// app/(tabs)/socials.jsx (Social Feed)
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, Text, View, StyleSheet, SectionList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import colors from "../assets/utils/colors";
import { getSocialFeed } from "./services/apiService";
import { SocialCard } from "./components/social/SocialCard";
import { SocialModal } from "./components/social/SocialModal";

const BasicLoader = () => <View style={styles.loaderContainer}><ActivityIndicator size="large" color={colors.primary} /></View>;
const ErrorState = ({ onRetry }) => (
    <View style={styles.loaderContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color="#888" />
        <Text style={styles.errorText}>Couldn't load content</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}><Text style={styles.retryButtonText}>Retry</Text></TouchableOpacity>
    </View>
);

export default function SocialScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!refreshing) setStatus('loading');
    try {
      const { clubs, events, socials } = await getSocialFeed();
      const userRole = await AsyncStorage.getItem("role");
      
      const newSections = [
        { title: "Clubs", data: [clubs], type: 'club' },
        { title: "Upcoming Events", data: [events], type: 'event' },
        { title: "Community Activity", data: [socials], type: 'social' },
      ].filter(section => section.data[0] && section.data[0].length > 0);

      setSections(newSections);
      setRole(userRole);
      setStatus('success');
    } catch (err) {
      console.error("Error fetching social feed:", err);
      setStatus('error');
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (!fontsLoaded || (status === 'loading' && !refreshing)) {
    return <BasicLoader />;
  }
  
  if (status === 'error' && !refreshing) {
    return <ErrorState onRetry={fetchData} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item, section }) => (
          <SocialCard data={item} type={section.type} onCardPress={setSelectedItem} />
        )}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.heading}>{title}</Text>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      />
      {role === "Admin" && (
        <TouchableOpacity style={styles.fab} onPress={() => router.navigate("/src/screens/Postform")}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
      {selectedItem && (
        <SocialModal visible={!!selectedItem} item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f2f5" },
  heading: { fontSize: 22, fontFamily: "Poppins-Bold", marginBottom: 12, marginTop: 20, marginLeft: 16, color: '#1c1e21' },
  fab: { position: "absolute", bottom: 100, right: 20, backgroundColor: colors.primary, width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", elevation: 8 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f2f5" },
  errorText: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#444', marginTop: 16 },
  retryButton: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30, marginTop: 24 },
  retryButtonText: { color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
});