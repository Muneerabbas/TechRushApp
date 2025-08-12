import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
  AppState,
  Linking,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import PaymentModal from "./../../components/PaymentModal";

export default function Scanner() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState({ userId: null, name: '' });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleScan = (scannedData) => {
    if (qrLock.current) return;
    qrLock.current = true;
    
    try {
        if (scannedData && scannedData.startsWith('CampusPay://pay?')) {
            const url = new URL(scannedData);
            const userId = url.searchParams.get('userId');
            const name = url.searchParams.get('name');

            if (userId && name) {
                setPaymentData({ userId, name: decodeURIComponent(name) });
                setPaymentModalVisible(true);
            } else {
                Alert.alert("Invalid QR Code", "The payment QR code is missing required information.");
            }
        } else {
            Linking.openURL(scannedData).catch(() => {
                Alert.alert("Unsupported QR Code", "This QR code does not contain a valid web link or payment request.");
            });
        }
    } catch (e) {
        Alert.alert("Invalid QR Code", "Could not read the data from this QR code.");
    } finally {
        setTimeout(() => { qrLock.current = false; }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => handleScan(data)}
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
        <Ionicons name="scan" size={250} color="white" />
      </View>
      
      {paymentModalVisible && (
          <PaymentModal
            data={() => setPaymentModalVisible(false)}
            Payto={paymentData.name}
            receiverid={paymentData.userId}
          />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
});