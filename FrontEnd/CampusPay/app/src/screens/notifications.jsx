import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/utils/colors';
import { getNotifications } from '../../(tabs)/services/apiService';
import { useFonts } from 'expo-font';

const NotificationItem = ({ item }) => {
  const getIconForType = (type) => {
    switch (type) {
      case 'Group':
      case 'PaymentRequest':
        return { name: 'people-circle-outline', color: colors.primary };
      case 'Payment':
      case 'PaymentSettled':
        return { name: 'wallet-outline', color: '#16A34A' };
      case 'Event':
        return { name: 'calendar-outline', color: '#DC2626' };
      case 'Club':
        return { name: 'shield-checkmark-outline', color: '#D97706' };
      default:
        return { name: 'notifications-outline', color: '#555' };
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
  };

  const icon = getIconForType(item.type);

  return (
    <View style={styles.notificationItem}>
      <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
        <Ionicons name={icon.name} size={24} color={icon.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timeText}>{formatTimeAgo(item.createdAt)}</Text>
      </View>
    </View>
  );
};

export default function NotificationsScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('loading');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!refreshing) setStatus('loading');
    try {
      const data = await getNotifications();
      setNotifications(data || []);
      setStatus(data && data.length > 0 ? 'success' : 'empty');
    } catch (error) {
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
  };

  const ListHeader = () => (
    <View style={styles.iconHeader}>
        <Ionicons name="notifications-circle" size={80} color={colors.primary} />
        <Text style={styles.iconHeaderText}>Your Activity</Text>
    </View>
  );

  const renderContent = () => {
    if (status === 'loading' && !refreshing) {
      return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;
    }
    if (status === 'error') {
      return <View style={styles.centeredMessage}><Text style={styles.centeredMessageText}>Failed to load notifications.</Text></View>;
    }
    if (status === 'empty') {
      return (
        <ScrollView
          contentContainerStyle={styles.centeredMessage}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
            <ListHeader />
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                <Text style={styles.centeredMessageText}>You have no new notifications.</Text>
            </View>
        </ScrollView>
      );
    }
    return (
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 15 }}
        ListHeaderComponent={ListHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      />
    );
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary + '0A' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
    backgroundColor: colors.white,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: colors.text, marginLeft: 15 },
  iconHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  iconHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 5,
  },
  notificationItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.secondary + '1A',
    borderRadius: 15, 
    padding: 15, 
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  iconContainer: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  textContainer: { flex: 1 },
  messageText: {
    fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.text,
    lineHeight: 20,
  },
  timeText: {
    fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.textSecondary,
    marginTop: 4,
  },
  centeredMessage: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  centeredMessageText: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
      color: '#aaa',
      marginTop: 15,
  }
});
