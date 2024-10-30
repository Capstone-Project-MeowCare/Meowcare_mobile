import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import StarRating from "react-native-star-rating-widget";

const { width, height } = Dimensions.get("window");

export default function CareServiceDetails({ navigation, route }) {
  const [rating, setRating] = useState(0);
  const { status } = route.params;
  const statusColor =
    status === "Hoàn thành"
      ? "#4CAF50"
      : status === "Đang diễn ra"
        ? "#FFC107"
        : "#000857";
  const [noteText, setNoteText] = useState("");
  const imageData = [
    { id: "1", source: require("../../../assets/fatcat.png") },
    { id: "2", source: require("../../../assets/fatcat.png") },
    { id: "3", source: require("../../../assets/fatcat.png") },
    { id: "4", source: require("../../../assets/fatcat.png") },
  ];

  const renderImage = ({ item }) => (
    <Image source={item.source} style={styles.image} />
  );
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
        <Text style={styles.label}>Dịch vụ bổ sung</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Khung giờ: N/A</Text>
        <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
      </View>
      <Text style={styles.dateTitle}>Ngày: 27/09/2024</Text>
      <View style={styles.customView} />

      {status === "Hoàn thành" ? (
        <>
          <Text style={styles.noteTitle}>Ghi chú từ người chăm sóc:</Text>
          <TextInput
            style={[
              styles.noteInput,
              {
                color: noteText ? "rgba(0, 8, 8, 0.87)" : "rgba(0, 0, 0, 0.4)",
              },
            ]}
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Nhập ghi chú của bạn"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            multiline
          />
          <View style={styles.separator1} />
          <Text style={styles.noteTitle}>Hình ảnh và video:</Text>
          <FlatList
            data={imageData}
            renderItem={renderImage}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.row}
          />
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              Hãy đánh giá dịch vụ chăm sóc theo khung giờ này
            </Text>
            <StarRating
              rating={rating}
              onChange={setRating}
              starSize={40}
              style={styles.starRating}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.noteTitle}>Ghi chú từ người chăm sóc:</Text>
          <TextInput
            style={[
              styles.noteInput,
              {
                color: noteText ? "rgba(0, 8, 8, 0.87)" : "rgba(0, 0, 0, 0.4)",
              },
            ]}
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Nhập ghi chú của bạn"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            multiline
          />
          <View style={styles.separator1} />
          <Text style={styles.noteTitle}>Hình ảnh và video:</Text>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/image77.png")}
              style={styles.notFoundImage}
              resizeMode="contain"
            />
            <Text style={styles.noImageText}>Chưa có ảnh và video</Text>
          </View>
          <View style={styles.separatorThin} />
          <TouchableOpacity style={styles.requestButton}>
            <Text style={styles.buttonText}>Yêu cầu thông tin</Text>
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
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.06,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  title: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
    // marginTop: height * 0.02,
  },
  status: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000857",
    textAlign: "right",
  },
  dateTitle: {
    textAlign: "left",
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
    marginTop: height * 0.01,
  },
  customView: {
    width: width,
    height: height * 0.02,
    backgroundColor: "rgba(217, 217, 217, 0.8)",
    marginTop: height * 0.01,
    marginHorizontal: -width * 0.05,
  },
  noteTitle: {
    textAlign: "left",
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
    marginTop: height * 0.01,
  },
  noteInput: {
    width: width * 0.9,
    height: height * 0.12,
    backgroundColor: "rgba(255, 227, 213, 0.6)",
    borderRadius: 8,
    padding: width * 0.025,
    fontSize: width * 0.04,
    marginTop: height * 0.01,
  },
  separator1: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: height * 0.35,
  },
  image: {
    width: width * 0.29,
    height: height * 0.15,
    resizeMode: "contain",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.001,
    marginBottom: height * 0.002,
  },
  ratingContainer: {
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: height * 0.01,
    // left: 0,
    // right: 0,
    alignSelf: "center",
    paddingBottom: height * 0.02,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginBottom: height * 0.01,
  },
  submitButton: {
    backgroundColor: "#2E67D1",
    width: width * 0.23,
    height: height * 0.05,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: height * 0.02,
    top: height * 0.1,
  },
  notFoundImage: {
    width: width * 0.3,
    height: width * 0.3,
  },
  noImageText: {
    marginTop: height * 0.01,
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "center",
    fontSize: width * 0.04,
  },
  separatorThin: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    top: height * 0.9,
  },
  requestButton: {
    width: width * 0.8,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: height * 0.02,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});
