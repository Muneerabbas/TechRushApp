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
        return { name: 'people-circle', color: colors.primary };
      case 'Payment':
      case 'PaymentSettled':
        return { name: 'wallet', color: '#16A34A' };
      case 'Event':
        return { name: 'calendar', color: '#DC2626' };
      case 'Club':
        return { name: 'shield-checkmark', color: '#D97706' };
      default:
        return { name: 'notifications', color: '#4B5563' };
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'just now';
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    return `${Math.floor(interval)}m ago`;
  };

  const icon = getIconForType(item.type);

  return (
    <View style={styles.notificationItem}>
      <View style={[styles.iconContainer, { backgroundColor: `${icon.color}1A` }]}>
        <Ionicons name={icon.name} size={26} color={icon.color} />
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
    <View style={styles.listHeaderContainer}>
        <Ionicons name="notifications-circle" size={72} color={colors.primary} />
        <Text style={styles.listHeaderText}>Your Activity Feed</Text>
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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Ionicons name="notifications-off-circle-outline" size={60} color="#CBD5E1" />
                <Text style={styles.centeredMessageText}>No new notifications yet.</Text>
            </View>
        </ScrollView>
      );
    }
    return (
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
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
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,

    fontFamily: 'Poppins-Bold',
    color: '#111827',
  },
  listHeaderContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  listHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#4B5563',
    marginTop: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffefaff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 22,
  },
  timeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#6B7281',
    marginTop: 4,
  },
  centeredMessage: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centeredMessageText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  }
});