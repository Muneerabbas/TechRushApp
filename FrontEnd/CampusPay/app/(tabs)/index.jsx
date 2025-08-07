import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Alert from "react-native";
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
  const [noUser, setnoUser] = useState(true);
  const [selectedUserID, setSelectedUserID] = useState("");

  async function getusername() {
    const username = await AsyncStorage.getItem("name");
    setName(username);
  }

  const getReceiver = async (queryText) => {
    if (!queryText.trim()) {
      setUsers([]);
      setnoUser(false);
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
      setnoUser(userList.length === 0);
    } catch (error) {
      console.error("Fetch error:", error);
      setnoUser(true);
    } finally {
      setIsLoading(false);
    }
  };

  const Payment = (selectedUser) => {
    setPayTo(selectedUser.name);
    setSelectedUserID(selectedUser._id);
    console.log(selectedUser);
    setPayModal(true);
  };

  useEffect(() => {
    getusername();
  }, []);

  const [fontsLoaded] = Font.useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View
            style={{
              width: "auto",
              backgroundColor: colors.primary,
              borderBottomEndRadius: 30,
              borderBottomLeftRadius: 30,
              padding: 15,
              paddingTop: 50,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              height: "30%",
            }}
          >
            <View>
              {name ? (
                <Text
                  style={{
                    fontSize: 35,
                    color: colors.white,
                    marginLeft: 10,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  Hello,{"\n"}
                  {name}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 35,
                    color: colors.white,
                    marginLeft: 10,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  Hello,{"\n"}Buddy!
                </Text>
              )}
            </View>
            <View
              style={{
                backgroundColor: colors.secondary,
                height: 45,
                width: 45,
                marginRight: 10,
                marginTop: 20,
                borderRadius: 50,
                alignItems: "center",
                alignSelf: "flex-start",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => router.replace("/src/screens/profile")}
              >
                <Ionicons name="person-outline" size={25} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 25,
              marginTop: 100,
              alignSelf: "center",
              width: "95%",
            }}
          >
            <View>
              <TouchableOpacity>
                <Ionicons
                  name="scan-circle-outline"
                  size={100}
                  color="white"
                  style={{
                    elevation: 4,
                    borderRadius: 100,
                    alignSelf: "center",
                    position: "absolute",
                    bottom: -40,
                    backgroundColor: colors.secondary,
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 30,
                  color: colors.white,
                  marginTop: 50,
                  marginLeft: 20,
                  textAlign: "center",
                  fontFamily: "Poppins-Bold",
                }}
              >
                Pay !
              </Text>

              <View
                style={[
                  styles.input,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "90%",
                    margin: 20,
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: colors.background,
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="cash-outline" size={15} color="white" />
                </View>

                <TextInput
                  placeholder="Paying Who ?"
                  value={payTo}
                  onChangeText={(text) => {
                    setPayTo(text);
                    getReceiver(text);
                  }}
                  style={{
                    marginHorizontal: 10,
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                  }}
                />
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 10,
                  }}
                >
                  <Ionicons name="search" size={20} color="black" />
                </View>
              </View>

              <ScrollView>
                {payTo
                  ? users.map((user) => (
                      <TouchableOpacity
                        key={user._id}
                        onPress={() => Payment(user)}
                        style={{
                          padding: 10,
                          backgroundColor: "#fff",
                          borderBottomWidth: 1,
                          borderColor: "#eee",
                          width: "90%",
                          alignSelf: "center",
                          borderRadius: 10,
                          marginTop: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 16,
                          }}
                        >
                          {user.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  : null}
              </ScrollView>
            </View>

            <View
              style={{
                marginTop: 20,
                backgroundColor: colors.primary,
                paddingBottom: 20,
                borderRadius: 25,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: colors.white,
                  marginTop: 20,
                  marginLeft: 20,
                  fontFamily: "Poppins-Bold",
                }}
              >
                Make The Group!
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  backgroundColor: colors.primary,
                  padding: 10,
                  borderRadius: 20,
                }}
              >
                <View style={[styles.input, { flexDirection: "row" }]}>
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      height: 30,
                      width: 30,
                      marginTop: 10,
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="people-outline" size={15} color="white" />
                  </View>
                  <TextInput
                    placeholder="Enter Amount To Split"
                    value={splitAmount}
                    onChangeText={setSplitAmount}
                    keyboardType="numeric"
                    style={{
                      marginHorizontal: 10,
                      fontFamily: "Poppins-Regular",
                      width: "100%",
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.secondary,
                      opacity: splitAmount.trim() ? 1 : 0.5,
                    },
                  ]}
                  disabled={!splitAmount.trim()}
                >
                  <Text style={[styles.logintxt, { color: colors.text }]}>
                    Split
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {payModal ? (
            <PaymentModal
              receiverid={selectedUserID}
              
              Payto={payTo}
              data={() => setPayModal(!payModal)}
            />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    verticalAlign: "center",
    flex: 1,
    alignContent: "center",
    backgroundColor: "#F9FAFB",
    justifyContent: "space-between",
    paddingBottom: 150,
  },
  main: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignSelf: "center",
  },
  button: {
    width: "20%",
    height: 50,
    borderRadius: 18,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  logintxt: {
    fontSize: 15,
    textAlign: "center",
    width: "100%",
    fontFamily: "Poppins-SemiBold",
    color: colors.text,
  },
  favperson: {
    backgroundColor: colors.background,
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "75%",
    height: 50,
    alignSelf: "center",
    borderRadius: 15,
    backgroundColor: "white",
    fontFamily: "Poppins-Regular",
    paddingLeft: 10,
    flexDirection: "row",
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 20,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
    marginTop: 10,
  },
});
