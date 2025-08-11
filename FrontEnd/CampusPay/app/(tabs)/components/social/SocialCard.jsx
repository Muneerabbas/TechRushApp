import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../../../assets/utils/colors';

const FallbackImage = ({ uri, type, style }) => {
    const [hasError, setHasError] = useState(!uri);

    const getDefaultImage = () => {
      switch (type) {
        case "event":
          return require("../../../assets/images/event.png");
        case "social":
          return require("../../../assets/images/social.png");
        case "club":
        default:
          return require("../../../assets/images/club.webp");
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


export const SocialCard = ({ data, type, onCardPress }) => {
  const renderClubCard = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onCardPress(item)}>
      <FallbackImage
        uri={item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : null}
        style={styles.image}
        type="club"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardInfo}>Type: {item.membershipType}</Text>
      </View>
    </TouchableOpacity>
  ), [onCardPress]);

  const renderEventCard = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onCardPress(item)}>
      <FallbackImage
        uri={item.coverImage ? `https://techrush-backend.onrender.com${item.coverImage}` : null}
        style={styles.image}
        type="event"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.club?.name}</Text>
        <Text style={styles.cardPrice}>{item.eventType === "Paid" ? `₹${item.ticketPrice}` : "Free"}</Text>
      </View>
    </TouchableOpacity>
  ), [onCardPress]);

  const renderSocialCard = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onCardPress(item)}>
      <FallbackImage
        uri={item.image ? `https://techrush-backend.onrender.com${item.image}` : null}
        style={styles.image}
        type="social"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.author?.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  ), [onCardPress]);

  const renderItem = type === 'club' ? renderClubCard : type === 'event' ? renderEventCard : renderSocialCard;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 16, paddingVertical: 10 },
  card: {
    width: 180, 
    backgroundColor: "#fff", 
    borderRadius: 18, 
    marginRight: 16,
    elevation: 4, 
    shadowColor: "#000", 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 }, 
    shadowRadius: 12, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  image: { 
    width: "100%", 
    height: 100, 
    backgroundColor: '#e9e9e9' 
  },
  cardContent: { 
    padding: 12, 
    minHeight: 100, 
    justifyContent: 'space-between' 
  },
  cardTitle: { 
    fontSize: 15, 
    fontFamily: "Poppins-SemiBold", 
    color: "#333" 
  },
  cardSubtitle: { 
    fontSize: 12, 
    fontFamily: "Poppins-Regular", 
    color: "#666", 
    marginTop: 2 
  },
  cardDescription: { 
    fontSize: 13, 
    fontFamily: "Poppins-Regular", 
    color: "#555", 
    marginTop: 4 
  },
  cardInfo: { 
    fontSize: 13, 
    fontFamily: "Poppins-SemiBold", 
    color: colors.primary, 
    marginTop: 8 
  },
  cardPrice: { 
    fontSize: 15, 
    fontFamily: "Poppins-Bold", 
    color: "#2e7d32", 
    marginTop: 8 
  },
});
