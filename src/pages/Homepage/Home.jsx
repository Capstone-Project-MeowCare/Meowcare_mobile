import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CatSitterCard from "./CatSitterCard";
import BecomeCatSitterCard from "./BecomeCatSitterCard";
import HomeFooter from "./HomeFooter";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { getData } from "../../api/api";
import axios from "axios";
import { useAuth } from "../../../auth/useAuth";

const { width, height } = Dimensions.get("window");

const catSitterData = [
  {
    id: "1",
    sitterName: "Nguyễn Hoài Phúc",
    address: "25 Thủ Đức, TP.HCM",
    isVerified: true,
    imageSource: require("../../../assets/1.jpg"),
  },
  {
    id: "2",
    sitterName: "User",
    address: "25 Thủ Đức, TP.HCM",
    isVerified: true,
    imageSource: require("../../../assets/catpeople.jpg"),
  },
  {
    id: "3",
    sitterName: "User",
    address: "25 Thủ Đức, TP.HCM",
    isVerified: true,
    imageSource: require("../../../assets/catpeople.jpg"),
  },
  {
    id: "4",
    sitterName: "User",
    address: "25 Thủ Đức, TP.HCM",
    isVerified: true,
    imageSource: require("../../../assets/catpeople.jpg"),
  },
];
{
  /* List Cat sitter có dịch vụ Gửi thú cưng */
}
function FirstRoute() {
  const navigation = useNavigation();
  const [parentPressEnabled, setParentPressEnabled] = useState(true);
  const [sitterData, setSitterData] = useState([]);

  const fetchSitterData = async () => {
    try {
      const response = await getData("/sitter-profiles");
      // console.log("Response Data:", response.data);

      // Xử lý dữ liệu đúng định dạng từ API
      const formattedData = response.data
        .filter((item) => item.status === "ACTIVE") // Chỉ lấy sitter có status ACTIVE
        .map((item) => {
          // Chỉ định hình ảnh đầu tiên có isCargoProfilePicture === false
          const firstProfilePicture = item.profilePictures.find(
            (picture) => !picture.isCargoProfilePicture
          );

          return {
            id: item.id,
            sitterId: item.sitterId,
            fullName: item.fullName,
            location: item.location,
            profileImage: firstProfilePicture
              ? firstProfilePicture.imageUrl
              : null, // Lưu cố định hình đầu tiên
          };
        })
        .slice(0, 4); // Lấy tối đa 4 sitter

      // Nếu state chưa có dữ liệu, lưu nó lại
      if (sitterData.length === 0) {
        setSitterData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching sitter profiles:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (sitterData.length === 0) {
        fetchSitterData();
      }
    }, [sitterData]) // Chỉ gọi lại nếu `sitterData` rỗng
  );

  const disableParentPress = () => setParentPressEnabled(false);
  const enableParentPress = () => setParentPressEnabled(true);
  const navigateToSitterServicePage = (navigation, sitterProfileId, userId) => {
    navigation.navigate("SitterServicePage", {
      sitterId: sitterProfileId, // ID của sitter profile
      userId, // ID của user
    });
  };

  return (
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.catSitterGridContainer}>
        {sitterData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.catSitterItemContainer}
            onPress={() =>
              parentPressEnabled &&
              navigateToSitterServicePage(navigation, item.id, item.sitterId)
            }
          >
            <CatSitterCard
              sitterName={item.fullName}
              address={item.location}
              imageSource={
                item.profileImage
                  ? { uri: item.profileImage }
                  : require("../../../assets/catpeople.jpg")
              }
              isVerified={true}
              disableParentPress={disableParentPress}
              enableParentPress={enableParentPress}
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Nút Xem Tất Cả */}
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate("ListCatSitter")}>
          <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

{
  /* List Cat sitter có dịch vụ khác */
}
function SecondRoute() {
  const navigation = useNavigation();
  const [parentPressEnabled, setParentPressEnabled] = useState(true);
  const [sitterData, setSitterData] = useState([]);

  const fetchSitterData = async () => {
    try {
      const response = await getData("/sitter-profiles");
      console.log("Response Data:", response.data);

      // Xử lý dữ liệu đúng định dạng từ API
      const formattedData = response.data
        .filter((item) => item.status === "ACTIVE") // Chỉ lấy sitter có status ACTIVE
        .map((item) => {
          // Chỉ định hình ảnh đầu tiên có isCargoProfilePicture === false
          const firstProfilePicture = item.profilePictures.find(
            (picture) => !picture.isCargoProfilePicture
          );

          return {
            id: item.id,
            sitterId: item.sitterId,
            fullName: item.fullName,
            location: item.location,
            profileImage: firstProfilePicture
              ? firstProfilePicture.imageUrl
              : null, // Lưu cố định hình đầu tiên
          };
        })
        .slice(0, 4); // Lấy tối đa 4 sitter

      // Nếu state chưa có dữ liệu, lưu nó lại
      if (sitterData.length === 0) {
        setSitterData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching sitter profiles:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (sitterData.length === 0) {
        fetchSitterData();
      }
    }, [sitterData]) // Chỉ gọi lại nếu `sitterData` rỗng
  );

  const disableParentPress = () => setParentPressEnabled(false);
  const enableParentPress = () => setParentPressEnabled(true);
  const navigateToSitterServicePage = (navigation, sitterProfileId, userId) => {
    navigation.navigate("SitterServicePage", {
      sitterId: sitterProfileId, // ID của sitter profile
      userId, // ID của user
    });
  };

  return (
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.catSitterGridContainer}>
        {sitterData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.catSitterItemContainer}
            onPress={() =>
              parentPressEnabled &&
              navigateToSitterServicePage(navigation, item.id, item.sitterId)
            }
          >
            <CatSitterCard
              sitterName={item.fullName}
              address={item.location}
              imageSource={
                item.profileImage
                  ? { uri: item.profileImage }
                  : require("../../../assets/catpeople.jpg")
              }
              isVerified={true}
              disableParentPress={disableParentPress}
              enableParentPress={enableParentPress}
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Nút Xem Tất Cả */}
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate("ListCatSitter")}>
          <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [hasSitterProfile, setHasSitterProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkSitterProfile = async () => {
      if (user?.id) {
        try {
          const response = await getData(`/users/${user.id}`);
          if (response?.data?.sitterProfile?.id) {
            setHasSitterProfile(true); // Người dùng đã có `sitterProfile`
          } else {
            setHasSitterProfile(false); // Không có `sitterProfile`
          }
        } catch (error) {
          // console.error("Error checking sitter profile:", error);
        } finally {
          setLoading(false); // Kết thúc loading
        }
      }
    };

    checkSitterProfile();
  }, [user?.id]);
  // Hàm tìm kiếm địa chỉ qua Geoapify
  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: query,
            apiKey: "7eaa555d1d1f4dbe9b2792ee9c726f10",
            limit: 5,
          },
        }
      );
      setSearchResults(response.data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  // Xử lý khi chọn một địa chỉ
  const handleAddressSelect = (address) => {
    const { geometry } = address;
    const { coordinates } = geometry;
    const [longitude, latitude] = coordinates;

    // Điều hướng sang trang Map với tọa độ đã chọn
    navigation.navigate("Map", { latitude, longitude });

    // Xóa nội dung tìm kiếm và gợi ý
    setSearchQuery("");
    setSearchResults([]);
  };

  // Reset trạng thái khi quay lại trang
  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      setSearchResults([]);
    }, [])
  );
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFAF5",
        }}
      >
        <ActivityIndicator size="large" color="#A94B84" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainer}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Image
                source={require("../../../assets/Group358.png")}
                style={styles.logo}
              />
            </View>

            {/* Top Bar */}
            <View style={styles.topBarContainer}>
              {/* Map Button */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Map")}
                style={styles.squareContainer}
              >
                <FontAwesome name="map-o" size={24} color="#000857" />
              </TouchableOpacity>

              {/* Search Bar Container */}
              <View style={styles.searchBarContainer}>
                <TextInput
                  placeholder="Tìm kiếm người chăm sóc theo vị trí"
                  style={[styles.searchBar, { fontSize: 14 }]}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (text.length > 2) {
                      fetchAddressSuggestions(text);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    style={styles.clearButton}
                  >
                    <FontAwesome name="times-circle" size={20} color="#000" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => navigation.navigate("Yêu thích")}
                  style={styles.searchIcon}
                >
                  <FontAwesome name="heart-o" size={24} color="#000857" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Suggestions List */}
            {searchResults.length > 0 && (
              <ScrollView style={styles.suggestionsList}>
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAddressSelect(item)}
                    style={styles.suggestionItem}
                  >
                    <Text>{item.properties.formatted}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {/* Tabs */}
            <View style={{ flex: 1, height: height * 0.6 }}>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarLabel: ({ focused }) => (
                    <View style={styles.tabLabelContainer}>
                      <Image
                        source={
                          route.name === "Gửi thú cưng"
                            ? require("../../../assets/Vector.png")
                            : require("../../../assets/Vector1.png")
                        }
                        style={
                          route.name === "Gửi thú cưng"
                            ? styles.tabIcon
                            : styles.tabIcon1
                        }
                      />
                      <Text
                        style={[
                          route.name === "Gửi thú cưng"
                            ? styles.tabTextStyle1
                            : styles.tabTextStyle2,
                          {
                            color: focused ? "#000857" : "rgba(0, 8, 87, 0.6)",
                          },
                        ]}
                      >
                        {route.name}
                      </Text>
                    </View>
                  ),
                  tabBarIndicatorStyle: {
                    backgroundColor: "#000857",
                  },
                  tabBarStyle: {
                    backgroundColor: "#FFFAF5",
                  },
                  tabBarInactiveTintColor: "#000857",
                  tabBarActiveTintColor: "rgba(0, 8, 87, 0.6)",
                })}
              >
                <Tab.Screen name="Gửi thú cưng" component={FirstRoute} />
                <Tab.Screen name="Dịch vụ khác" component={SecondRoute} />
              </Tab.Navigator>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.centeredContainer}>
              {!hasSitterProfile ? (
                <BecomeCatSitterCard />
              ) : (
                // View trống giữ chỗ
                <View style={styles.placeholder} />
              )}
            </View>

            <View style={styles.footerWrapper}>
              <HomeFooter />
            </View>
          </>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  headerContainer: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    height: (width * 226) / 500,
    zIndex: 1,
  },
  logo: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  squareContainer: {
    width: width * 0.15,
    height: width * 0.12,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginRight: width * 0.03,
  },
  searchBarContainer: {
    width: width * (308 / 375),
    height: width * (50 / 375),
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    paddingLeft: height * 0.01,
  },
  searchBar: {
    flex: 1,
    padding: height * 0.01,
    fontSize: 16,
  },
  searchIcon: {
    padding: height * 0.01,
    marginRight: height * 0.009,
  },
  suggestionsList: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },
  suggestionItem: {
    padding: 8,
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  tabLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabIcon: {
    width: 30,
    height: 40,
    marginRight: height * 0.008,
  },
  tabIcon1: {
    width: 24,
    height: 35,
    marginRight: height * 0.01,
    marginTop: height * 0.01,
  },
  tabTextStyle1: {
    fontSize: height * 0.022,
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
    fontWeight: "bold",
  },
  tabTextStyle2: {
    fontSize: height * 0.022,
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
    fontWeight: "bold",
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.025,
    backgroundColor: "#FFFAF5",
  },
  placeholder: {
    height: 150,
    width: "100%",
    backgroundColor: "transparent",
  },
  footerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  catSitterCardsContainer: {
    flexDirection: "row",
    paddingHorizontal: height * 0.01,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  catSitterGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  catSitterItemContainer: {
    width: "48%",
    marginBottom: height * 0.01,
    flexShrink: 0,
  },
  flatListContentContainer: {
    paddingBottom: height * 0.044,
  },
});
