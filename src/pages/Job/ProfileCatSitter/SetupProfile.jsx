import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../../auth/useAuth";
import { getData, putData } from "../../../api/api";
import { firebaseImg } from "../../../api/firebaseImg";
import CatSitterSkill from "../../../data/CatSitterSkill.json";
import CustomToast from "../../../components/CustomToast";

export default function SetupProfile({ navigation }) {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [environment, setEnvironment] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [profilePictures, setProfilePictures] = useState([]);
  const [sitterProfileId, setSitterProfileId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() =>
          setProfilePictures((prevPictures) =>
            prevPictures.filter((pic) => pic.id !== item.id)
          )
        }
      >
        <Text style={styles.removeText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0];
        if (newImage.uri) {
          const imageUrl = await firebaseImg(newImage.uri);

          if (imageUrl) {
            const newProfilePicture = {
              id: new Date().getTime().toString(),
              imageName: newImage.uri.split("/").pop(),
              imageUrl: imageUrl,
            };
            setProfilePictures((prevPictures) => [
              ...prevPictures,
              newProfilePicture,
            ]);
          }
        } else {
          console.log("Invalid image URI");
        }
      } else {
        console.log("No image selected or assets not available");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  useEffect(() => {
    const fetchSitterProfileId = async () => {
      try {
        const response = await getData(`/sitter-profiles/sitter/${user.id}`);
        if (response?.data?.id) {
          setSitterProfileId(response.data.id);
        } else {
          console.log("Không tìm thấy sitter profile ID");
        }
      } catch (error) {
        console.error("Error fetching sitter profile ID:", error);
      }
    };

    if (user?.id) {
      fetchSitterProfileId();
    }
  }, [user?.id]);

  const handleSave = async () => {
    try {
      if (!sitterProfileId) {
        Alert.alert("Lỗi", "Không thể lấy ID của hồ sơ người chăm sóc.");
        return;
      }

      setIsSaving(true); // Bắt đầu hiển thị ActivityIndicator

      const profileData = {
        sitterId: user?.id,
        bio,
        experience,
        environment,
        skill: selectedSkills.join(","),
        rating: 0,
        profilePictures: profilePictures.map((pic) => ({
          imageName: pic.imageName,
          imageUrl: pic.imageUrl,
        })),
      };

      const endpoint = `/sitter-profiles/${sitterProfileId}`;
      console.log("API Endpoint:", endpoint);
      console.log("Payload Data:", profileData);

      const response = await putData(endpoint, profileData, "PUT");
      console.log("Profile Pictures:", response.data.profilePictures);
      console.log("API Response:", response);

      CustomToast({
        text: "Chỉnh sửa hồ sơ thành công",
        position: 300,
      });

      navigation.navigate("CatSitterProfile");
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response) {
        console.log("Error Response Data:", error.response.data);
        console.log("Error Response Status:", error.response.status);
        console.log("Error Response Headers:", error.response.headers);
      } else {
        console.log("Error Message:", error.message);
      }
      Alert.alert("Lỗi", "Không thể lưu thông tin. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false); // Kết thúc hiển thị ActivityIndicator
    }
  };

  const toggleSkillSelection = (skillId) => {
    const skillName = CatSitterSkill.find(
      (skill) => skill.id === skillId
    )?.skill;

    if (!skillName) return;

    if (selectedSkills.includes(skillName)) {
      setSelectedSkills((prevSkills) =>
        prevSkills.filter((s) => s !== skillName)
      );
    } else if (selectedSkills.length < 6) {
      setSelectedSkills((prevSkills) => [...prevSkills, skillName]);
    } else {
      CustomToast({
        text: "Bạn chỉ có thể chọn tối đa 6 kĩ năng. Vui lòng thử lại.",
        position: 300,
      });
    }
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

        <Text style={styles.headerTitle}>Hồ sơ hoạt động</Text>

        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#902C6C" />
          ) : (
            <Text style={styles.saveText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      <ScrollView
        style={styles.editProfileContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Ảnh của bạn</Text>
        {/* <Text style={styles.sectionSubtitle}>
          Kéo rồi thả ảnh và gợi ý theo thứ tự mà bạn muốn xuất hiện.
        </Text> */}
        <View style={styles.imageListContainer}>
          <FlatList
            data={profilePictures}
            renderItem={renderImage}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleImagePick}>
          <Text style={styles.addButtonText}>Thêm ảnh </Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Tiểu sử của bản thân:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          maxLength={500}
          value={bio}
          onChangeText={(text) => setBio(text)}
          placeholder="Bạn hãy mô tả tiểu sử của bản thân nhé..."
        />
        <Text style={styles.characterCount}>{bio.length} / 500</Text>
        <Text style={styles.sectionTitle}>Kinh nghiệm chăm sóc mèo:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          maxLength={500}
          value={experience}
          onChangeText={(text) => setExperience(text)}
          placeholder="Bạn hãy mô tả kinh nghiệm chăm sóc mèo của bản thân nhé..."
        />
        <Text style={styles.characterCount}>{experience.length} / 500</Text>
        <View style={styles.skillContainer}>
          <Text style={styles.skillText}>Kỹ năng:</Text>
          <View style={styles.skillsGrid}>
            {CatSitterSkill.map((skillItem) => (
              <TouchableOpacity
                key={skillItem.id}
                style={[
                  styles.skillSquareContainer,
                  selectedSkills.includes(skillItem.skill) && {
                    backgroundColor: "#902C6C",
                  },
                ]}
                onPress={() => toggleSkillSelection(skillItem.id)}
              >
                <Text
                  style={[
                    styles.skillTextInside,
                    selectedSkills.includes(skillItem.skill) && {
                      color: "#FFFFFF",
                    },
                  ]}
                >
                  {skillItem.skill}
                </Text>
                {selectedSkills.includes(skillItem.skill) && (
                  <AntDesign name="checkcircleo" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.end}>
          <Text style={styles.sectionTitle}>An toàn, tin cậy & môi trường</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            maxLength={500}
            value={environment}
            onChangeText={(text) => setEnvironment(text)}
            placeholder="Bạn hãy mô tả một ít về khu vực bạn đang sinh sống..."
          />
          <Text style={styles.characterCount}>{environment.length} / 500</Text>
        </View>
      </ScrollView>
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
  skillContainer: {
    marginTop: 16,
  },
  skillText: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "600",
    marginBottom: 8,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skillSquareContainer: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.6)",
    marginBottom: 8,
  },
  skillTextInside: {
    fontSize: 14,
    color: "#000857",
    fontWeight: "bold",
    marginRight: 4,
  },
  end: {
    marginBottom: 50,
  },

  previewProfileContainer: {
    padding: 16,
    // Add more styling and components for previewing profile
  },
});
