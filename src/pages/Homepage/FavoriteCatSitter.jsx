import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function FavoriteCatSitter({ navigation }) {
  const [favoriteSitters, setFavoriteSitters] = useState([]);

  // Tải dữ liệu yêu thích từ API hoặc bộ nhớ cục bộ
  useEffect(() => {
    // Ví dụ danh sách tĩnh
    const mockData = [
      {
        id: "1",
        fullName: "Nguyễn Hoài Phúc",
        location: "Thủ Đức, TP.HCM",
        imageSource: require("../../../assets/catpeople.jpg"),
      },
      {
        id: "2",
        fullName: "Alexandra",
        location: "Tân Bình, TP.HCM",
        imageSource: require("../../../assets/catpeople.jpg"),
      },
      {
        id: "3",
        fullName: "Gaelane",
        location: "Quận 1, TP.HCM",
        imageSource: require("../../../assets/catpeople.jpg"),
      },
    ];
    setFavoriteSitters(mockData);
  }, []);

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image source={item.imageSource} style={styles.sitterImage} />
      <View style={styles.cardContent}>
        <Text style={styles.sitterName}>{item.fullName}</Text>
        <Text style={styles.sitterLocation}>from {item.location}</Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart" size={20} color="#FF4D67" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Danh sách người chăm sóc yêu thích
        </Text>
      </View>
      <View style={styles.divider} />

      {/* Danh sách yêu thích */}
      <FlatList
        data={favoriteSitters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavoriteItem}
        contentContainerStyle={styles.listContainer}
      />
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  listContainer: {
    padding: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sitterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  sitterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  sitterLocation: {
    fontSize: 14,
    color: "#666",
  },
  favoriteButton: {
    padding: 5,
  },
});
