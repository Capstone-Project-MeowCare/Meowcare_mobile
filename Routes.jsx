import React from "react";
import { Dimensions, Linking } from "react-native";
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
import FavoriteCatSitter from "./src/pages/Homepage/FavoriteCatSitter";
import LocationScreen from "./src/pages/Location/LocationScreen";
import AddressScreen from "./src/pages/Location/AddressScreen";
import CallScreen from "./src/pages/VideoCall/CallScreen";
import JoinScreen from "./src/pages/VideoCall/JoinScreen";
import RoomScreen from "./src/pages/VideoCall/RoomScreen";
import Chat from "./src/pages/Chat/Chat";
import BookingDetailRequest from "./src/pages/Job/BookingDetailRequest";
import ListCatSitter from "./src/pages/Homepage/ListCatSitter";
import UserProfile from "./src/pages/Profile/UserProfile";
import Support from "./src/pages/Profile/Support";
import QuestionSupport from "./src/pages/Profile/QuestionSupport";
import Payement from "./src/pages/Profile/Payment";
import Transaction from "./src/pages/Profile/Transaction";
import Notification from "./src/pages/Notification/Notification";
import BookingStep3 from "./src/pages/Booking/BookingStep3";
import CareSheduleUser from "./src/pages/ServicesUser/CareSheduleUser";
import CareMonitorUser from "./src/pages/ServicesUser/CareMonitorUser";
import CareMonitorCatSitter from "./src/pages/ServicesSitter/CareMonitorSitter";
import CareScheduleCatSitter from "./src/pages/ServicesSitter/CareSheduleCatSitter";
import PetReturn from "./src/pages/ServicesSitter/PetReturn";
import ConfirmService from "./src/pages/ServicesSitter/ConfirmService";
import ConfirmPayment from "./src/pages/ServicesSitter/ConfirmPayment";
import InComeMoney from "./src/pages/Job/Wallet/IncomeMoney";
import AdditionServicePayment from "./src/pages/ServicePayment/AdditionServicePayment";
import CareTimeManagement from "./src/pages/Job/ProfileCatSitter/CareTimeManagement";
import SitterReviewScreen from "./src/pages/Reviews/SitterReviewScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const linking = {
  prefixes: ["com.meowcare.mobile://"],
  config: {
    screens: {
      ServicePaymentComplete: "payment-complete",
      ServicePayment: "*",
    },
  },
  // Optional: Handle unknown URLs
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    console.log("Initial URL:", url);
    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => listener(url);

    // Listen for incoming links from deep linking
    const subscription = Linking.addEventListener("url", onReceiveURL);

    return () => {
      // Clean up the event listener
      subscription.remove(); // Updated for React Native 0.65+
    };
  },
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
    <NavigationContainer linking={linking}>
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
          name="Thông báo"
          options={{ headerLeft: null, headerShown: false }}
          component={Notification}
        />
        <Stack.Screen
          name="Yêu thích"
          options={{ headerLeft: null, headerShown: false }}
          component={FavoriteCatSitter}
        />
        <Stack.Screen
          name="ListCatSitter"
          options={{ headerLeft: null, headerShown: false }}
          component={ListCatSitter}
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
          name="CareTimeManagement"
          options={{ headerLeft: null, headerShown: false }}
          component={CareTimeManagement}
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
          name="Thống kê thu nhập"
          options={{ headerLeft: null, headerShown: false }}
          component={InComeMoney}
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
          name="BookingStep3"
          options={{ headerLeft: null, headerShown: false }}
          component={BookingStep3}
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
          name="AdditionServicePayment"
          options={{ headerLeft: null, headerShown: false }}
          component={AdditionServicePayment}
        />
        <Stack.Screen
          name="CareMonitor"
          options={{ headerLeft: null, headerShown: false }}
          component={CareMonitor}
        />
        <Stack.Screen
          name="CareMonitorUser"
          options={{ headerLeft: null, headerShown: false }}
          component={CareMonitorUser}
        />
        <Stack.Screen
          name="CareMonitorCatSitter"
          options={{ headerLeft: null, headerShown: false }}
          component={CareMonitorCatSitter}
        />
        <Stack.Screen
          name="Trả mèo"
          options={{ headerLeft: null, headerShown: false }}
          component={PetReturn}
        />
        <Stack.Screen
          name="ConfirmService"
          options={{ headerLeft: null, headerShown: false }}
          component={ConfirmService}
        />
        <Stack.Screen
          name="ConfirmPayment"
          options={{ headerLeft: null, headerShown: false }}
          component={ConfirmPayment}
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
          name="CareSheduleUser"
          component={CareSheduleUser}
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
          name="CareSheduleCatSitter"
          component={CareScheduleCatSitter}
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
          name="LocationScreen"
          component={LocationScreen}
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
          name="AddressScreen"
          component={AddressScreen}
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
          name="CallScreen"
          options={{ headerLeft: null, headerShown: false }}
          component={CallScreen}
        />
        <Stack.Screen
          name="JoinScreen"
          options={{ headerLeft: null, headerShown: false }}
          component={JoinScreen}
        />

        <Stack.Screen
          name="BookingDetailRequest"
          options={{ headerLeft: null, headerShown: false }}
          component={BookingDetailRequest}
        />
        <Stack.Screen
          name="Chat"
          options={{ headerLeft: null, headerShown: false }}
          component={Chat}
        />
        <Stack.Screen
          name="MyPets"
          options={{ headerLeft: null, headerShown: false }}
          component={Pets}
        />
        <Stack.Screen
          name="Giao dịch"
          options={{ headerLeft: null, headerShown: false }}
          component={Transaction}
        />
        <Stack.Screen
          name="Hồ sơ"
          options={{ headerLeft: null, headerShown: false }}
          component={UserProfile}
        />
        <Stack.Screen
          name="Thanh toán"
          options={{ headerLeft: null, headerShown: false }}
          component={Payement}
        />
        <Stack.Screen
          name="Trợ giúp"
          options={{ headerLeft: null, headerShown: false }}
          component={Support}
        />
        <Stack.Screen
          name="Câu hỏi thường gặp"
          options={{ headerLeft: null, headerShown: false }}
          component={QuestionSupport}
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
          name="SitterReviewScreen"
          options={{ headerLeft: null, headerShown: false }}
          component={SitterReviewScreen}
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
