import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../auth/useAuth";
import { getData } from "../../api/api";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Pets({ navigation }) {
  const { user } = useAuth();
  const [catData, setCatData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && user && user.id) {
      fetchPetProfiles();
    }
  }, [isFocused, user]);

  const fetchPetProfiles = async () => {
    try {
      const response = await getData(`/pet-profiles/user/${user.id}`);
      if (response?.data && Array.isArray(response.data)) {
        setCatData(response.data);
      } else {
        setCatData([]);
      }
    } catch (error) {
      console.error("Error fetching pet profiles:", error);
    }
  };

  const displayCatData = [...catData, { isAddNewButton: true }];

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
        <Text style={styles.label}>Mèo của tôi</Text>
      </View>

      <View style={styles.separator} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.catContainerRow}>
          {displayCatData.map((cat, index) =>
            cat.isAddNewButton ? (
              <TouchableOpacity
                key="add-new"
                style={styles.catContainer}
                onPress={() => navigation.navigate("CreatePet")}
              >
                <Image
                  source={require("../../../assets/image89.png")}
                  style={styles.catImage}
                />
                <View style={styles.catFooter1}>
                  <Text style={styles.addCatText}>Thêm thú cưng</Text>
                  <Text style={styles.addCatHintText}>
                    Nhấn vào đây để thêm thú cưng
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={cat.id}
                style={styles.catContainer}
                onPress={() =>
                  navigation.navigate("PetProfile", { petId: cat.id })
                }
              >
                <Image
                  source={{
                    uri:
                      cat.profilePicture ||
                      "../../../assets/defaultCatImage.png",
                  }}
                  style={styles.catImage}
                />
                <View style={styles.catFooter}>
                  <Text style={styles.catName}>{cat.petName}</Text>
                  <Text style={styles.catBreed}>{cat.breed}</Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    paddingHorizontal: width * 0.05,
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
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    flex: 1,
    bottom: height * 0.01,
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    alignSelf: "center",
  },
  scrollContent: {
    paddingBottom: height * 0.05,
  },
  catContainerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width * 0.9,
    marginTop: height * 0.04,
  },
  catContainer: {
    width: width * 0.4,
    height: height * 0.25,
    backgroundColor: "#FFFAF5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "flex-end",
    marginBottom: height * 0.02,
  },
  catImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  catFooter: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: height * 0.01,
    borderBottomRightRadius: height * 0.01,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: height * 0.01,
  },
  catFooter1: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: height * 0.01,
    borderBottomRightRadius: height * 0.01,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: height * 0.01,
  },
  catName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
  },
  catBreed: {
    fontSize: 12,
    color: "#000857",
    textAlign: "center",
    marginTop: height * 0.001,
  },
  addCatText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "center",
  },
  addCatHintText: {
    fontSize: 12,
    color: "#000857",
    textAlign: "center",
  },
});
