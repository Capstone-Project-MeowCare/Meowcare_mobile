import React, { useState } from "react";
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

const { width, height } = Dimensions.get("window");

export default function BookingStep1({ navigation }) {
  const [selectedService, setSelectedService] = useState(
    "Gửi thú cưng tại nhà người chăm sóc"
  );
  const [selectedFood, setSelectedFood] = useState(
    "NATURAL CORE Bene Chicken Salmon"
  );
  const [isChecked, setIsChecked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Tỉnh/Thành phố");
  const [isCustomFoodChecked, setIsCustomFoodChecked] = useState(false);
  const [customFood, setCustomFood] = useState("");

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
            selectedValue={selectedService}
            onValueChange={(itemValue) => setSelectedService(itemValue)}
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
            selectedValue={selectedFood}
            onValueChange={(itemValue) => setSelectedFood(itemValue)}
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
            value={isChecked}
            onValueChange={setIsChecked}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Dịch vụ đưa đón mèo (1-10km)</Text>
        </View>

        <View
          style={[
            styles.pickerContainer,
            !isChecked && styles.disabledPickerContainer,
          ]}
        >
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
            style={styles.picker}
            enabled={isChecked}
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
          style={[styles.textInput, !isChecked && styles.disabledTextInput]}
          placeholder="Tên đường, Tòa nhà, Số nhà"
          editable={isChecked}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isCustomFoodChecked}
            onValueChange={setIsCustomFoodChecked}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Thức ăn theo yêu cầu</Text>
        </View>

        <TextInput
          style={[
            styles.textInput,
            !isCustomFoodChecked && styles.disabledTextInput,
          ]}
          placeholder="Nhập loại thức ăn cụ thể"
          editable={isCustomFoodChecked}
          value={customFood}
          onChangeText={setCustomFood}
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
});
