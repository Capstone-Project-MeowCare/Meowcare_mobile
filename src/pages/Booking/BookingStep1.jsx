import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function BookingStep1({ step1Info, setStep1Info, setIsValid }) {
  const navigation = useNavigation();
  // Kiểm tra tính hợp lệ của form
  const validateForm = () => {
    let isValidForm = true;

    // Nếu checkbox "Dịch vụ đưa đón mèo" được chọn nhưng chưa chọn location
    if (
      step1Info.isChecked &&
      step1Info.selectedLocation === "Tỉnh/Thành phố"
    ) {
      isValidForm = false;
    }

    // Nếu checkbox "Thức ăn theo yêu cầu" được chọn nhưng chưa nhập customFood
    if (step1Info.isCustomFoodChecked && step1Info.customFood.trim() === "") {
      isValidForm = false;
    }

    setIsValid(isValidForm);
  };

  // Gọi validateForm mỗi khi trạng thái thay đổi
  useEffect(() => {
    validateForm();
  }, [step1Info]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("SitterServicePage")}
        >
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

      <View style={styles.mainContent}>
        <Text style={styles.label}>Chọn dịch vụ</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={step1Info.selectedService}
            onValueChange={(itemValue) =>
              setStep1Info({ ...step1Info, selectedService: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item
              label="Gửi thú cưng tại nhà người chăm sóc"
              value="Gửi thú cưng tại nhà người chăm sóc"
            />
            <Picker.Item
              label="Trông thú cưng tại nhà người chăm sóc"
              value="Trông thú cưng tại nhà người chăm sóc"
            />
            <Picker.Item
              label="Trông thú cưng tại nhà bạn"
              value="Trông thú cưng tại nhà bạn"
            />
          </Picker>
        </View>

        <Text style={styles.label}>Chọn thức ăn cho mèo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={step1Info.selectedFood}
            onValueChange={(itemValue) =>
              setStep1Info({ ...step1Info, selectedFood: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item
              label="NATURAL CORE Bene Chicken Salmon"
              value="NATURAL CORE Bene Chicken Salmon"
            />
            <Picker.Item
              label="Royal Canin Kitten"
              value="Royal Canin Kitten"
            />
            <Picker.Item label="Me-O Tuna Flavour" value="Me-O Tuna Flavour" />
            <Picker.Item label="Whiskas Mackerel" value="Whiskas Mackerel" />
            <Picker.Item
              label="Felix Sensations Jellies"
              value="Felix Sensations Jellies"
            />
          </Picker>
        </View>

        <Text style={styles.label}>Dịch vụ thêm có phí</Text>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={step1Info.isChecked}
            onValueChange={(value) =>
              setStep1Info({ ...step1Info, isChecked: value })
            }
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Dịch vụ đưa đón mèo (1-10km)</Text>
        </View>

        <View
          style={[
            styles.pickerContainer,
            !step1Info.isChecked && styles.disabledPickerContainer,
          ]}
        >
          <Picker
            selectedValue={step1Info.selectedLocation}
            onValueChange={(itemValue) =>
              setStep1Info({ ...step1Info, selectedLocation: itemValue })
            }
            style={styles.picker}
            enabled={step1Info.isChecked}
          >
            <Picker.Item
              label="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
              value="Tỉnh/Thành phố"
            />
            <Picker.Item
              label="Tp.HCM, Quận 1, Phường 1"
              value="Tp.HCM, Quận 1, Phường 1"
            />
            <Picker.Item
              label="Tp.HCM, Quận 2, Phường 2"
              value="Tp.HCM, Quận 2, Phường 2"
            />
            <Picker.Item
              label="Hà Nội, Quận Ba Đình, Phường Trúc Bạch"
              value="Hà Nội, Quận Ba Đình, Phường Trúc Bạch"
            />
          </Picker>
        </View>

        <TextInput
          style={[
            styles.textInput,
            !step1Info.isChecked && styles.disabledTextInput,
          ]}
          placeholder="Tên đường, Tòa nhà, Số nhà"
          editable={step1Info.isChecked}
          value={step1Info.customFood}
          onChangeText={(text) =>
            setStep1Info({ ...step1Info, customFood: text })
          }
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={step1Info.isCustomFoodChecked}
            onValueChange={(value) =>
              setStep1Info({ ...step1Info, isCustomFoodChecked: value })
            }
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Thức ăn theo yêu cầu</Text>
        </View>

        <TextInput
          style={[
            styles.textInput,
            !step1Info.isCustomFoodChecked && styles.disabledTextInput,
          ]}
          placeholder="Nhập loại thức ăn cụ thể"
          editable={step1Info.isCustomFoodChecked}
          value={step1Info.customFood}
          onChangeText={(text) =>
            setStep1Info({ ...step1Info, customFood: text })
          }
        />
      </View>
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
    width: "20%",
    height: "100%",
    backgroundColor: "#902C6C",
  },
  separator: {
    width: width,
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.013,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: height * 0.05,
  },
  label: {
    fontSize: 18,
    color: "#000857",
    fontWeight: "bold",
    marginBottom: height * 0.015,
    textAlign: "left",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    marginBottom: height * 0.03,
    marginTop: height * 0.018,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  disabledPickerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  checkbox: {
    width: 25,
    height: 25,
    marginRight: width * 0.02,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000857",
    fontWeight: "bold",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    padding: 10,
    marginBottom: height * 0.03,
    marginTop: height * 0.014,
  },
  disabledTextInput: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
