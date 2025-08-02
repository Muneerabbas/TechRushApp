import { useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet,FlatList } from "react-native";
import { useFonts } from 'expo-font';
import colors from "../assets/utils/colors";
export default function Transctions() {
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json));
  }, []);


  const [fontsLoaded] = useFonts({
    // 'Poppins-Bold': require('../assests/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf')
  });


  const jokes = 
    [
      {
          "_id": "688a55e41f73c6b2ca4d1cdc",
          "sender": {
              "_id": "688a3b8bb264118cb59bb150",
              "name": "Sanket"
          },
          "receiver": {
              "_id": "688a55bb1f73c6b2ca4d1cd7",
              "name": "Magar"
          },
          "amount": 50,
          "description": "Lunch payment",
          "status": "Completed",
          "createdAt": "2025-07-30",
          "__v": 0
      },
      {
          "_id": "688a57df1f73c6b2ca4d1ce0",
          "sender": {
              "_id": "688a3b8bb264118cb59bb150",
              "name": "Sanket"
          },
          "receiver": {
              "_id": "688a55bb1f73c6b2ca4d1cd7",
              "name": "Magar"
          },
          "amount": 30,
          "description": "Payment for snaks",
          "status": "Completed",
          "createdAt": "2025-07-30",
          "__v": 0
      },
      {
          "_id": "688a62b7c1b2fc7056b878ef",
          "sender": {
              "_id": "688a3b8bb264118cb59bb150",
              "name": "Sanket"
          },
          "receiver": {
              "_id": "688a55bb1f73c6b2ca4d1cd7",
              "name": "Magar"
          },
          "amount": 200,
          "description": "Vadapav",
          "status": "Completed",
          "createdAt": "2025-07-30",
          "__v": 0
      },
      {
          "_id": "688b676e810302b076ad4fb6",
          "sender": {
              "_id": "688a3b8bb264118cb59bb150",
              "name": "Sanket"
          },
          "receiver": {
              "_id": "688902e367266b71fc853f44",
              "name": "Jane Doe"
          },
          "amount": 200,
          "description": "Vadapav",
          "status": "Completed",
          "createdAt": "2025-07-31",
          "__v": 0
      }, {
        "_id": "688b676e810302b076ad4fb6",
        "sender": {
            "_id": "688a3b8bb264118cb59bb150",
            "name": "Sanket"
        },
        "receiver": {
            "_id": "688902e367266b71fc853f44",
            "name": "Jane Doe"
        },
        "amount": 200,
        "description": "Vadapav",
        "status": "Completed",
        "createdAt": "2025-07-31",
        "__v": 0
    }, {
      "_id": "688b676e810302b076ad4fb6",
      "sender": {
          "_id": "688a3b8bb264118cb59bb150",
          "name": "Sanket"
      },
      "receiver": {
          "_id": "688902e367266b71fc853f44",
          "name": "Jane Doe"
      },
      "amount": 200,
      "description": "Vadapav",
      "status": "Completed",
      "createdAt": "2025-07-31",
      "__v": 0
  }, {
    "_id": "688b676e810302b076ad4fb6",
    "sender": {
        "_id": "688a3b8bb264118cb59bb150",
        "name": "Sanket"
    },
    "receiver": {
        "_id": "688902e367266b71fc853f44",
        "name": "Jane Doe"
    },
    "amount": 200,
    "description": "Vadapav",
    "status": "Completed",
    "createdAt": "2025-07-31",
    "__v": 0
}

  ];

  // const renderItem = ({ item }) => (
  //   <View style={styles.card}>
  //     <Text style={styles.jokeText}>{item.joke}</Text>
  //   </View>
  // );


  return (
    <View style={styles.container}>
      <Text style={styles.heading }>
        Transaction History
      </Text>

<View style={styles.main}>

<FlatList
        data={jokes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
<View style={{}}>

<Text style={[styles.jokeText,{    fontFamily:"Poppins-SemiBold"
}]}>Credited</Text>
<Text style={styles.jokeText}>{item.amount}rs to {item.receiver.name}</Text>


</View>

            <Text style={[styles.jokeText,{textAlign:"right"}]}>{item.createdAt}</Text>
          </View>
        )}
      />

</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F9FAFF',
  },
  heading: {
    fontSize: 24,

    marginBottom: 10,
    marginLeft:10,
    fontFamily:'Poppins-SemiBold'
    // Don't use `fontFamily` here directly unless you're sure the font is loaded
  },
  main:{

height:'80%',
marginTop:10,
width:"100%",
backgroundColor:colors.primary,
borderRadius:18,
paddingVertical:15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    width:'90%',
    height:'auto',
    borderRadius: 18,
    marginBottom: 10,
  alignSelf:"center",
  },
  jokeText: {
    fontSize: 16,
    color: '#333',
    fontFamily:"Poppins-Regular"
  },

});
