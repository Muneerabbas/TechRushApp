import { Text, View, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import colors from './assets/utils/colors';

export default function Startup() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null; 
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Text style={styles.heading}>Welcome To{'\n'}Campus Pay</Text>

      <View style={styles.main}>
        <Image
          source={require('./assets/images/finance-payment-security.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.noaccountText}>
        A go-to financial and utility companion for every college student in India — saving time, reducing paperwork, and creating smarter campuses.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/signup')}>
        <Text style={styles.logintxt}>Get Started!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
  },
  heading: {
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  main: {
    width: '100%',
    marginTop: 50,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: '100%',
  },
  noaccountText: {
    fontFamily: 'Poppins-Regular',
    color: colors.black,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  button: {
    width: '50%',
    height: 50,
    borderRadius: 22,
    alignSelf: 'center',
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  logintxt: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.black,
  },
});
