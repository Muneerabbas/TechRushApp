// import { Stack } from "expo-router";
// import Login  from "./src/screens/login";
// export default function RootLayout() {
//   return (
//     <Stack>
//       <Stack.Screen
//         name="Login"
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//         name="(tabs)"
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Stack>
//   );
// }
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}