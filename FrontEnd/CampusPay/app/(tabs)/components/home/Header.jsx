import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import colors from '../../../assets/utils/colors';
import { useRouter } from 'expo-router';

export const Header = ({ name, role }) => {
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
            style={styles.iconButton}
            onPress={() => router.push("../../../src/screens/profile")}
          >
            <Image source={require('../../../assets/images/profile.webp')} style={styles.iconImage} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('../../../src/screens/notifications')}
          >
            <Image source={require('../../../assets/images/notification.webp')} style={styles.iconImage} />
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
    height: 280, 
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  iconImage: {
      width: 41,
      height: 41,
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
    marginBottom: -25,
  }
});
