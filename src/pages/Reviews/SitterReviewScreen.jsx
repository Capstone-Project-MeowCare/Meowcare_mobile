import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { getData, putData } from "../../api/api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, Avatar } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";

const { width, height } = Dimensions.get("window");

export default function SitterReviewScreen({ navigation }) {
  const route = useRoute();
  const sitterId = route.params?.sitterId;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    console.log("Sitter ID:", sitterId);

    const fetchUserDetails = async () => {
      try {
        setLoading(true);

        const response = await getData(`/users/${sitterId}`);
        console.log("Full API Response:", response);
        console.log("Response Data:", response.data);

        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sitterId) fetchUserDetails();
  }, [sitterId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A94B84" />
      </View>
    );
  }

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
      </View>
      <View style={styles.separator} />
      {userDetails && (
        <>
          <Text style={styles.reviewText}>
            Gửi đánh giá đến cho{" "}
            <Text style={styles.boldText}>
              {userDetails.fullName || userDetails.sitterProfile?.fullName}
            </Text>
          </Text>
          <View style={styles.separator1} />
          <View style={styles.avatarWrapper}>
            <Avatar.Image
              size={width * 0.23}
              source={
                userDetails.avatar
                  ? { uri: userDetails.avatar }
                  : require("../../../assets/avatar.png")
              }
              style={styles.avatarImage}
              theme={{ colors: { primary: "transparent" } }}
            />
          </View>
          <StarRating
            rating={rating}
            onChange={setRating}
            starSize={35}
            color="#FFD700"
            style={styles.starRating}
          />
          <TextInput
            style={styles.reviewInput}
            multiline
            placeholder="Viết đánh giá của bạn ở đây..."
            placeholderTextColor="#A9A9A9"
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </>
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
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    marginRight: "auto",
    top: height * 0.01,
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  separator: {
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.02,
  },
  separator1: {
    width: width * 0.9,
    height: 1,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  reviewText: {
    textAlign: "center",
    fontSize: 20,
    color: "#000000",
    marginTop: height * 0.02,
  },
  boldText: {
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
  },
  avatarWrapper: {
    marginTop: height * 0.03,
    alignSelf: "center",
  },
  avatarImage: {
    backgroundColor: "transparent",
  },
  starRating: {
    marginTop: height * 0.01,
    alignSelf: "center",
  },
  reviewInput: {
    width: width * 0.9,
    height: height * 0.15,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    marginTop: height * 0.02,
    alignSelf: "center",
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#000000",
  },
  submitButton: {
    backgroundColor: "#902C6C",
    borderRadius: 8,
    marginTop: height * 0.02,
    paddingVertical: 15,
    alignItems: "center",
    width: width * 0.4,
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
