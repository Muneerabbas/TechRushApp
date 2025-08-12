// // app/(tabs)/components/home/PayUser.jsx
// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export const PayUser = ({ query, setQuery, users, onSelectUser }) => (
//   <View style={styles.paySection}>
//     <Text style={styles.payHeader}>Pay Someone</Text>
//     <View style={styles.searchContainer}>
//       <Ionicons name="search" size={20} color="#777" />
//       <TextInput
//         placeholder="Find a user to pay"
//         value={query}
//         onChangeText={setQuery}
//         style={styles.searchInput}
//         placeholderTextColor="#aaa"
//       />
//     </View>
//     {query && users.length > 0 && (
//       <View style={styles.searchResults}>
//         {users.map((user) => (
//           <TouchableOpacity
//             key={user._id}
//             onPress={() => onSelectUser(user)}
//             style={styles.userResultItem}
//           >
//             <Text style={styles.userResultText}>{user.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     )}
//   </View>
// );

// const styles = StyleSheet.create({
//   paySection: {
//     marginBottom: 20,
//   },
//   payHeader: {
//     fontSize: 20,
//     fontFamily: "Poppins-SemiBold",
//     color: "#333",
//     marginBottom: 10,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 10,
//     fontFamily: "Poppins-Regular",
//     fontSize: 16,
//   },
//   searchResults: {
//     marginTop: 10,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 2,
//   },
//   userResultItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   userResultText: {
//     fontFamily: "Poppins-Regular",
//     fontSize: 16,
//     color: "#444",
//   },
// });