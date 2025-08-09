import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import PaymentModal from "../components/PaymentModal";
import colors from "../assets/utils/colors"; 
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import axios from "axios";

export default function index() {
  const router = useRouter();
  const [name, setName] = useState();
  const [payModal, setPayModal] = useState(false);
  const [payTo, setPayTo] = useState("");
  const [splitAmount, setSplitAmount] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noUser, setNoUser] = useState(true);
  const [selectedUserID, setSelectedUserID] = useState("");

  async function getUsername() {
    const username = await AsyncStorage.getItem("name");
    setName(username);
  }

  const getReceiver = async (queryText) => {
    if (!queryText.trim()) {
      setUsers([]);
      setNoUser(false);
      return;
    }

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      const res = await axios.get(
        `https://techrush-backend.onrender.com/api/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            query: queryText,
          },
        }
      );

      const userList = res.data.users;
      setUsers(userList);
      setNoUser(userList.length === 0);
    } catch (error) {
      console.error("Fetch error:", error);
      setNoUser(true);
    } finally {
      setIsLoading(false);
    }
  };

  const payment = (selectedUser) => {
    setPayTo(selectedUser.name);
    setSelectedUserID(selectedUser._id);
    setPayModal(true);
  };

  useEffect(() => {
    getUsername();
  }, []);

  const [fontsLoaded] = Font.useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  return (
    <KeyboardAvoidingView
      style={styles.container} // Apply styles.container here
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          {name ? (
            <Text style={styles.greetingText}>
              Hello,{"\n"}
              {name}
            </Text>
          ) : (
            <Text style={styles.greetingText}>
              Hello,{"\n"}Buddy!
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.replace("/src/screens/profile")}
        >
          <Ionicons name="person-outline" size={25} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      
      <View style={styles.mainContentArea}> {/* New View to contain main content */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.actionsContainer}>
            {/* Quick Actions (e.g., Scan) */}
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => console.log("Scan Pressed")}
            >
              <Ionicons name="qr-code-outline" size={35} color={colors.white} />
              <Text style={styles.scanButtonText}>Scan to Pay</Text>
            </TouchableOpacity>

            <View style={styles.paySection}>
              <Text style={styles.payHeader}>Pay Someone</Text>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" />
                <TextInput
                  placeholder="Find a user to pay"
                  value={payTo}
                  onChangeText={(text) => {
                    setPayTo(text);
                    getReceiver(text);
                  }}
                  style={styles.searchInput}
                  placeholderTextColor="#aaa"
                />
              </View>

              {/* User Search Results */}
              {payTo ? (
                <View style={styles.searchResults}>
                  {users.map((user) => (
                    <TouchableOpacity
                      key={user._id}
                      onPress={() => payment(user)}
                      style={styles.userResultItem}
                    >
                      <Text style={styles.userResultText}>
                        {user.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.splitSection}>
              <Text style={styles.splitHeader}>Split a Payment</Text>
              <View style={styles.splitInputContainer}>
                <TextInput
                  placeholder="Enter Amount to Split"
                  value={splitAmount}
                  onChangeText={setSplitAmount}
                  keyboardType="numeric"
                  style={styles.splitInput}
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity
                  style={[
                    styles.splitButton,
                    !splitAmount.trim() && styles.splitButtonDisabled,
                  ]}
                  onPress={()=>{router.navigate('/src/screens/Split')}}
                  disabled={!splitAmount.trim()}
                >
                  <Text style={styles.splitButtonText}>Split</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {payModal && (
        <PaymentModal
          receiverid={selectedUserID}
          Payto={payTo}
          data={() => setPayModal(!payModal)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    backgroundColor: colors.primary,
  },
  greetingText: {
    fontSize: 35,
    color: colors.white,
    fontFamily: "Poppins-Bold",
  },
  profileBtn: {
    backgroundColor: colors.secondary,
    height: 45,
    width: 45,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContentArea: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  actionsContainer: {
    paddingTop: 30,
    paddingHorizontal: 25,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
  paySection: {
    marginBottom: 20,
  },
  payHeader: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  searchResults: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userResultText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#444",
  },
  splitSection: {
    marginTop: 20,
    backgroundColor: "#f8f8ff",
    borderRadius: 20,
    padding: 20,
  },
  splitHeader: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginBottom: 15,
  },
  splitInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingLeft: 15,
  },
  splitInput: {
    flex: 1,
    height: 50,

    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#333",
  },
  splitButton: {
    width: 100,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  splitButtonDisabled: {
    backgroundColor: "#a0c4ff",
  },
  splitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
});