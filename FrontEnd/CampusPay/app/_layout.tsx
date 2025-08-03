import { Stack, useRouter, Slot } from 'expo-router';
import { AuthProvider, AuthContext } from '../state/AuthContext';
import { useContext, useEffect } from 'react';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

function AppLayout() {
    const { token, isLoading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; 

        if (token) {
            router.replace('/(tabs)');
        } else if (!token) {
            router.replace('/startup');
        }
    }, [token, isLoading]);

    return <Slot />;
  }
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
