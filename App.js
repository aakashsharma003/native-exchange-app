import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/login";
import Transaction from "./src/screens/transaction";
import HomeScreen from "./src/screens/home";
import { StyleSheet, View } from "react-native";
import AdminPanel from "./src/screens/admin";

const Stack = createStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName={"LoginOrRegister"}
          screenOptions={{ animationEnabled: false }}
        >
          <Stack.Screen name="LoginOrRegister" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} />}
          </Stack.Screen>

          {/* <Stack.Screen name="VerifyOtp" options={{ headerShown: false }}>
            {(props) => <OtpScreen {...props} />}
          </Stack.Screen> */}

          <Stack.Screen name="transaction" options={{ headerShown: false }}>
            {(props) => <Transaction {...props} />}
          </Stack.Screen>

          <Stack.Screen name="home" options={{ headerShown: false }}>
            {(props) => <HomeScreen {...props} />}
          </Stack.Screen>

          <Stack.Screen name="admin" options={{ headerShown: false }}>
            {(props) => <AdminPanel {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002046",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
