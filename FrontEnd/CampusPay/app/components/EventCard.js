import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/utils/colors";

export default function EventCard({ event }) {
  const {
    title,
    description,
    date,
    eventType,
    ticketPrice,
    coverImage,
    club,
    location,
  } = event;

  const displayDate = new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View style={styles.card}>
      {coverImage ? (
        <Image
          source={{ uri: "https://your-cloudflare-base-url.com" + coverImage }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={48} color="#bbb" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.club}>Organized by: {club?.name}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.metaText}> {displayDate}</Text>
        </View>

        {location && (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.metaText}> {location}</Text>
          </View>
        )}

        <Text style={styles.desc} numberOfLines={4}>
          {description}
        </Text>

        <View style={styles.badgeContainer}>
          <Text
            style={[
              styles.badge,
              {
                backgroundColor: eventType === "Free" ? "#DFF7E2" : "#FFE5E5",
              },
            ]}
          >
            {eventType === "Free" ? "Free Entry" : `₹${ticketPrice} Ticket`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    overflow: "hidden",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#eee",
  },
  placeholder: {
    width: "100%",
    height: 220,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: colors.black,
    marginBottom: 10,
  },
  club: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#666",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metaText: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#555",
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    fontFamily: "Poppins-Regular",
    marginTop: 14,
  },
  badgeContainer: {
    marginTop: 20,
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
});
