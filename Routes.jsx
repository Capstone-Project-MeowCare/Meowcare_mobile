import React from "react";
import { Dimensions } from "react-native";
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
import CatSitterServicePage from "./src/pages/CatSitter/CatSitterServicePage";
import Register from "./src/pages/Register/Register";
import BookingPreparation from "./src/pages/Booking/BookingStep1";
import BookingStep1 from "./src/pages/Booking/BookingStep1";
import BookingStep2 from "./src/pages/Booking/BookingStep2";
import SwipeStep from "./src/pages/Booking/BookingSwipeSteps";
import BecomeSitter from "./src/pages/Job/BecomeSitter";
import CatSitterService from "./src/pages/Job/CatSitterService";
import CatSitterProfile from "./src/pages/Job/CatSitterProfile";
import CatSitterWallet from "./src/pages/Job/CatSitterWallet";
import CatSitterGuide from "./src/pages/Job/CatSitterGuide";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

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
        tabBarShowLabel: true,
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
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: height * 0.01,
          fontWeight: "600",
        },
        tabBarActiveTintColor: "#902C6C",
        tabBarInactiveTintColor: "rgba(0, 0, 0, 0.6)",
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if (route.name === "Trang Chủ") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Hoạt Động") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Công Việc") {
            iconName = focused ? "clipboard" : "clipboard-outline";
          } else if (route.name === "Tài Khoản") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Trang Chủ"
        options={{ headerShown: false }}
        component={Home}
      />
      <Tab.Screen
        name="Hoạt Động"
        options={{ headerShown:false }}
        component={Activity}
      />
      <Tab.Screen
        name="Công Việc"
        options={{ headerShown: false }}
        component={Service}
      />
      <Tab.Screen
        name="Tài Khoản"
        options={{ headerShown: false }}
        component={Profile}
      />
    </Tab.Navigator>
  );
}

export function Routes() {
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
          name="BecomeSitter"
          options={{ headerLeft: null, headerShown: false }}
          component={BecomeSitter}
        />
        <Stack.Screen
          name="CatSitterService"
          options={{ headerLeft: null, headerShown: false }}
          component={CatSitterService}
        />
        <Stack.Screen
          name="CatSitterProfile"
          options={{ headerLeft: null, headerShown: false }}
          component={CatSitterProfile}
        />
       <Stack.Screen
          name="CatSitterWallet"
          options={{ headerLeft: null, headerShown: false }}
          component={CatSitterWallet}
        />
        <Stack.Screen
          name="CatSitterGuide"
          options={{ headerLeft: null, headerShown: false }}
          component={CatSitterGuide}
        />
        <Stack.Screen
          name="SitterServicePage"
          options={{ headerLeft: null, headerShown: false }}
          component={CatSitterServicePage}
        />
        <Stack.Screen
          name="BookingStep1"
          options={{ headerLeft: null, headerShown: false }}
          component={BookingStep1}
        />
        <Stack.Screen
          name="BookingStep2"
          options={{ headerLeft: null, headerShown: false }}
          component={BookingStep2}
        />
        <Stack.Screen
          name="SwipeStep"
          options={{ headerLeft: null, headerShown: false }}
          component={SwipeStep}
        />
        <Stack.Screen
          name="Register"
          options={{ headerLeft: null, headerShown: false }}
          component={Register}
        />
        <Stack.Screen
          name="Homes"
          options={{ headerLeft: null, headerShown: false }}
          component={MyBottomNavigationBarWithHeader}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}