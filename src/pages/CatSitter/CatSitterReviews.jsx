import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { getData } from "../../api/api";
import StarRating from "react-native-star-rating-widget";

const { width, height } = Dimensions.get("window");

export default function CatSitterReviews({ id }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getData(`/reviews/sitter/${id}`);
        if (response?.status === 1000 && Array.isArray(response.data)) {
          const formattedReviews = response.data.map((review) => ({
            id: review.id,
            comments: review.comments || "Không có nhận xét.",
            avatar: review.user?.avatar || null,
            name: review.user?.fullName || "Người dùng ẩn danh",
            date: new Date(review.createdAt).toLocaleDateString("vi-VN"),
            rating: review.rating || 0,
          }));
          setReviews(formattedReviews);
        } else {
          console.error("Dữ liệu không hợp lệ:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#902C6C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reviews.length > 0 ? (
        reviews.map((item, index) => (
          <View key={item.id} style={styles.reviewContainer}>
            <View style={styles.row}>
              <Image
                source={
                  item.avatar
                    ? { uri: item.avatar }
                    : require("../../../assets/avatar.png")
                }
                style={styles.sitterImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <StarRating
                  rating={item.rating}
                  onChange={() => {}}
                  starSize={20}
                  enableSwiping={false}
                  style={styles.starRating}
                />
              </View>
            </View>
            <Text style={styles.description}>{item.comments}</Text>
            {index < reviews.length - 1 && <View style={styles.separator} />}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Chưa có đánh giá nào.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: height * 0.0,
    paddingVertical: height * 0.01,
  },
  reviewContainer: {
    marginBottom: height * 0.02,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sitterImage: {
    width: width * 0.15,
    height: width * 0.15,
    resizeMode: "cover",
    borderRadius: (width * 0.15) / 2,
    marginRight: width * 0.04,
  },
  textContainer: {
    flexShrink: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    fontSize: height * 0.022,
    fontWeight: "bold",
    color: "#000857",
    marginBottom: height * 0.005,
  },
  date: {
    fontSize: height * 0.016,
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "400",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: height * 0.018,
    color: "rgba(0, 8, 87, 0.8)",
    fontWeight: "600",
    marginTop: height * 0.01,
  },
  separator: {
    marginTop: height * 0.02,
    height: 2,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  noDataText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000857",
    fontSize: 16,
  },
  starRating: {
    right: height * 0.01,
  },
});
