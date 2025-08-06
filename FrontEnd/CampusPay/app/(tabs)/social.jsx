import { useEffect,useState } from "react";
import { SafeAreaView, Text, View, StyleSheet,FlatList, ScrollView,Image } from "react-native";
import { useFonts } from 'expo-font';
import colors from "../assets/utils/colors";

import { Ionicons } from '@expo/vector-icons';
import { RefreshControl } from "react-native";
export default function Social() {



  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

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
  
  const onRefresh = async () => {
    setRefreshing(true);
   

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
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

  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} 
    
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[colors.white]} 
        progressBackgroundColor={colors.primary}
      />}
    >
    <View style={styles.container}>
    
    <View>  <Text style={styles.heading}>Clubs And Events</Text>
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
      </View> <View>  <Text style={styles.heading}>Campus OLX</Text>
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
      </View> <View>  <Text style={styles.heading}>Canteen</Text>
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

    </View>  <View style={{height:315, width:"100%", flex:1, backgroundColor:colors.white, padding:24, }}> 
      <Text style={{fontFamily:"Poppins-Bold", color:colors.text, fontSize:30}}>" Made With</Text>
      <Ionicons name="heart" size={70} color="red"  style={{alignSelf:"center",margin:10}}/>

      <Text style={{fontFamily:"Poppins-Bold", color:colors.background, fontSize:30, textAlign:"right"}}>In PICT "</Text>

      </View></ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    padding: 16,
   
    backgroundColor: '#f5f5f5',
    flex: 1,
    borderEndEndRadius:22,
    borderEndEndRadius:22,
    borderBottomLeftRadius:22,

  },
  heading: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
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
    elevation: 5,
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