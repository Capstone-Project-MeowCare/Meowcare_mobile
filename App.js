import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Intro } from "./src/Login/Intro";
import Header from "./src/Login/Header";
import Login from "./src/Login/Login";
import Home from "./src/Homepage/Home";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IntroSlider">
        <Stack.Screen
          name="IntroSlider"
          options={{ headerLeft: null, headerShown: false }}
          component={Intro}
        />
        <Stack.Screen
          name="Login"
          options={{ headerLeft: null, headerShown: false }}
          component={Login}
        />
        <Stack.Screen
          name="Home"
          options={{ headerLeft: null, headerShown: false }}
          component={MyBottomNavigationBarWithHeader}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
function MyBottomNavigationBarWithHeader() {
  return (
    <>
      <Header />
      <MyBottomNavigationBar />
    </>
  );
}

function MyBottomNavigationBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#FF5B2E",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 90,
          elevation: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
        },
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          }
          // Comment these sections out for Service, Notification, and Profile
          // else if (route.name === "Service") {
          //   iconName = focused ? "ios-clipboard" : "ios-clipboard-outline";
          // } else if (route.name === "Notification") {
          //   iconName = focused ? "notifications" : "notifications-outline";
          // } else if (route.name === "Profile") {
          //   iconName = focused ? "ios-person" : "ios-person-outline";
          // }
          return <Ionicons name={iconName} size={size} color={"#F6F6F6"} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
      />
      {/* <Tab.Screen
        name="Service"
        options={{ headerShown: false }}
        component={Service}
      />
      <Tab.Screen
        name="Notification"
        options={{ headerShown: false }}
        component={Notification}
      />
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
        component={ProfileSettingScreen}
      /> */}
    </Tab.Navigator>
  );
}

export default App;
