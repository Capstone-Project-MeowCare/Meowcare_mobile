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
  Alert,
} from "react-native";
import { getData, postData, putData } from "../../api/api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, Avatar } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import { useAuth } from "../../../auth/useAuth";

const { width, height } = Dimensions.get("window");

export default function SitterReviewScreen({ navigation }) {
  const route = useRoute();
  const { user } = useAuth();
  const { bookingId, sitterId } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [reviewExists, setReviewExists] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch User Details
        if (sitterId) {
          const userDetailsResponse = await getData(`/users/${sitterId}`);
          console.log("User Details Response:", userDetailsResponse);
          setUserDetails(userDetailsResponse.data);
        }

        // Fetch Review
        if (user?.id) {
          const reviewResponse = await getData(`/reviews/user/${user?.id}`);
          console.log("Review API Response:", reviewResponse);

          if (reviewResponse?.data?.length > 0) {
            const review = reviewResponse.data[0]; // Lấy đánh giá đầu tiên
            setRating(review.rating);
            setComments(review.comments);
            setReviewExists(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Kết thúc loading khi tất cả API được xử lý
      }
    };

    fetchData();
  }, [sitterId, user?.id]);
  const handleSubmitReview = async () => {
    if (!comments.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá.");
      return;
    }

    const reviewData = {
      rating,
      comments,
      userId: user?.id,
      bookingOrderId: bookingId,
    };

    try {
      const response = await postData("/reviews", reviewData);
      if (response) {
        Alert.alert("Thành công", "Đánh giá của bạn đã được gửi.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
    }
  };

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
            onChange={
              (value) => !reviewExists && setRating(Math.round(value)) // Disable khi đã có đánh giá
            }
            starSize={35}
            color="#FFD700"
            style={styles.starRating}
            disabled={reviewExists} // Disable nếu đã có đánh giá
          />
          <TextInput
            style={styles.reviewInput}
            multiline
            placeholder="Viết đánh giá của bạn ở đây..."
            placeholderTextColor="#A9A9A9"
            value={comments}
            onChangeText={setComments}
            editable={!reviewExists} // Disable nếu đã có đánh giá
          />
          {!reviewExists && ( // Ẩn nút nếu đã có đánh giá
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          )}
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
