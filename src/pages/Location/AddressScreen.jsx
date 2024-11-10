import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function AddressScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // List of address suggestions
  const [selectedLocation, setSelectedLocation] = useState({
    province: "Thành phố Hà Nội",
    district: "Quận Ba Đình",
    commune: "Phường Phúc Xá",
  });

  const normalizeVietnamese = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const fetchCoordinates = async (query) => {
    try {
      const response = await axios.get("https://photon.komoot.io/api/", {
        params: {
          q: query,
          limit: 5,
        },
      });

      if (response.data?.features) {
        setSuggestions(response.data.features); // Save suggestions
      } else {
        console.log("No suggestions found.");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Update suggestions on address input change
  useEffect(() => {
    if (address) {
      const query = `${address}, ${selectedLocation.commune}, ${selectedLocation.district}, ${selectedLocation.province}`;
      fetchCoordinates(normalizeVietnamese(query));
    } else {
      setSuggestions([]); // Clear suggestions when address is empty
    }
  }, [address]);

  const handleSelectSuggestion = (item) => {
    const [lon, lat] = item.geometry.coordinates;
    setCoordinates({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setAddress(item.properties.name);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("SetupLocation")}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ mới</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Location Display */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("LocationScreen")}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
            value={
              selectedLocation
                ? `${selectedLocation.province}\n${selectedLocation.district}\n${selectedLocation.commune}`
                : ""
            }
            editable={false}
            multiline={true}
            pointerEvents="none"
          />
          <Entypo
            name="chevron-right"
            size={20}
            color="#000857"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập địa chỉ"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => fetchCoordinates(address)}
        >
          <Ionicons name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => `${item.properties.osm_id}-${index}`} // Tạo khóa duy nhất cho mỗi mục
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
              <Text style={styles.suggestionItem}>{item.properties.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}

      {/* Map View */}
      {coordinates && (
        <MapView
          style={styles.map}
          initialRegion={coordinates}
          region={coordinates}
        >
          <Marker coordinate={coordinates} />
        </MapView>
      )}
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
    justifyContent: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  inputContainer: {
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  inputWithIcon: {
    height: 80,
    paddingRight: 25,
    color: "#000",
    fontWeight: "bold",
    paddingTop: 10,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 30,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#D3D3D3",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#000857",
    padding: 10,
    borderRadius: 5,
  },
  suggestionsContainer: {
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
  map: {
    flex: 1,
  },
});
