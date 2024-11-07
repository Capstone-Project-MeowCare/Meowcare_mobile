import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SetupProfile({ navigation }) {
  const [tab, setTab] = useState("edit"); // State to handle tab selection
  const [introduction, setIntroduction] = useState("");

  const [images, setImages] = useState([
    { id: "1", uri: "../../../assets/BecomeCatsitter.png" }, // Thay "image1_url" bằng link ảnh thật
  ]);
  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <TouchableOpacity style={styles.removeButton}>
        <Text style={styles.removeText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSave = () => {
    // Xử lý logic lưu thông tin
    Alert.alert("Thông báo", "Thông tin của bạn đã được lưu thành công!");
  };

  const [activities, setActivities] = useState([
    { id: "1", start: "6:00", end: "9:00", description: "Mô tả hoạt động" },
  ]);

  const endInputRefs = useRef([]);

  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  const formatTime = (timeInHours) => {
    const hours = Math.floor(timeInHours);
    const minutes = Math.floor((timeInHours % 1) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const addActivity = () => {
    const lastActivity = activities[activities.length - 1];
    const lastEndTime = convertTo24HourFormat(lastActivity.end);
    const maxEndTime = 21; // 9:00 PM in 24-hour format

    // Check if we've reached the max end time
    if (lastEndTime >= maxEndTime) {
      Alert.alert(
        "Không thể thêm hoạt động",
        "Thời gian hoạt động đã đến giới hạn 21:00."
      );
      endInputRefs.current[index].focus();
      return;
    }

    const newStartTime = lastEndTime;
    const newEndTime = Math.min(newStartTime + 1, maxEndTime); // Adjust to 1-hour duration

    const newActivity = {
      id: (activities.length + 1).toString(),
      start: formatTime(newStartTime),
      end: formatTime(newEndTime),
      description: "",
    };
    setActivities([...activities, newActivity]);
  };

  const updateActivity = (index, field, value, shouldValidate = true) => {
    const updatedActivities = [...activities];

    if (field === "end" && shouldValidate) {
      const start = convertTo24HourFormat(updatedActivities[index].start);
      const end = convertTo24HourFormat(value);
      const duration = end - start;

      if (duration < 1) {
        // Automatically correct to 1 hour if below minimum
        Alert.alert(
          "Lỗi",
          "Thời gian cho mỗi hoạt động phải tối thiểu là 1 giờ. Tự động sửa thành 1 giờ."
        );
        updatedActivities[index].end = formatTime(start + 1); // Set end time to 1 hour after start
      } else if (duration > 3) {
        // Automatically correct to 3 hours if above maximum
        Alert.alert(
          "Lỗi",
          "Thời gian cho mỗi hoạt động không được vượt quá 3 giờ. Tự động sửa thành 3 giờ."
        );
        updatedActivities[index].end = formatTime(start + 3); // Set end time to 3 hours after start
      } else {
        // If valid, set the end time as entered
        updatedActivities[index][field] = value;
      }
    } else {
      updatedActivities[index][field] = value;
    }

    setActivities(updatedActivities);
  };
  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  const renderActivity = ({ item, index }) => (
    <View style={styles.activityContainer}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Bắt đầu"
          value={item.start}
          editable={false}
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          ref={(ref) => (endInputRefs.current[index] = ref)}
          style={styles.input}
          placeholder="Kết thúc"
          value={item.end}
          onChangeText={(text) => updateActivity(index, "end", text, false)} // Pass `false` to skip validation during typing
          onEndEditing={() => updateActivity(index, "end", item.end, true)} // Pass `true` to validate on end editing
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mô tả hoạt động"
        value={item.description}
        onChangeText={(text) => updateActivity(index, "description", text)}
      />
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => removeActivity(index)}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Hồ sơ hoạt động</Text>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      {/* Tabs for switching between Edit Profile and Preview Profile */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "edit" && styles.activeTab]}
          onPress={() => setTab("edit")}
        >
          <Text
            style={[styles.tabText, tab === "edit" && styles.activeTabText]}
          >
            Chỉnh sửa hồ sơ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "preview" && styles.activeTab]}
          onPress={() => setTab("preview")}
        >
          <Text
            style={[styles.tabText, tab === "preview" && styles.activeTabText]}
          >
            Xem lại hồ sơ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main Content */}
      {/* ------------------------------------------ Setup profile---------------------------------------------------- */}
      {tab === "edit" ? (
        <ScrollView style={styles.editProfileContainer}>
          <Text style={styles.sectionTitle}>Ảnh và gợi ý</Text>
          <Text style={styles.sectionSubtitle}>
            Kéo rồi thả ảnh và gợi ý theo thứ tự mà bạn muốn xuất hiện.
          </Text>
          <View style={styles.imageListContainer}>
            <FlatList
              data={images}
              renderItem={renderImage}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false} // Disable FlatList scrolling
            />
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm ảnh hoặc gợi ý</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Tiểu sử của bản thân:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            maxLength={500}
            value={introduction}
            onChangeText={(text) => setIntroduction(text)}
            placeholder="Bạn hãy mô tả tiểu sử của bản thân nhé..."
          />
          <Text style={styles.sectionTitle}>Kinh nghiệm chăm sóc mèo:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            maxLength={500}
            value={introduction}
            onChangeText={(text) => setIntroduction(text)}
            placeholder="Bạn hãy mô tả kinh nghiệm chăm sóc của bản thân nhé..."
          />
          <Text style={styles.characterCount}>{introduction.length} / 500</Text>

          <Text style={styles.sectionTitle}>Thời gian chăm sóc:</Text>
          <View>
            <FlatList
              data={activities}
              renderItem={renderActivity}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Disable FlatList scrolling
            />
            <TouchableOpacity
              style={styles.addButtonActivity}
              onPress={addActivity}
            >
              <Text style={styles.addButtonText}>+ Thêm hoạt động</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.end}>
            <Text style={styles.sectionTitle}>
              An toàn, tin cậy & môi trường
            </Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              maxLength={500}
              value={introduction}
              onChangeText={(text) => setIntroduction(text)}
              placeholder="Bạn hãy mô tả một ít về khu vực bạn đang sinh sống..."
            />
            <Text style={styles.characterCount}>
              {introduction.length} / 500
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.previewProfileContainer}>
          <Text>Xem lại hồ sơ của bạn</Text>
          {/* Add preview content here */}
        </ScrollView>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    flex: 1,
    textAlign: "center",
  },
  saveText: {
    fontSize: 16,
    color: "#902C6C",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FFF7F0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#902C6C",
  },
  tabText: {
    fontSize: 16,
    color: "#902C6C",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#902C6C",
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  editProfileContainer: {
    padding: 16,
    // Add more styling and components for editing profile
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: 4,
    marginTop: 10,
  },

  imageList: {
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    marginRight: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#000000AA",
    borderRadius: 12,
    padding: 2,
  },
  removeText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "#902C6C",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  textInput: {
    borderColor: "#D3D3D3",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    textAlignVertical: "top",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 4,
  },
  activityContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  separator: {
    marginHorizontal: 8,
    color: "#999999",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingVertical: 4,
    fontSize: 14,
    color: "#333333",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 8,
  },
  addButtonActivity: {
    backgroundColor: "#4CAF50", // Green color similar to the first image
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 20, // Rounded corners
    marginVertical: 16,
    alignSelf: "center", // Center the button
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -40,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#28A745",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  end: {
    marginBottom: 50,
  },

  previewProfileContainer: {
    padding: 16,
    // Add more styling and components for previewing profile
  },
});
