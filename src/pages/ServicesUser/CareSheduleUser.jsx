import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import ImageViewing from "react-native-image-viewing";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function CareSheduleUser({ navigation, route }) {
  const { status, taskId, time, day } = route.params;
  const [noteText, setNoteText] = useState("");
  const [photoList, setPhotoList] = useState([]); // Chứa các ảnh
  const [videoList, setVideoList] = useState([]); // Chứa các video
  const [loading, setLoading] = useState(true);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const statusColor =
    status === "Hoàn thành"
      ? "#4CAF50"
      : status === "Đang diễn ra"
        ? "#FFC107"
        : "#000857";

  const openMediaViewer = (index) => {
    setCurrentIndex(index);
    setImageViewVisible(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        if (!taskId) {
          console.log("Không có taskId, không gọi API.");
          return;
        }

        const taskResponse = await getData(`/tasks/${taskId}`);
        if (taskResponse?.status === 1000 && taskResponse.data) {
          const { description } = taskResponse.data;
          setNoteText(description || "Chưa có ghi chú nào.");
        } else {
          console.error(
            "Không tìm thấy dữ liệu từ /tasks:",
            taskResponse?.message
          );
        }
      } catch (error) {
        console.error("Lỗi khi gọi API /tasks:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  useEffect(() => {
    const fetchTaskEvidence = async () => {
      setLoading(true);
      try {
        if (!taskId) {
          console.log("Không có taskId, không gọi API.");
          return;
        }

        const url = `/task-evidences/task/${taskId}`;
        const response = await getData(url);
        console.log("Response Body của API Task Evidence:", response);

        if (
          response.status === 1000 &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const photoListFromAPI = [];
          const videoListFromAPI = [];

          response.data.forEach((evidence) => {
            if (evidence.evidenceType === "PHOTO" && evidence.photoUrl) {
              const photoUrls = evidence.photoUrl.split(",");
              photoUrls.forEach((url) =>
                photoListFromAPI.push({
                  id: Date.now() + Math.random(),
                  uri: url,
                })
              );
            }

            if (evidence.evidenceType === "VIDEO" && evidence.videoUrl) {
              const videoUrls = evidence.videoUrl.split(",");
              videoUrls.forEach((url) =>
                videoListFromAPI.push({
                  id: Date.now() + Math.random(),
                  uri: url,
                })
              );
            }
          });

          setPhotoList(photoListFromAPI);
          setVideoList(videoListFromAPI);
        } else {
          console.log("Không có dữ liệu Task Evidence.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API /task-evidences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskEvidence();
  }, [taskId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#902C6C" />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Chi tiết dịch vụ chăm sóc</Text>
      </View>
      <View style={styles.divider} />

      {/* Content Section */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Khung giờ: {time}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
        </View>
        <Text style={styles.dateTitle}>Ngày: {formatDate(day)}</Text>

        {/* Notes Section */}
        <Text style={styles.noteTitle}>Ghi chú từ người chăm sóc:</Text>
        <Text style={styles.notesText}>
          {noteText || "Chưa có ghi chú nào."}
        </Text>

        {/* Photo Section */}
        <Text style={styles.mediaTitle}>Hình ảnh:</Text>
        {photoList.length > 0 ? (
          <ScrollView contentContainerStyle={styles.mediaGrid}>
            {photoList.map((photo, index) => (
              <TouchableOpacity
                key={photo.id}
                style={styles.mediaContainer}
                onPress={() => openMediaViewer(index)}
              >
                <Image source={{ uri: photo.uri }} style={styles.media} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyMediaContainer}>
            <Image
              source={require("../../../assets/image77.png")}
              style={styles.emptyMediaImage}
            />
            <Text style={styles.emptyMediaText}>Chưa có ảnh nào</Text>
          </View>
        )}

        {/* Video Section */}
        <Text style={styles.mediaTitle}>Video:</Text>
        {videoList.length > 0 ? (
          <ScrollView contentContainerStyle={styles.mediaGrid}>
            {videoList.map((video) => (
              <View key={video.id} style={styles.mediaContainer}>
                <Video
                  source={{ uri: video.uri }}
                  style={styles.media}
                  useNativeControls
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyMediaContainer}>
            <Image
              source={require("../../../assets/image77.png")}
              style={styles.emptyMediaImage}
            />
            <Text style={styles.emptyMediaText}>Chưa có video nào</Text>
          </View>
        )}
      </ScrollView>
      <ImageViewing
        images={photoList.map((photo) => ({ uri: photo.uri }))}
        imageIndex={currentIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
      <View style={styles.separatorThin} />
      <TouchableOpacity style={styles.requestButton}>
        <Text style={styles.buttonText}>Yêu cầu thông tin</Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
  },
  backButton: {
    justifyContent: "flex-start",
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
  contentContainer: {
    padding: 15,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
  },
  status: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "right",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
    marginTop: height * 0.01,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
    marginTop: height * 0.02,
  },
  notesText: {
    fontSize: 14,
    color: "#555",
    marginVertical: height * 0.01,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
    marginVertical: height * 0.01,
  },
  mediaContainer: {
    width: width * 0.9,
    height: (width * 0.9 * 9) / 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginBottom: 15,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  emptyMediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  emptyMediaImage: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
  },
  emptyMediaText: {
    fontSize: 14,
    color: "#888",
  },
  requestButton: {
    width: width * 0.8,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: height * 0.0099, // Cố định ở cuối màn hình
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
