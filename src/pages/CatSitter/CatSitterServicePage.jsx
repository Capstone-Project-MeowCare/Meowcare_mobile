import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CatSitterInformation from "./CatSitterInformation";
import CatSitterReviews from "./CatSitterReviews";
import CatSitterAssistance from "./CatSitterAssistance";
import { getData } from "../../api/api";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../../auth/useAuth";

const { width, height } = Dimensions.get("window");

function FirstRoute({
  experience,
  skill,
  environment,
  location,
  userId,
  profilePictures,
  profilePicturesCargo,
  maximumQuantity,
}) {
  return (
    <View style={styles.routeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterInformation
            experience={experience}
            skill={skill}
            environment={environment}
            location={location}
            userId={userId}
            profilePictures={profilePictures}
            profilePicturesCargo={profilePicturesCargo}
            maximumQuantity={maximumQuantity}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SecondRoute() {
  return (
    <View style={styles.routeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterReviews />
        </View>
      </ScrollView>
    </View>
  );
}

function ThirdRoute({ id, fullRefundDay }) {
  return (
    <View style={styles.routeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContent}>
          <CatSitterAssistance id={id} fullRefundDay={fullRefundDay} />
        </View>
      </ScrollView>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function CatSitterServicePage({ navigation }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const route = useRoute();
  const [sitterDetails, setSitterDetails] = useState(null);
  const sitterId = route.params?.sitterId; // ID cũ
  const userId = route.params?.userId; // ID mới
  const [loading, setLoading] = useState(true);
  const [profilePictures, setProfilePictures] = useState([]);
  const [profilePicturesCargo, setProfilePicturesCargo] = useState([]);
  const [activeTab, setActiveTab] = useState("Thông tin");
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchSitterDetails = async () => {
      try {
        const response = await getData(`/sitter-profiles/${sitterId}`);
        const { profilePictures: fetchedPictures } = response.data;

        // Lọc chỉ những hình ảnh có isCargoProfilePicture === false
        const filteredPictures = Array.isArray(fetchedPictures)
          ? fetchedPictures.filter((picture) => !picture.isCargoProfilePicture)
          : [];
        const filteredPicturesCargo = Array.isArray(fetchedPictures)
          ? fetchedPictures.filter((picture) => picture.isCargoProfilePicture)
          : [];

        // Nếu không có hình ảnh hợp lệ, đặt giá trị mặc định
        setProfilePictures(
          filteredPictures.length > 0
            ? filteredPictures
            : [{ imageUrl: "https://example.com/default-image.jpg" }]
        );
        setProfilePicturesCargo(
          filteredPicturesCargo.length > 0
            ? filteredPicturesCargo
            : [{ imageUrl: "https://example.com/default-image.jpg" }]
        );

        setSitterDetails(response.data);
      } catch (error) {
        console.error("Error fetching sitter details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sitterId) fetchSitterDetails();
  }, [sitterId]);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.mainScrollContainer}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
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
        <Text style={styles.headerTitle}>Thông tin người chăm mèo</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleLikePress}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={30} // Đặt kích thước giống nhau
              color={isLiked ? "#902C6C" : "grey"}
            />
          </TouchableOpacity>

          {user.id !== sitterDetails?.user?.id && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => console.log("Menu pressed")}
            >
              <Entypo name="dots-three-vertical" size={30} color="#000857" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          style={styles.wrapper}
          autoplay={true}
          autoplayTimeout={3}
          showsPagination={true}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.pagination}
          loop={true}
          onIndexChanged={(index) => setCurrentIndex(index)}
          key={profilePictures.length}
        >
          {profilePictures.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.carouselImage}
              />
            </View>
          ))}
        </Swiper>
      </View>

      <View style={styles.infoContainer}>
        {sitterDetails ? (
          <View style={styles.infoContent}>
            <Image
              source={
                sitterDetails.user?.avatar
                  ? { uri: sitterDetails.user.avatar }
                  : require("../../../assets/catpeople.jpg")
              }
              style={styles.sitterImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{sitterDetails.user?.fullName}</Text>
              <Text style={styles.description}>{sitterDetails.bio}</Text>
              <Text style={styles.address}>{sitterDetails.location}</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#000857" />
        )}
      </View>

      <View style={{ height: height * 0.6 }}>
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
          screenListeners={{
            state: (e) => {
              const tabIndex = e.data.state.index;
              const tabName = e.data.state.routeNames[tabIndex];
              setActiveTab(tabName);
            },
          }}
        >
          <Tab.Screen
            name="Thông tin"
            children={() => (
              <FirstRoute
                experience={sitterDetails?.experience}
                skill={sitterDetails?.skill?.split(";").map((s) => s.trim())}
                environment={sitterDetails?.environment}
                location={sitterDetails?.location}
                userId={userId}
                profilePictures={profilePictures}
                profilePicturesCargo={profilePicturesCargo}
                maximumQuantity={sitterDetails?.maximumQuantity}
              />
            )}
          />
          <Tab.Screen name="Đánh giá" component={SecondRoute} />
          <Tab.Screen
            name="Dịch vụ"
            children={() => (
              <ThirdRoute
                id={userId}
                fullRefundDay={sitterDetails?.fullRefundDay}
              />
            )} // Dùng ID mới ở đây
          />
        </Tab.Navigator>
      </View>

      {user.id !== sitterDetails?.user?.id && (
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() =>
            navigation.navigate("SwipeStep", {
              sitterId: sitterDetails?.user.id,
            })
          }
        >
          <Text style={styles.bookingText}>Đặt Lịch</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  mainScrollContainer: {
    paddingBottom: height * 0.12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center", // Căn giữa dọc
    justifyContent: "space-between", // Tách đều các phần tử
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
    height: height * 0.08, // Chiều cao cố định
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.1, // Chiều rộng cố định để căn đều
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center", // Đảm bảo các biểu tượng căn giữa dọc
  },
  filterButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.02,
  },
  menuButton: {
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#FFFAF5",
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
    backgroundColor: "#FFFAF5",
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02, // Thêm margin để tránh đè lên nhau
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
  description: {
    fontSize: height * 0.015,
    color: "#000",
    marginBottom: height * 0.01,
    fontWeight: "600",
  },
  address: {
    fontSize: height * 0.015,
    color: "#000",
    fontWeight: "600",
  },
  routeContainer: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: width * 0.05,
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
    backgroundColor: "#FFFAF5",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bookingButton: {
    backgroundColor: "#2E67D1",
    width: width * 0.9,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    Top: height * 0.02,
    alignSelf: "center",
  },
  bookingText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
