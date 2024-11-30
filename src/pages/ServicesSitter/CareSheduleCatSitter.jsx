import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { deleteData, getData, postData, putData } from "../../api/api";
import CustomToast from "../../components/CustomToast";
import { firebaseTask } from "../../api/firebaseImg";

const { width, height } = Dimensions.get("window");

export default function CareScheduleSitter({ navigation, route }) {
  const {
    status: initialStatus,
    time,
    day,
    noteText: initialNoteText,
    mediaList: initialMediaList,
    taskId,
  } = route.params;

  const [status, setStatus] = useState(initialStatus || "Chưa bắt đầu");
  const [noteText, setNoteText] = useState(initialNoteText || "");
  const [mediaList, setMediaList] = useState(initialMediaList || []);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState(true);
  const [photoList, setPhotoList] = useState([]); // Chứa các ảnh
  const [videoList, setVideoList] = useState([]); // Chứa các video
  const [taskEvidenceId, setTaskEvidenceId] = useState(null);
  const [mediaToDelete, setMediaToDelete] = useState([]); // Media cần xóa
  const [newMediaList, setNewMediaList] = useState([]); // Media mới thêm
  const [loading, setLoading] = useState(true);
  const statusColor =
    status === "Hoàn thành"
      ? "#4CAF50"
      : status === "Đang diễn ra"
        ? "#FFC107"
        : "#000857";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAddMedia = async (isVideo = false) => {
    if (viewMode) return;
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: isVideo
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
  
      if (!result.canceled) {
        const localUri = result.assets[0].uri;
  
        // Tạm thời thêm media với trạng thái loading
        const loadingMedia = {
          id: `loading-${Date.now()}`,
          uri: null,
          isVideo,
          isLoading: true,
        };
  
        if (isVideo) {
          setVideoList((prev) => [...prev, loadingMedia]);
        } else {
          setPhotoList((prev) => [...prev, loadingMedia]);
        }
  
        // Mô phỏng render ảnh/video
        setTimeout(() => {
          const newMedia = {
            id: Date.now().toString(),
            uri: localUri,
            isVideo,
          };
  
          if (isVideo) {
            setVideoList((prev) =>
              prev.map((media) =>
                media.id === loadingMedia.id ? newMedia : media
              )
            );
          } else {
            setPhotoList((prev) =>
              prev.map((media) =>
                media.id === loadingMedia.id ? newMedia : media
              )
            );
          }
  
          // Cập nhật danh sách `newMediaList`
          setNewMediaList((prev) => [
            ...prev,
            {
              photoUrl: isVideo ? null : localUri,
              videoUrl: isVideo ? localUri : null,
              evidenceType: isVideo ? "VIDEO" : "PHOTO",
            },
          ]);
        }, 1000); // Giả lập thời gian xử lý
      }
    } catch (error) {
      console.error("Lỗi khi thêm phương tiện:", error);
      Alert.alert(
        "Lỗi",
        "Có lỗi xảy ra khi thêm phương tiện. Vui lòng thử lại."
      );
    }
  };
  
  useEffect(() => {
    const fetchTaskEvidence = async () => {
      setLoading(true);
      try {
        if (!taskId) {
          console.log("Không có taskId, không gọi API.");
          setViewMode(false);
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
              photoListFromAPI.push({
                id: evidence.id, // ID từ Task Evidence
                uri: evidence.photoUrl,
                isVideo: false,
              });
            }
            if (evidence.evidenceType === "VIDEO" && evidence.videoUrl) {
              videoListFromAPI.push({
                id: evidence.id, // ID từ Task Evidence
                uri: evidence.videoUrl,
                isVideo: true,
              });
            }
          });

          setPhotoList(photoListFromAPI);
          setVideoList(videoListFromAPI);
          setViewMode(true); // Có dữ liệu, chuyển sang chế độ xem
        } else {
          console.log("Không có dữ liệu Task Evidence.");
          setViewMode(false); // Không có dữ liệu -> chuyển sang chế độ chỉnh sửa
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setViewMode(false);
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
  const handleEditToggle = () => {
    setViewMode(false);
    setMediaToDelete([]); // Reset danh sách media cần xóa
    setNewMediaList([]); // Reset danh sách media mới
  };

  const handleRemoveMedia = (id, isVideo) => {
    if (viewMode) return;

    if (isVideo) {
      setVideoList((prev) => {
        const toDelete = prev.find((video) => video.id === id);
        // Nếu video tồn tại trên server, thêm vào mediaToDelete
        if (toDelete && !mediaToDelete.includes(toDelete.id)) {
          setMediaToDelete((prevToDelete) => [...prevToDelete, toDelete.id]);
        }
        // Xóa khỏi videoList
        return prev.filter((video) => video.id !== id);
      });
    } else {
      setPhotoList((prev) => {
        const toDelete = prev.find((photo) => photo.id === id);
        // Nếu ảnh tồn tại trên server, thêm vào mediaToDelete
        if (toDelete && !mediaToDelete.includes(toDelete.id)) {
          setMediaToDelete((prevToDelete) => [...prevToDelete, toDelete.id]);
        }
        // Xóa khỏi photoList
        return prev.filter((photo) => photo.id !== id);
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
  
      // Xóa media từ server trước
      for (const taskEvidenceId of mediaToDelete) {
        const deleteUrl = `/task-evidences/${taskEvidenceId}`;
        console.log(`Xóa Task Evidence với ID: ${taskEvidenceId}`);
        try {
          const response = await deleteData(deleteUrl);
          if (response.status !== 1000 && response.status !== 1003) {
            console.error(
              `Lỗi khi xóa Task Evidence với ID: ${taskEvidenceId}`,
              response
            );
          }
        } catch (error) {
          console.error(
            `Lỗi khi xóa Task Evidence với ID: ${taskEvidenceId}`,
            error
          );
        }
      }
  
      // Gửi payload với danh sách `newMediaList`
      if (newMediaList.length > 0) {
        const url = `/task-evidences/list?taskId=${taskId}`;
        const response = await postData(url, newMediaList);
  
        if (response.status !== 1000) {
          Alert.alert("Lỗi", "Không thể lưu dịch vụ. Vui lòng thử lại.");
          return;
        }
      }
  
      console.log("Payloads gửi lên API:", newMediaList);
  
      // Thành công -> Reset danh sách
      setMediaToDelete([]);
      setNewMediaList([]);
      Alert.alert("Thành công", "Dịch vụ đã được lưu!");
      setViewMode(true); // Chuyển sang chế độ xem
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi gọi API POST:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };
  

  const handleDelete = async () => {
    try {
      if (!taskEvidenceId) {
        Alert.alert("Lỗi", "Không có dịch vụ để xóa.");
        return;
      }

      const url = `/task-evidences/${taskEvidenceId}`;
      console.log("Xóa dịch vụ với URL:", url);

      const response = await deleteData(url);

      if (response.status === 1000 || response.status === 1003) {
        CustomToast({
          text: "Xóa thành công",
          position: 300,
        });
        navigation.goBack();
      } else {
        Alert.alert(
          "Lỗi",
          response?.message || "Không thể xóa dịch vụ. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Lỗi khi gọi API DELETE:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có muốn xóa nội dung của dịch vụ chăm sóc này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: async () => {
            await handleDelete();
            setMediaToDelete([]);
            setNewMediaList([]);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý dịch vụ chăm sóc</Text>
      </View>
      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Khung giờ: {time}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
        </View>
        <Text style={styles.dateTitle}>Ngày: {formatDate(day)}</Text>

        <Text style={styles.noteTitle}>Ghi chú:</Text>
        <TextInput
          style={styles.textInput}
          value={noteText}
          onChangeText={setNoteText}
          placeholder="Hãy ghi chú thông tin về mèo cưng cho chủ mèo yên tâm nhé"
          multiline
          editable={!viewMode}
        />

        <Text style={styles.mediaTitle}>Hình ảnh:</Text>
        {photoList.length > 0 ? (
          <ScrollView contentContainerStyle={styles.mediaGrid}>
            {photoList.map((photo) => (
              <View key={photo.id} style={styles.mediaContainer}>
                {photo.isLoading ? (
                  <ActivityIndicator size="large" color="#902C6C" />
                ) : (
                  <Image source={{ uri: photo.uri }} style={styles.media} />
                )}
                {!viewMode && !photo.isLoading && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveMedia(photo.id, false)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF0000" />
                  </TouchableOpacity>
                )}
              </View>
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
        {!viewMode &&
          photoList.filter((media) => media.isLoading).length === 0 && // Ẩn nếu đang có media loading
          photoList.length < 3 && (
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => handleAddMedia(false)}
            >
              <Ionicons name="image-outline" size={30} color="#902C6C" />
              <Text style={styles.mediaButtonText}>Thêm ảnh</Text>
            </TouchableOpacity>
          )}

        <Text style={styles.mediaTitle}>Video:</Text>
        {videoList.length > 0 ? (
          <ScrollView contentContainerStyle={styles.mediaGrid}>
            {videoList.map((video) => (
              <View key={video.id} style={styles.mediaContainer}>
                {video.isLoading ? (
                  <ActivityIndicator size="large" color="#902C6C" />
                ) : (
                  <Video
                    source={{ uri: video.uri }}
                    style={styles.media}
                    useNativeControls
                    resizeMode="cover"
                  />
                )}
                {!viewMode && !video.isLoading && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveMedia(video.id, true)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF0000" />
                  </TouchableOpacity>
                )}
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
        {!viewMode &&
          videoList.filter((media) => media.isLoading).length === 0 && // Ẩn nếu đang có media loading
          videoList.length < 1 && (
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => handleAddMedia(true)}
            >
              <Ionicons name="videocam-outline" size={30} color="#902C6C" />
              <Text style={styles.mediaButtonText}>Thêm video</Text>
            </TouchableOpacity>
          )}

        {/* {status !== "Hoàn thành" && !viewMode && (
          <View style={styles.mediaButtons}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => handleAddMedia(false)}
            >
              <Ionicons name="image-outline" size={30} color="#902C6C" />
              <Text style={styles.mediaButtonText}>Thêm ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => handleAddMedia(true)}
            >
              <Ionicons name="videocam-outline" size={30} color="#902C6C" />
              <Text style={styles.mediaButtonText}>Thêm video</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </ScrollView>

      {status !== "Hoàn thành" && (
        <TouchableOpacity
          style={[styles.saveButton, viewMode && { backgroundColor: "blue" }]} // Đổi màu nếu là "Chỉnh sửa"
          onPress={viewMode ? handleEditToggle : handleSave} // Gọi handleEditToggle khi viewMode = true
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {viewMode ? "Chỉnh sửa" : "Lưu thay đổi"}{" "}
              {/* Thay đổi text nút */}
            </Text>
          )}
        </TouchableOpacity>
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
    paddingBottom: height * 0.1,
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
    textAlign: "left",
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
  textInput: {
    width: "100%",
    height: height * 0.1,
    backgroundColor: "#FFE4E1", // Màu nền hồng nhạt
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    fontSize: 14,
    color: "#000", // Màu chữ
    textAlignVertical: "top",
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
    marginVertical: height * 0.01,
  },
  mediaGrid: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  mediaContainer: {
    width: width * 0.9, // Giới hạn chiều rộng
    height: (width * 0.9 * 9) / 16, // Tỷ lệ 16:9
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15, // Khoảng cách giữa các media
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Đảm bảo nút nằm trên cùng
  },
  media: {
    width: "100%",
    height: "100%",
  },
  mediaList: {
    marginBottom: 15,
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mediaButton: {
    width: height * 0.2,
    flex: 1,
    height: height * 0.08,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#902C6C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginLeft: height * 0.13,
    marginTop: height * 0.05,
  },
  mediaButtonText: {
    color: "#902C6C",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
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
  saveButton: {
    width: width * 0.8,
    height: height * 0.06,
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
    fontSize: 16,
    fontWeight: "600",
  },
});
