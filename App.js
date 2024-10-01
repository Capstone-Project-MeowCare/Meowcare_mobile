import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Intro } from "./src/pages/Login/Intro";
import Header from "./src/pages/Login/Header";
import Login from "./src/pages/Login/Login";
import Home from "./src/pages/Homepage/Home";
import Profile from "./src/pages/Profile/Profile";
import FindSitterByMap from "./src/pages/Homepage/Map";
import Service from "./src/pages/Services/Service";
import Activity from "./src/pages/Services/Activity";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");
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
          name="Map"
          options={{ headerLeft: null, headerShown: false }}
          component={FindSitterByMap}
        />
        <Stack.Screen
          name="Homes"
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
          backgroundColor: "#FFFAF5",
          height: height * 0.09,
          elevation: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconColor = focused ? "#902C6C" : "rgba(0, 0, 0, 0.6)";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Activity") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Service") {
            iconName = focused ? "clipboard" : "clipboard-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
      />
      <Tab.Screen
        name="Activity"
        options={{ headerShown: false }}
        component={Activity}
      />
      <Tab.Screen
        name="Service"
        options={{ headerShown: false }}
        component={Service}
      />

      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
        component={Profile}
      />
    </Tab.Navigator>
  );
}

export default App;
