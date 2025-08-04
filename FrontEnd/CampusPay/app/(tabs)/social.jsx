import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useFonts } from 'expo-font';
import colors from '../assets/utils/colors';
const socialPosts = [
  {
    _id: "68905cf28a2b9c05001d4192",
    content: "Hello can anyone imagine this. Its unimaginable",
    image: "/uploads/social-post-1754291442597.jpg",
    author: {
      _id: "688ba4eee59e01175b65f6f8",
      name: "Admin",
      profilePicture: "/uploads/user-1753982190589.png"
    },
    createdAt: "2025-08-04T07:10:42.601Z"
  }
];
const clubsData = [
  {
    _id: "688ba5cde59e01175b65f6fd",
    name: "The Innovators Hub",
    description: "A place for builders, creators, and entrepreneurs.",
    membershipType: "Free",
    coverImage: ""
  },
  {
    _id: "688c2e9d1a5c7267ead935df",
    name: "Premium Gamers Guild",
    description: "Access to high-end gaming setups and tournaments.",
    membershipType: "Free",
    coverImage: ""
  },
  {
    _id: "688c2ead1a5c7267ead935e3",
    name: "Premium Gamers Build",
    description: "Access to high-end gaming setups and tournaments.",
    membershipType: "Subscription",
    coverImage: "/uploads/club-cover-1754017453003.png"
  }
];

const eventData = [
  {
    _id: '1',
    title: 'Coding Meetup',
    description: 'Casual session to solve problems.',
    club: { name: 'Premium Gamers' },
    coverImage: '',
    ticketPrice: 0,
    eventType: 'Free',
  },
  {
    _id: '2',
    title: 'Hackathon',
    description: 'Build your team & win.',
    club: { name: 'CodeStorm' },
    coverImage: '',
    ticketPrice: 0,
    eventType: 'Free',
  },
  {
    _id: '3',
    title: 'Game Dev Talk',
    description: 'Learn Unity & Godot basics.',
    club: { name: 'PixelWorks' },
    coverImage: '',
    ticketPrice: 40,
    eventType: 'Paid',
  },
];

export default function Social() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://via.placeholder.com/160x100.png?text=Event',
          }}
          style={styles.image}
        />
        <Text style={styles.club}>{item.club.name}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>
          {item.eventType === 'Paid' ? `₹${item.ticketPrice}` : 'Free'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Campus Socials</Text>

      <Text style={styles.heading}>Campus Events</Text>
      <View style={styles.scrollSection}>
        <FlatList
          data={eventData}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#E5C54F',
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  scrollSection: {
    height: 210, 
  },
  listContent: {
    paddingRight: 16,
  },
  card: {
    width: 160,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 6,
  },
  club: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#555',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 2,
    color: '#000',
  },
  price: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#2e7d32',
    marginTop: 4,
  },
});
