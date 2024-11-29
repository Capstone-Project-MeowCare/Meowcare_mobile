import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firebaseImgForPet } from "../../api/firebaseImg";
import { useRoute, useNavigation } from "@react-navigation/native";
import { putData } from "../../api/api";

const { width, height } = Dimensions.get("window");

export default function CreatePetStep7({
  onGoBack,
  step7Info = { profilePicture: "" },
  setStep7Info = () => {},
}) {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    profilePicture: initialProfilePicture,
    isUpdating,
    petId,
  } = route.params || {};
  const [profilePicture, setProfilePicture] = useState(
    initialProfilePicture || step7Info.profilePicture || ""
  );

  useEffect(() => {
    if (isUpdating && initialProfilePicture) {
      setProfilePicture(initialProfilePicture);
    }
  }, [initialProfilePicture, isUpdating]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền bị từ chối",
        "Ứng dụng cần quyền truy cập vào thư viện ảnh của bạn để tiếp tục."
      );
      return false;
    }
    return true;
  };

  const handleImagePick = async () => {
    try {
      // Kiểm tra quyền trước khi truy cập
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0];
        const imageUrl = await firebaseImgForPet(newImage.uri);

        if (imageUrl) {
          setProfilePicture(imageUrl);
          setStep7Info((prev) => ({ ...prev, profilePicture: imageUrl }));
        }
      } else {
        console.log("No image selected or assets not available");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const updateProfilePicture = async () => {
    try {
      await putData(`/pet-profiles/${petId}`, { profilePicture });
      navigation.navigate("PetProfile", { petId });
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={isUpdating ? () => navigation.goBack() : onGoBack}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Mèo của tôi</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Hình ảnh dễ thương cho mèo của bạn</Text>
        <Text style={styles.subText}>
          Hãy khoe sự đáng yêu của thú cưng của bạn. Điều này sẽ khiến thú cưng
          của bạn trở nên không thể cưỡng lại đối với những người chăm sóc thú
          cưng sắp đón nhận chúng.
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={handleImagePick}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.image} />
          ) : (
            <Text style={styles.addButtonText}>+</Text>
          )}
        </TouchableOpacity>
      </View>

      {isUpdating && (
        <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !profilePicture && styles.disabledButton,
            ]}
            onPress={updateProfilePicture}
            disabled={!profilePicture}
          >
            <Text
              style={[
                styles.nextText,
                !profilePicture && styles.disabledNextText,
              ]}
            >
              Đổi
            </Text>
          </TouchableOpacity>
        </View>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: height * 0.05,
  },
  title: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.015,
    textAlign: "left",
  },
  subText: {
    fontSize: 14,
    color: "#000857",
    textAlign: "left",
    marginBottom: height * 0.015,
  },
  addButton: {
    width: width * 0.38,
    height: height * 0.18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginTop: height * 0.02,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: height * 0.1,
    color: "#902C6C",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  fixedFooter: {
    width: width,
    height: height * 0.067,
    backgroundColor: "#FFE3D5",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  nextButton: {
    width: width,
    height: height * 0.067,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE3D5",
  },
  nextText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
  },
  disabledButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  disabledNextText: {
    color: "rgba(0, 8, 87, 0.5)",
  },
});
