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
import BookingStep1 from "./src/pages/Booking/BookingStep1";
import BookingStep2 from "./src/pages/Booking/BookingStep2";
import SwipeStep from "./src/pages/Booking/BookingSwipeSteps";
import BecomeSitter from "./src/pages/Job/BecomeSitter";
import CatSitterService from "./src/pages/Job/CatSitterService";
import CatSitterProfile from "./src/pages/Job/CatSitterProfile";
import CatSitterWallet from "./src/pages/Job/CatSitterWallet";
import CatSitterGuide from "./src/pages/Job/CatSitterGuide";
import HistoryWallet from "./src/pages/Job/Wallet/HistoryWallet";
import DepositWallet from "./src/pages/Job/Wallet/DepositWallet";
import WithdrawWallet from "./src/pages/Job/Wallet/WithdrawWallet";
import InformationCatSitter from "./src/pages/Job/ProfileCatSitter/SetupProfile";
import RegisterSitterStep1 from "./src/pages/Job/RegisterCatSitter/RegisterSitterStep1";
import RegisterSitterStep2 from "./src/pages/Job/RegisterCatSitter/RegisterSitterStep2";
import ServicePayment from "./src/pages/ServicePayment/ServicePayment";
import ServicePaymentMethod from "./src/pages/ServicePayment/ServicePaymentMethod";
import ServicePaymentComplete from "./src/pages/ServicePayment/ServicePaymentComplete";
import ServicePaymentOrderDetail from "./src/pages/ServicePayment/ServicePaymentOrderDetail";
import Knowledge from "./src/pages/Job/RegisterCatSitter/Knowledge";
import DoQuiz from "./src/pages/Job/RegisterCatSitter/DoQuiz";
import ResultQuiz from "./src/pages/Job/RegisterCatSitter/ResultQuiz";
import RegisterSitterStep3 from "./src/pages/Job/RegisterCatSitter/RegisterSitterStep3";
import RegisterSuccess from "./src/pages/Job/RegisterCatSitter/RegisterSuccess";
import LocationCatSitter from "./src/pages/Job/ProfileCatSitter/SetupLocation";
import CareMonitor from "./src/pages/CareMonitor/CareMonitor";
import AdditionalServices from "./src/pages/Services/AdditionalServices";
import CareServiceDetails from "./src/pages/Services/CareServiceDetails";
import Pets from "./src/pages/Pets/Pets";
import CreatePet from "./src/pages/Pets/CreatePet";
import PetProfile from "./src/pages/Profile/PetProfile";
import CreatePetStep1 from "./src/pages/Pets/CreatePetStep1";
import CreatePetStep2 from "./src/pages/Pets/CreatePetStep2";
import CreatePetStep3 from "./src/pages/Pets/CreatePetStep3";
import CreatePetStep4 from "./src/pages/Pets/CreatePetStep4";
import CreatePetStep5 from "./src/pages/Pets/CreatePetStep5";
import CreatePetStep7 from "./src/pages/Pets/CreatePetStep7";
import SetupService from "./src/pages/Job/ProfileCatSitter/SetupService";
import SetupShedule from "./src/pages/Job/ProfileCatSitter/SetupShedule";
import SetupLocation from "./src/pages/Job/ProfileCatSitter/SetupLocation";
import SetupProfile from "./src/pages/Job/ProfileCatSitter/SetupProfile";

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
        options={{ headerShown: false }}
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
          name="RegisterSitterStep1"
          options={{ headerLeft: null, headerShown: false }}
          component={RegisterSitterStep1}
        />
        <Stack.Screen
          name="RegisterSitterStep2"
          options={{ headerLeft: null, headerShown: false }}
          component={RegisterSitterStep2}
        />
        <Stack.Screen
          name="Knowledge"
          options={{ headerLeft: null, headerShown: false }}
          component={Knowledge}
        />
        <Stack.Screen
          name="DoQuiz"
          options={{ headerLeft: null, headerShown: false }}
          component={DoQuiz}
        />
        <Stack.Screen
          name="Kết quả bài kiểm tra"
          options={{ headerLeft: null, headerShown: false }}
          component={ResultQuiz}
        />
        <Stack.Screen
          name="RegisterSitterStep3"
          options={{ headerLeft: null, headerShown: false }}
          component={RegisterSitterStep3}
        />
        <Stack.Screen
          name="RegisterSuccess"
          options={{ headerLeft: null, headerShown: false }}
          component={RegisterSuccess}
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
          name="SetupProfile"
          options={{ headerLeft: null, headerShown: false }}
          component={SetupProfile}
        />
         <Stack.Screen
          name="SetupService"
          options={{ headerLeft: null, headerShown: false }}
          component={SetupService}
        />
        <Stack.Screen
          name="SetupLocation"
          options={{ headerLeft: null, headerShown: false }}
          component={SetupLocation}
        />
        <Stack.Screen
          name="SetupShedule"
          options={{ headerLeft: null, headerShown: false }}
          component={SetupShedule}
        />
        <Stack.Screen
          name="CatSitterWallet"
          options={{ headerLeft: null, headerShown: false }}
          component={CatSitterWallet}
        />
        <Stack.Screen
          name="HistoryWallet"
          options={{ headerLeft: null, headerShown: false }}
          component={HistoryWallet}
        />
        <Stack.Screen
          name="DepositWallet"
          options={{ headerLeft: null, headerShown: false }}
          component={DepositWallet}
        />
        <Stack.Screen
          name="WithdrawWallet"
          options={{ headerLeft: null, headerShown: false }}
          component={WithdrawWallet}
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
          name="ServicePayment"
          options={{ headerLeft: null, headerShown: false }}
          component={ServicePayment}
        />
        <Stack.Screen
          name="ServicePaymentMethod"
          component={ServicePaymentMethod}
          options={{
            headerShown: false,
            gestureEnabled: true, // Cho phép vuốt để đóng
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="ServicePaymentComplete"
          component={ServicePaymentComplete}
          options={{
            headerShown: false,
            gestureEnabled: true, // Cho phép vuốt để đóng
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="ServicePaymentOrderDetail"
          options={{ headerLeft: null, headerShown: false }}
          component={ServicePaymentOrderDetail}
        />
        <Stack.Screen
          name="CareMonitor"
          options={{ headerLeft: null, headerShown: false }}
          component={CareMonitor}
        />
        <Stack.Screen
          name="AdditionalServices"
          options={{ headerLeft: null, headerShown: false }}
          component={AdditionalServices}
        />
        <Stack.Screen
          name="CareServiceDetails"
          component={CareServiceDetails}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="MyPets"
          options={{ headerLeft: null, headerShown: false }}
          component={Pets}
        />
        <Stack.Screen
          name="CreatePet"
          options={{ headerLeft: null, headerShown: false }}
          component={CreatePet}
        />
        <Stack.Screen
          name="CreatePetStep1"
          component={CreatePetStep1}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="CreatePetStep2"
          component={CreatePetStep2}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="CreatePetStep3"
          component={CreatePetStep3}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="CreatePetStep4"
          component={CreatePetStep4}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="CreatePetStep5"
          component={CreatePetStep5}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="CreatePetStep7"
          component={CreatePetStep7}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen
          name="PetProfile"
          component={PetProfile}
          options={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Hiệu ứng trượt từ phải sang trái
                    }),
                  },
                ],
              },
            }),
          }}
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
