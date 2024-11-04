import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firebaseImgForPet } from "../../api/firebaseImg";

const { width, height } = Dimensions.get("window");

export default function CreatePetStep7({ onGoBack, step7Info, setStep7Info }) {
  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0];

        // Upload ảnh lên Firebase Storage
        const imageUrl = await firebaseImgForPet(newImage.uri);

        if (imageUrl) {
          setStep7Info((prev) => ({ ...prev, profilePicture: imageUrl })); // Lưu URL Firebase vào state
        }
      } else {
        console.log("No image selected or assets not available");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
  // const handleImagePick = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: false,
  //       quality: 1,
  //     });

  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       const newImage = result.assets[0];
  //       setStep7Info((prev) => ({ ...prev, profilePicture: newImage.uri })); // Lưu URI của ảnh vào state profilePicture
  //     } else {
  //       console.log("No image selected or assets not available");
  //     }
  //   } catch (error) {
  //     console.error("Error picking image:", error);
  //   }
  // };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
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
          {step7Info.profilePicture ? (
            <Image
              source={{ uri: step7Info.profilePicture }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.addButtonText}>+</Text>
          )}
        </TouchableOpacity>
      </View>
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
});
