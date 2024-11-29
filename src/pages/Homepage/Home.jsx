import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CatSitterCard from "./CatSitterCard";
import BecomeCatSitterCard from "./BecomeCatSitterCard";
import HomeFooter from "./HomeFooter";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { getData } from "../../api/api";

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

function FirstRoute() {
  const navigation = useNavigation();
  const [parentPressEnabled, setParentPressEnabled] = useState(true);
  const [sitterData, setSitterData] = useState([]);

  const fetchSitterData = async () => {
    try {
      const response = await getData("/sitter-profiles");
      console.log("Response Data:", response.data);

      // Lấy dữ liệu đúng định dạng từ response.data
      const formattedData = response.data.map((item) => ({
        id: item.id, // ID cũ
        sitterId: item.sitterId, // Sitter ID (bây giờ chính là `user.id`)
        fullName: item.fullName,
        location: item.location,
      }));

      setSitterData(formattedData);
    } catch (error) {
      console.error("Error fetching sitter profiles:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSitterData();
    }, []) // Dependencies rỗng, chạy lại khi màn hình được focus
  );

  const disableParentPress = () => setParentPressEnabled(false);
  const enableParentPress = () => setParentPressEnabled(true);

  return (
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.catSitterGridContainer}>
        {sitterData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.catSitterItemContainer}
            onPress={() =>
              parentPressEnabled &&
              navigation.navigate("SitterServicePage", {
                sitterId: item.id, // `sitterId` cũ
                userId: item.sitterId, // `userId` mới
              })
            }
          >
            <CatSitterCard
              sitterName={item.fullName}
              address={item.location}
              imageSource={require("../../../assets/catpeople.jpg")}
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

function SecondRoute() {
  const [parentPressEnabled, setParentPressEnabled] = useState(true);

  const disableParentPress = () => {
    setParentPressEnabled(false);
  };

  const enableParentPress = () => {
    setParentPressEnabled(true);
  };

  return (
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.catSitterGridContainer}>
        {catSitterData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.catSitterItemContainer}>
            <CatSitterCard
              sitterName={item.sitterName}
              address={item.address}
              imageSource={item.imageSource}
              overlayText={item.overlayText}
              isVerified={item.isVerified}
              disableParentPress={disableParentPress}
              enableParentPress={enableParentPress}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainer}
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <Image
                source={require("../../../assets/Group358.png")}
                style={styles.logo}
              />
            </View>

            <View style={styles.topBarContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Map")}
                style={styles.squareContainer}
              >
                <FontAwesome name="map-o" size={24} color="#000857" />
              </TouchableOpacity>

              <View style={styles.searchBarContainer}>
                <TextInput
                  placeholder="Tìm kiếm người chăm sóc theo vị trí"
                  style={styles.searchBar}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate("Yêu thích")}
                >
                  <FontAwesome
                    name="heart-o"
                    size={24}
                    color="#000857"
                    style={styles.searchIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
                          // Áp dụng các style riêng biệt dựa trên tên tab
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
                <Tab.Screen name="Trông tại nhà" component={SecondRoute} />
              </Tab.Navigator>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.centeredContainer}>
              <BecomeCatSitterCard />
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
