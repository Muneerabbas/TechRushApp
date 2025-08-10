import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../assets/utils/colors';
import { useRouter } from 'expo-router';

export const Header = ({ name, role, onReload }) => {
  const router = useRouter();
  const greetingName = role === 'Admin' ? 'Admin' : name || 'Buddy!';

  return (
    <ImageBackground
      source={require('../../../assets/images/college.png')}
      style={styles.header}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.replace("/src/screens/profile")}
          >
            <Ionicons name="person-outline" size={25} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onReload} style={styles.reloadBtn}>
            <Ionicons name="reload-circle-outline" size={32} color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
            Hello,{"\n"}
            {greetingName}
            </Text>
            <Image source={require('../../../assets/images/student.png')} style={styles.studentImage} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 250, // Increased height
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Dark overlay for better text visibility
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileBtn: {
    backgroundColor: colors.secondary,
    height: 45,
    width: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
  },
  reloadBtn: {
    padding: 5,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  greetingText: {
    fontSize: 35,
    color: colors.white,
    fontFamily: "Poppins-Bold",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  studentImage: {
    width: 100,
    height: 140,
    resizeMode: 'contain',
    marginBottom: -25, // Position it to overlap slightly with the content below
  }
});
