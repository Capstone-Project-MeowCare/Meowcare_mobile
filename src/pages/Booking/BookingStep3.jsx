import Checkbox from "expo-checkbox";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { getData } from "../../api/api";
import { useAuth } from "../../../auth/useAuth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function BookingStep3({
  onGoBack,
  setIsValid,
  step3Info,
  setStep3Info,
  step1Info,
}) {
  const { user } = useAuth();
  const [catData, setCatData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const navigation = useNavigation();
  const isSingleCatMode = step1Info.selectedServiceId === "OTHER_SERVICES";
  const fetchCatData = async () => {
    try {
      const response = await getData(`/pet-profiles/user/${user.id}`);
      if (response?.data) {
        // Lọc chỉ những thú cưng có trạng thái ACTIVE
        const activeCats = response.data.filter(
          (cat) => cat.status === "ACTIVE"
        );
        setCatData(activeCats);
      }
    } catch (error) {
      console.error("Error fetching cat data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchCatData();
    }, [])
  );
  // const handleSelectCat = (cat) => {
  //   if (
  //     step3Info.selectedCats.some((selectedCat) => selectedCat.id === cat.id)
  //   ) {
  //     setStep3Info({
  //       ...step3Info,
  //       selectedCats: step3Info.selectedCats.filter(
  //         (selectedCat) => selectedCat.id !== cat.id
  //       ),
  //     });
  //   } else {
  //     setStep3Info({
  //       ...step3Info,
  //       selectedCats: [...step3Info.selectedCats, cat],
  //     });
  //   }
  // };

  // const isCatSelected = (catId) => {
  //   return step3Info.selectedCats.some(
  //     (selectedCat) => selectedCat.id === catId
  //   );
  // };
  const handleSelectCat = (cat) => {
    if (isSingleCatMode) {
      // Chế độ chỉ chọn 1 mèo
      if (
        step3Info.selectedCats.length > 0 &&
        step3Info.selectedCats[0].id === cat.id
      ) {
        // Nếu mèo đã được chọn, bỏ chọn
        setStep3Info({ ...step3Info, selectedCats: [] });
      } else {
        // Nếu chưa chọn, đặt mèo mới
        setStep3Info({ ...step3Info, selectedCats: [cat] });
      }
    } else {
      // Chế độ chọn nhiều mèo
      if (
        step3Info.selectedCats.some((selectedCat) => selectedCat.id === cat.id)
      ) {
        setStep3Info({
          ...step3Info,
          selectedCats: step3Info.selectedCats.filter(
            (selectedCat) => selectedCat.id !== cat.id
          ),
        });
      } else {
        setStep3Info({
          ...step3Info,
          selectedCats: [...step3Info.selectedCats, cat],
        });
      }
    }
  };

  const isCatSelected = (catId) => {
    return step3Info.selectedCats.some(
      (selectedCat) => selectedCat.id === catId
    );
  };

  useEffect(() => {
    setIsValid(step3Info.selectedCats.length > 0);
  }, [step3Info.selectedCats]);

  return (
    <GestureRecognizer
      onSwipeRight={onGoBack}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#902C6C" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Chọn bé mèo của bạn</Text>

          <View style={styles.catContainerRow}>
            {catData.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catContainer}
                onPress={() => handleSelectCat(cat)}
              >
                <Image
                  source={{
                    uri: cat.profilePicture,
                  }}
                  style={styles.catImage}
                />

                {!isCatSelected(cat.id) && <View style={styles.overlay} />}

                {isCatSelected(cat.id) && (
                  <View style={styles.checkMarkContainer}>
                    <View style={styles.circle}>
                      <Image
                        source={require("../../../assets/Check1.png")}
                        style={styles.checkImage}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.catFooter}>
                  <View style={styles.catTextContainer}>
                    <Text style={styles.catName}>{cat.petName}</Text>
                    <Text style={styles.catBreed}>{cat.breed}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.newContainerWrapper}>
            <TouchableOpacity
              style={styles.catContainer}
              onPress={() => navigation.navigate("CreatePet")}
            >
              <Image
                source={require("../../../assets/image89.png")}
                style={styles.catImage}
              />
              <View style={styles.catFooter1}>
                <Text style={styles.addCatText}>Thêm thú cưng</Text>
                <Text style={styles.addCatHintText}>
                  Nhấn vào đây để thêm thú cưng
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.insuranceContainer}>
            <View style={styles.insuranceRow}>
              <Checkbox
                value={step3Info.isChecked}
                onValueChange={(value) =>
                  setStep3Info({ ...step3Info, isChecked: value })
                }
                style={styles.checkbox}
              />
              <Text style={styles.insuranceText}>
                Bảo hiểm Thiệt hại Thú cưng
              </Text>
              <Text style={styles.insurancePrice}>5.000đ x 1</Text>
            </View>
            <Text style={styles.insuranceDescription}>
              Bảo vệ thú cưng được bảo hiểm khỏi thiệt hại do sự cố bất ngờ, sự
              cố liên quan đến thú cưng có giá trị cao
            </Text>
            <Text style={styles.learnMoreText}>Tìm hiểu thêm</Text>
          </View>
        </ScrollView>
      )}
    </GestureRecognizer>
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
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    justifyContent: "flex-start",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    width: width * 0.7,
    height: 8,
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#902C6C",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginVertical: height * 0.02,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05,
  },
  label: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.015,
    textAlign: "left",
  },
  catContainerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  catContainer: {
    width: width * 0.4,
    height: height * 0.25,
    backgroundColor: "#FFFAF5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "flex-end",
    marginBottom: height * 0.02,
    position: "relative",
  },
  checkMarkContainer: {
    position: "absolute",
    top: height * 0.13,
    right: height * 0.006,
  },
  catImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(216, 216, 216, 0.6)",
    borderRadius: 10,
  },
  newContainerWrapper: {
    marginTop: height * 0.04,
    width: width * 0.9,
    alignSelf: "center",
  },
  catFooter: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: height * 0.01,
    borderBottomRightRadius: height * 0.01,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: height * 0.01,
  },
  catFooter1: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: height * 0.01,
    borderBottomRightRadius: height * 0.01,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: height * 0.01,
  },
  catTextContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  catName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "center",
    marginLeft: height * 0.03,
  },
  catBreed: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginTop: height * 0.002,
    color: "#000857",
    marginLeft: height * 0.03,
  },
  circle: {
    width: 31,
    height: 31,
    borderRadius: 31 / 2,
    backgroundColor: "#FFE3D5",
    justifyContent: "center",
    alignItems: "center",
  },
  checkImage: {
    width: 31,
    height: 31,
    resizeMode: "contain",
  },
  addCatText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "center",
  },
  addCatHintText: {
    fontSize: 12,
    color: "#000857",
    textAlign: "center",
    marginTop: height * 0.001,
  },
  insuranceContainer: {
    width: width * 0.9,
    height: height * 0.2,
    backgroundColor: "rgba(255, 227, 213, 0.5)",
    borderRadius: 10,
    padding: height * 0.02,
    alignSelf: "center",
  },
  insuranceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  insuranceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    marginLeft: width * 0.02,
  },
  insurancePrice: {
    fontSize: 14,
    color: "#000",
  },
  insuranceDescription: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: height * 0.005,
  },
  learnMoreText: {
    color: "rgba(48,96,167,0.6)",
    textDecorationLine: "underline",
    fontSize: 12,
    marginTop: height * 0.01,
  },
});
