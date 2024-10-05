import React from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Dữ liệu người dùng giả lập cho đánh giá
const reviews = [
  {
    id: "1",
    name: "Tấn",
    description: "Dịch vụ rất tốt, tôi rất hài lòng với cách chăm sóc.",
    date: "12/09/2023",
    imageSource: require("../../../assets/userimg.png"),
  },
  {
    id: "2",
    name: "Trần Thị B",
    description: "Chăm sóc mèo tận tình, chu đáo, dịch vụ đáng tin cậy.",
    date: "08/09/2023",
    imageSource: require("../../../assets/avatar.png"),
  },
  {
    id: "3",
    name: "Lê Văn C",
    description: "Chất lượng dịch vụ tốt, mèo của tôi rất vui vẻ và khỏe mạnh.",
    date: "05/09/2023",
    imageSource: require("../../../assets/avatar.png"),
  },
];

export default function CatSitterReviews({}) {
  return (
    <View style={styles.container}>
      {reviews.map((item, index) => (
        <View key={item.id} style={styles.reviewContainer}>
          <View style={styles.row}>
            <Image source={item.imageSource} style={styles.sitterImage} />

            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {index < reviews.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
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
  },
  sitterImage: {
    width: width * 0.16,
    height: height * 0.08,
    resizeMode: "cover",
    borderRadius: height * 0.9,
    marginRight: height * 0.02,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingRight: height * 0.03,
    marginTop: -height * 0.015,
  },
  name: {
    fontSize: height * 0.021,
    fontWeight: "bold",
    color: "#000857",
    marginLeft: -width * 0.03,
  },
  date: {
    fontSize: height * 0.015,
    color: "rgba(0, 8, 87, 0.8)",
    fontWeight: "600",
    marginBottom: height * 0.01,
    marginLeft: -width * 0.03,
  },
  description: {
    fontSize: height * 0.018,
    color: "rgba(0, 8, 87, 0.8)",
    fontWeight: "600",
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },
  separator: {
    marginTop: height * 0.02,
    height: 2,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});
