import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../../auth/useAuth";
import { Picker } from "@react-native-picker/picker";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { firebaseTask } from "../../api/firebaseImg";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
const { width, height } = Dimensions.get("window");

export default function CareServiceDetails({ navigation, route }) {
  const [rating, setRating] = useState(0);
  const { status, userId, sitterId, time, day } = route.params;
  const { roles, user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(status || "Chưa bắt đầu");
  const [taskList, setTaskList] = useState([]);
  const isSitter =
  Array.isArray(roles) && roles.some((role) => role.roleName === "SITTER");
const isUser =
  Array.isArray(roles) && roles.some((role) => role.roleName === "USER");
  
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
  useEffect(() => {
    console.log("Received params:", route.params);
  }, []);
  const handleAddTasks = async (isVideo = false) => {
     if (!isSitter) return;
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: isVideo
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets.length > 0
      ) {
        const selectedAsset = pickerResult.assets[0];

        // Thêm dữ liệu vào danh sách `taskList`
        setTaskList((prev) => [
          ...prev,
          { id: Date.now().toString(), uri: selectedAsset.uri, isVideo },
        ]);

        console.log(
          `Added ${isVideo ? "video" : "image"} to task list:`,
          selectedAsset.uri
        );
      } else {
        console.log("No media selected or action canceled.");
      }
    } catch (error) {
      console.error(`Error selecting ${isVideo ? "video" : "image"}:`, error);
    }
  };

  const renderImage = ({ item }) => (
    <Image source={item.source} style={styles.image} />
  );

  const renderMediaItem = ({ item }) => {
    if (item.isVideo) {
      return (
        <View style={styles.mediaContainer}>
          <Video
            source={{ uri: item.uri }}
            style={styles.video}
            useNativeControls
            resizeMode="cover"
          />
        </View>
      );
    }
    return (
      <View style={styles.mediaContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  };

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
        <Text style={styles.label}>Chi tiết chăm sóc</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Khung giờ: {time}</Text>
        <View style={styles.statusContainer}>
          {isSitter ? (
            <View style={styles.statusPickerContainer}>
              <Picker
                selectedValue={currentStatus}
                onValueChange={(itemValue) => {
                  setCurrentStatus(itemValue); // Cập nhật state
                  console.log("Trạng thái mới:", itemValue);
                }}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Chưa bắt đầu" value="Chưa bắt đầu" />
                <Picker.Item label="Đang diễn ra" value="Đang diễn ra" />
                <Picker.Item label="Hoàn thành" value="Hoàn thành" />
              </Picker>
            </View>
          ) : (
            <Text style={[styles.status, { color: statusColor }]}>
              {status}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.dateTitle}>Ngày: {day}</Text>
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
          {isSitter ? (
            <TextInput
              style={[
                styles.noteInput,
                {
                  color: noteText
                    ? "rgba(0, 8, 8, 0.87)"
                    : "rgba(0, 0, 0, 0.4)",
                },
              ]}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Nhập ghi chú của bạn"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              multiline
            />
          ) : (
            <View style={styles.placeholderView} />
          )}

          <View style={styles.separator1} />
          <Text style={styles.noteTitle}>Hình ảnh và video:</Text>
          <FlatList
            data={taskList}
            renderItem={renderMediaItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: height * 0.2 }}
            ListFooterComponent={
              <View style={styles.iconsRow}>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => handleAddTasks(false)}
                >
                  <AntDesign name="camerao" size={30} color="#902C6C" />
                  <Text style={styles.iconText}>Thêm ảnh</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => handleAddTasks(true)}
                >
                  <AntDesign name="videocamera" size={30} color="#902C6C" />
                  <Text style={styles.iconText}>Thêm video</Text>
                </TouchableOpacity>
              </View>
            }
          />

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
  statusContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.01,
    marginLeft: height * 0.03,
  },
  statusPickerContainer: {
    borderColor: "#902C6C",
    borderWidth: 1,
    borderRadius: 8,
    width: width * 0.4,
    height: height * 0.05,
    justifyContent: "center",
  },
  picker: {
    fontSize: 14,
    color: "#000",
    width: "100%",
    height: "100%",
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
    marginTop: height * 0.02,
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
    marginTop: height * 0.39,
  },
  // image: {
  //   width: width * 0.29,
  //   height: height * 0.15,
  //   resizeMode: "cover",
  //   marginTop: height * 0.02,
  // },
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   paddingHorizontal: width * 0.001,
  //   marginBottom: height * 0.002,
  // },
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: height * 0.01,
  //   paddingHorizontal: width * 0.01,
  // },
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
  placeholderView: {
    width: width * 0.9,
    height: height * 0.12,
    marginTop: height * 0.01,
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
  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: height * 0.02,
    paddingVertical: height * 0.01,
  },
  iconWrapper: {
    width: width * 0.4,
    height: width * 0.2,
    borderRadius: width * 0.02,
    borderWidth: 2,
    borderColor: "#902C6C",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.02,
  },
  iconText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#902C6C",
    marginTop: height * 0.005,
    textAlign: "center",
  },
  mediaContainer: {
    width: width * 0.8, // 80% chiều rộng màn hình
    height: (width * 0.8 * 9) / 16, // Tỷ lệ 16:9
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: height * 0.01, // Khoảng cách giữa các phần tử
  },
  video: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
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
