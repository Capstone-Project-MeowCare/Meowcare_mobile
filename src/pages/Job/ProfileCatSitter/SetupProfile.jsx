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
import ImageViewing from "react-native-image-viewing";

export default function SetupProfile({ navigation }) {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [environment, setEnvironment] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [profilePictures, setProfilePictures] = useState([]);
  const [sitterProfileId, setSitterProfileId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cagePictures, setCagePictures] = useState([]);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // const renderImage = ({ item, index }) => (
  //   <View style={styles.imageContainer}>
  //     <TouchableOpacity
  //       onPress={() => {
  //         setSelectedImageIndex(index);
  //         setImageViewVisible(true);
  //       }}
  //     >
  //       <Image source={{ uri: item.imageUrl }} style={styles.image} />
  //     </TouchableOpacity>
  //     <TouchableOpacity
  //       style={styles.removeButton}
  //       onPress={() =>
  //         setProfilePictures((prevPictures) =>
  //           prevPictures.filter((pic) => pic.id !== item.id)
  //         )
  //       }
  //     >
  //       <Text style={styles.removeText}>X</Text>
  //     </TouchableOpacity>
  //   </View>
  // );
  // Render ảnh cá nhân
  const renderProfileImage = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        onPress={() => {
          setSelectedImageIndex(index);
          setImageViewVisible(true);
        }}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </TouchableOpacity>
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

  // Render ảnh chuồng
  const renderCageImage = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        onPress={() => {
          setSelectedImageIndex(index);
          setImageViewVisible(true);
        }}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() =>
          setCagePictures((prevPictures) =>
            prevPictures.filter((pic) => pic.id !== item.id)
          )
        }
      >
        <Text style={styles.removeText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const handleImagePick = async (isCagePicture = false) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0];
        if (newImage.uri) {
          const newPicture = {
            id: new Date().getTime().toString(),
            imageName: newImage.uri.split("/").pop(),
            imageUrl: newImage.uri,
            isCargoProfilePicture: isCagePicture, // Đánh dấu loại ảnh
          };

          if (isCagePicture) {
            setCagePictures((prev) => [...prev, newPicture]);
          } else {
            setProfilePictures((prev) => [...prev, newPicture]);
          }
        } else {
          console.error("Invalid image URI.");
        }
      } else {
        console.log("No image selected or assets not available.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  useEffect(() => {
    const fetchSitterProfile = async () => {
      try {
        console.log("Fetching sitter profile ID...");
        const response = await getData(`/sitter-profiles/sitter/${user.id}`);
        console.log("Response from API:", response.data);

        if (response?.data) {
          const profileData = response.data;

          // Lọc các ảnh cá nhân và ảnh chuồng từ profilePictures
          const allPictures = profileData.profilePictures || [];
          const personalPictures = allPictures.filter(
            (pic) => !pic.isCargoProfilePicture
          );
          const cargoPictures = allPictures.filter(
            (pic) => pic.isCargoProfilePicture
          );

          setSitterProfileId(profileData.id || null);
          setBio(profileData.bio || "");
          setExperience(profileData.experience || "");
          setEnvironment(profileData.environment || "");
          setSelectedSkills(
            profileData.skill ? profileData.skill.split(",") : []
          );
          setProfilePictures(personalPictures); // Gán ảnh cá nhân
          setCagePictures(cargoPictures); // Gán ảnh chuồng
        } else {
          console.error("Sitter profile data not found.");
        }
      } catch (error) {
        console.error("Error fetching sitter profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      setIsLoading(true);
      fetchSitterProfile();
    }
  }, [user?.id]);

  // const fetchSitterProfileDetails = async () => {
  //   setIsLoading(true);
  //   try {
  //     if (!sitterProfileId) {
  //       console.error("Sitter profile ID is missing.");
  //       return;
  //     }

  //     console.log("Fetching sitter profile details...");
  //     const response = await getData(`/sitter-profiles/${sitterProfileId}`);

  //     if (response?.data) {
  //       console.log("Sitter profile data fetched:", response.data);

  //       // Cập nhật state với dữ liệu từ API
  //       setBio(response.data.bio || "");
  //       setExperience(response.data.experience || "");
  //       setEnvironment(response.data.environment || "");
  //       setSelectedSkills(
  //         response.data.skill ? response.data.skill.split(",") : []
  //       );
  //       setProfilePictures(response.data.profilePictures || []);
  //     } else {
  //       console.error("No sitter profile data found.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching sitter profile details:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSave = async () => {
    try {
      if (!sitterProfileId) {
        Alert.alert("Lỗi", "Không thể lấy ID của hồ sơ người chăm sóc.");
        return;
      }

      setIsSaving(true);

      const uploadedPictures = await Promise.all(
        [...profilePictures, ...cagePictures].map(async (pic) => {
          if (!pic.imageUrl.startsWith("https://")) {
            const imageUrl = await firebaseImg(pic.imageUrl);
            return { ...pic, imageUrl };
          }
          return pic;
        })
      );

      const sanitizedPictures = uploadedPictures.map(
        ({ id, imageUrl, imageName, isCargoProfilePicture, description }) => ({
          imageUrl,
          imageName,
          isCargoProfilePicture: isCargoProfilePicture || false,
          description: description || "",
        })
      );

      // Dữ liệu payload
      const profileData = {
        sitterId: user?.id,
        bio,
        experience,
        skill: selectedSkills.join(","),
        environment,
        maximumQuantity: 0,
        status: 0,
        profilePictures: sanitizedPictures, // Danh sách ảnh đã được chuẩn hóa
      };

      console.log("Payload gửi đến API:", JSON.stringify(profileData, null, 2));

      const response = await putData(
        `/sitter-profiles/${sitterProfileId}`,
        profileData,
        "PUT"
      );

      console.log("Phản hồi từ API sau khi lưu:", response);

      CustomToast({
        text: "Chỉnh sửa hồ sơ thành công",
        position: 300,
      });

      navigation.navigate("CatSitterProfile");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Lỗi", "Không thể lưu thông tin. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
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
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#902C6C" />
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
            renderItem={renderProfileImage}
            keyExtractor={(item) => item.id}
            horizontal
          />
          <ImageViewing
            images={profilePictures.map((pic) => ({ uri: pic.imageUrl }))}
            imageIndex={selectedImageIndex}
            visible={isImageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleImagePick(false)}
        >
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
        <View style={styles.end}>
          {/* Setup thông tin chuồng cho cat sitter */}
          <Text style={styles.sectionTitle}>Thông tin chuồng gửi mèo</Text>
          <View style={styles.row}>
            <Text style={styles.labelText}>
              Số lượng chuồng dành cho mèo cưng:
            </Text>
            <TextInput
              style={styles.inputNumber}
              keyboardType="number-pad"
              maxLength={2} // Giới hạn nhập số ký tự
              placeholder="Nhập số lượng"
              // value={catCapacity} // Bạn có thể sử dụng state để lưu số lượng mèo
              // onChangeText={(text) => setCatCapacity(text)}
            />
          </View>
          <Text style={styles.CageTitle}>Ảnh chuồng cho mèo cưng:</Text>
          <View style={styles.imageListContainer}>
            <FlatList
              data={cagePictures}
              renderItem={renderCageImage}
              keyExtractor={(item) => item.id}
              horizontal
            />

            <ImageViewing
              images={profilePictures.map((pic) => ({ uri: pic.imageUrl }))}
              imageIndex={selectedImageIndex}
              visible={isImageViewVisible}
              onRequestClose={() => setImageViewVisible(false)}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleImagePick(true)}
          >
            <Text style={styles.addButtonText}>Thêm ảnh chuồng</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            maxLength={500}
            // value={cage}
            // onChangeText={(text) => setCage(text)}
            placeholder="Vui lòng mô tả không gian và số lượng chuồng nuôi mèo của bạn."
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
  CageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: 8,
    marginTop: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  inputNumber: {
    width: 100,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
});
