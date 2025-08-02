import { useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet,FlatList } from "react-native";
import { useFonts } from 'expo-font';
import colors from "../assets/utils/colors";
export default function Social() {
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
        Clubs And Events
      </Text>

<View style={styles.main}>

<FlatList
        data={jokes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.card,{flex:1, flexDirection:'row',justifyContent:'space-between' }]}>
<View style={{alignItems:"left",}}>

<Text style={[styles.jokeText,{    fontFamily:"Poppins-SemiBold", textAlign:"left",
}]}>PASC Club</Text>
<Text style={styles.jokeText}>{item.amount}rs to {item.receiver.name}</Text>


</View>

            <Text style={[styles.descrptiontxt]}>This Clubs is One of the Best Technical clubs in Pict </Text>
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
    backgroundColor:colors.secondary,
  },
  heading: {
    fontSize: 24,

    marginBottom: 5,
    marginLeft:10,
    fontFamily:'Poppins-SemiBold'
  },
  main:{

height:'85%',
marginTop:10,
width:"100%",
backgroundColor:colors.secondary,
borderRadius:18,
paddingVertical:15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    height:200,
    margin: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android elevation
    elevation: 5,
  },

  jokeText: {
    fontSize: 16,
    color: colors.black,
    fontFamily:"Poppins-Regular"
  }, 
  
  descrptiontxt: {
    fontSize: 14,
      flexWrap: 'wrap',         
    width: '40%', 
    color: '#333',
    textAlign:'right',
    margin:10,
    fontFamily:"Poppins-Regular"
  },

});
