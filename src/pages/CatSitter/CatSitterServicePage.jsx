import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, View, StyleSheet, Dimensions, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper"; // Import Swiper
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"; // Import Top Tab Navigator
import CatSitterInformation from "./CatSitterInformation";
import CatSitterReviews from "./CatSitterReviews";
import CatSitterAssistance from "./CatSitterAssistance";

const { width, height } = Dimensions.get("window");

const catSitters = [
  {
    id: "1",
    name: "Nguyễn Phương Đại",
    description: "Yêu mèo, có kinh nghiệm chăm sóc",
    address: "Phường 10, Quận 6, Tp.HCM",
    price: "150.000đ",
    imageSource: require("../../../assets/avatar.png"),
  },
];

function FirstRoute() {
  return (
    <View style={styles.firstRouteContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterInformation />
        </View>
      </ScrollView>

      <View style={styles.fixedFooter}>
        <TouchableOpacity style={styles.bookingButton}>
          <Text style={styles.bookingText}>Đặt Lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SecondRoute() {
  return (
    <View style={styles.secondRouteContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterReviews />
        </View>
      </ScrollView>
    </View>
  );
}

function ThirdRoute() {
  return (
    <View style={styles.thirdRouteContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterAssistance />
        </View>
      </ScrollView>

      <View style={styles.fixedFooter}>
        <TouchableOpacity style={styles.bookingButton}>
          <Text style={styles.bookingText}>Đặt Lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Tạo Tab Navigator
const Tab = createMaterialTopTabNavigator();

export default function CatSitterServicePage({ navigation }) {
  const [isLiked, setIsLiked] = useState(false);
  const images = [
    require("../../../assets/bannerlogo2.png"),
    require("../../../assets/catpeople.jpg"),
    require("../../../assets/image4.png"),
    require("../../../assets/1.jpg"),
    require("../../../assets/Group347.png"),
  ];

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chăm mèo</Text>
        <TouchableOpacity style={styles.filterButton} onPress={handleLikePress}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={width * 0.07}
            color={isLiked ? "#902C6C" : "grey"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={3}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.pagination}
        >
          {images.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image source={item} style={styles.carouselImage} />
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.infoContainer}>
        {catSitters.map((item) => (
          <View key={item.id} style={styles.infoContent}>
            <Image source={item.imageSource} style={styles.sitterImage} />
            <View style={styles.textContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <View style={styles.centerRow}>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.address}>{item.address}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: height * 0.018,
                fontWeight: "bold",
                color: focused ? "#000857" : "rgba(0, 8, 87, 0.6)",
              }}
            >
              {route.name}
            </Text>
          ),
          tabBarIndicatorStyle: { backgroundColor: "#000857" },
          tabBarStyle: { backgroundColor: "#FFFAF5" },
        })}
      >
        <Tab.Screen name="Thông tin" component={FirstRoute} />
        <Tab.Screen name="Đánh giá" component={SecondRoute} />
        <Tab.Screen name="Dịch vụ" component={ThirdRoute} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    flex: 1,
    justifyContent: "flex-start",
  },
  filterButton: {
    justifyContent: "flex-end",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  headerTitle: {
    flex: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000857",
  },
  swiperContainer: {
    height: height * 0.35,
    marginTop: height * 0.02,
  },
  wrapper: {
    height: height * 0.35,
  },
  carouselItem: {
    width: width,
    height: height * 0.35,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dotStyle: {
    backgroundColor: "#FFFFFF",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDotStyle: {
    backgroundColor: "#000857",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pagination: {
    position: "absolute",
    bottom: height * 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
    padding: height * 0.02,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  sitterImage: {
    width: width * 0.16,
    height: height * 0.08,
    resizeMode: "cover",
    borderRadius: height * 0.9,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: height * 0.01,
  },

  name: {
    fontSize: height * 0.021,
    fontWeight: "bold",
    color: "#000857",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.005,
  },
  centerRow: {
    marginBottom: height * 0.01,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: height * 0.005,
  },

  description: {
    fontSize: height * 0.015,
    color: "#000",
    marginBottom: height * 0.01,
    fontWeight: "600",
  },
  address: {
    fontSize: height * 0.015,
    color: "#000",
    marginVertical: -height * 0.2,
    fontWeight: "600",
    flexShrink: 1,
    marginRight: width * 0.02,
  },
  firstRouteContainer: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  secondRouteContainer: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  thirdRouteContainer: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: height * 0.1,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  fixedFooter: {
    position: "absolute",
    bottom: height * 0.02,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  bookingButton: {
    width: width * 0.9,
    height: 33,
    backgroundColor: "#2E67D1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  bookingText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});