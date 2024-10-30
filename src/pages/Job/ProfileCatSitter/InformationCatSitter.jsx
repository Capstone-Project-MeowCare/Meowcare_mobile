import React, { useState } from "react";
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
import { Ionicons } from '@expo/vector-icons';

export default function InformationCatSitter({navigation}) {
  const [tab, setTab] = useState('edit'); // State to handle tab selection
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

  const addActivity = () => {
    const newActivity = {
      id: (activities.length + 1).toString(),
      start: "",
      end: "",
      description: "",
    };
    setActivities([...activities, newActivity]);
  };
  

  const updateActivity = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index][field] = value;
    setActivities(updatedActivities);
  };

  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  const saveActivities = () => {
    Alert.alert("Lưu thành công", "Thông tin các hoạt động đã được lưu!");
  };

  const renderActivity = ({ item, index }) => (
    <View style={styles.activityContainer}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Bắt đầu"
          value={item.start}
          onChangeText={(text) => updateActivity(index, "start", text)}
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          style={styles.input}
          placeholder="Kết thúc"
          value={item.end}
          onChangeText={(text) => updateActivity(index, "end", text)}
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Mô tả hoạt động"
        value={item.description}
        onChangeText={(text) => updateActivity(index, "description", text)}
      />
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => removeActivity(index)} style={styles.actionButton}>
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

          <Text style={styles.headerTitle}>Hồ sơ hẹn hò</Text>

        <TouchableOpacity  onPress={handleSave}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      {/* Tabs for switching between Edit Profile and Preview Profile */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, tab === 'edit' && styles.activeTab]} 
          onPress={() => setTab('edit')}
        >
          <Text style={[styles.tabText, tab === 'edit' && styles.activeTabText]}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, tab === 'preview' && styles.activeTab]} 
          onPress={() => setTab('preview')}
        >
          <Text style={[styles.tabText, tab === 'preview' && styles.activeTabText]}>Xem lại hồ sơ</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main Content */}
       {/* ------------------------------------------ Setup profile---------------------------------------------------- */}
      {tab === 'edit' ? (
        
        <ScrollView style={styles.editProfileContainer}>
        {/* Vuốt lên xuống */}
    
      {/* Section for Photos */}
      <Text style={styles.sectionTitle}>Ảnh và gợi ý</Text>
      <Text style={styles.sectionSubtitle}>
        Kéo rồi thả ảnh và gợi ý theo thứ tự mà bạn muốn xuất hiện.
      </Text>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageList}
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Thêm ảnh hoặc gợi ý</Text>
      </TouchableOpacity>

      {/* Section for Introduction */}
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
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.addButton} onPress={addActivity}>
        <Text style={styles.addButtonText}>+ Thêm hoạt động</Text>
      </TouchableOpacity>
     
      <Text style={styles.sectionTitle}>Kỹ năng</Text>

      <Text style={styles.sectionTitle}>Thông tin nơi ở</Text>

      <Text style={styles.sectionTitle}>Thông tin nơi ở</Text>
   
    </ScrollView>

      ) : (
        
        <ScrollView style={styles.previewProfileContainer}>
          {/* ------------------------------------------ Setup profile---------------------------------------------------- */}
          <Text>Xem lại hồ sơ của bạn</Text>
          {/* Code cho phần xem lại hồ sơ */}
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
    marginTop:10,
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

  previewProfileContainer: {
    padding: 16,
    // Add more styling and components for previewing profile
  },
});
