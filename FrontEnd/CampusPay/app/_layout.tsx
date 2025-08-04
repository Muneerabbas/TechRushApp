// app.jsx or _layout.js
import { Slot, useRouter } from 'expo-router';
import { AuthContext, AuthProvider } from '../state/AuthContext';
import { useContext, useEffect } from 'react';

function AppLayout() {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (token) {
      router.replace('/(tabs)');
    } else {
      router.replace('/startup');
    }
  }, [token, isLoading]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
