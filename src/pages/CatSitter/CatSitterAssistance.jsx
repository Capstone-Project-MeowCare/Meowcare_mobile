import React, { useState } from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CatSitterCalendarSetting from "./CatSitterCalendarSetting";
import { Picker } from "@react-native-picker/picker";
import { HeadingSubscriber } from "expo-location/build/LocationSubscribers";

const { width, height } = Dimensions.get("window");

const ServiceItem = ({
  image,
  mainText,
  subText,
  price,
  extraStyle,
  showSubText = true,
  useNewStyle = false, // Thêm cờ để áp dụng style mới cho các text cần đẩy lên
}) => (
  <View style={[styles.serviceContainer, extraStyle]}>
    <View style={styles.iconAndTextContainer}>
      {image && <Image source={image} style={styles.serviceImage} />}
      <View style={styles.textContainer}>
        <View style={styles.textAndIcon}>
          <Text style={useNewStyle ? styles.newMainText : styles.mainText}>
            {mainText}
          </Text>
          <Ionicons
            name="information-circle-outline"
            size={width * 0.05}
            color="#000"
            style={useNewStyle ? styles.newIconStyle : {}}
          />
        </View>
        {showSubText && <Text style={styles.subText}>{subText}</Text>}
      </View>
    </View>
    <View style={styles.priceContainer}>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.perNight}>mỗi đêm</Text>
    </View>
  </View>
);

const ExtraServiceItem = ({ image, mainText, price }) => (
  <View style={styles.extraServiceContainer}>
    <View style={styles.iconAndTextContainer}>
      <Image source={image} style={styles.extraServiceImage} />
      <Text style={styles.mainText}>{mainText}</Text>
    </View>
    <View style={styles.priceContainer}>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.perNight}>một lần</Text>
    </View>
  </View>
);

export default function CatSitterAssistance({}) {
  const [selectedOption, setSelectedOption] = useState("petSitting");
  const availableDays = {
    "2024-10-01": { selected: true, selectedColor: "#BAE8C9" },
    "2024-10-02": { selected: true, selectedColor: "#BAE8C9" },
    "2024-10-03": { selected: true, selectedColor: "#BAE8C9" },
    "2024-10-04": { selected: true, selectedColor: "#BAE8C9" },
  };

  const busyDays = {
    "2024-10-10": { selected: true, selectedColor: "#D9D9D9" },
    "2024-10-11": { selected: true, selectedColor: "#D9D9D9" },
    "2024-10-12": { selected: true, selectedColor: "#D9D9D9" },
    "2024-10-13": { selected: true, selectedColor: "#D9D9D9" },
    "2024-10-14": { selected: true, selectedColor: "#D9D9D9" },
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dịch vụ</Text>

      <ServiceItem
        image={require("../../../assets/Vector.png")}
        mainText="Gửi thú cưng"
        subText="Tại nhà người chăm sóc"
        price="100.000đ"
      />
      <ServiceItem
        mainText="Ngày lễ"
        price="150.000đ"
        extraStyle={styles.holidayContainer}
        showSubText={false}
        useNewStyle={true}
      />
      <ServiceItem
        mainText="Thêm mèo"
        price="+ 50.000đ"
        extraStyle={styles.holidayContainer}
        showSubText={false}
        useNewStyle={true}
      />
      <ServiceItem
        image={require("../../../assets/Vector1.png")}
        mainText="Trông tại nhà"
        subText="Tại nhà bạn"
        price="150.000đ"
      />
      <ServiceItem
        mainText="Ngày lễ"
        price="250.000đ"
        extraStyle={styles.holidayContainer}
        showSubText={false}
        useNewStyle={true}
      />
      <ServiceItem
        mainText="Nhiều mèo"
        price="+ 150.000đ"
        extraStyle={styles.holidayContainer}
        showSubText={false}
        useNewStyle={true}
      />

      <View style={styles.separator} />

      <Text style={styles.text1}>Dịch vụ thêm có phí</Text>

      <ExtraServiceItem
        image={require("../../../assets/Check1.png")}
        mainText="Dịch vụ đưa đón mèo"
        price="50.000đ"
      />
      <ExtraServiceItem
        image={require("../../../assets/Check1.png")}
        mainText="Chải lông mèo"
        price="50.000đ"
      />
      <ExtraServiceItem
        image={require("../../../assets/Check1.png")}
        mainText="Vệ sinh tai và mắt"
        price="20.000đ"
      />
      <ExtraServiceItem
        image={require("../../../assets/Check1.png")}
        mainText="Cắt móng"
        price="20.000đ"
      />
      <Text style={styles.readMoreText}>Đọc thêm</Text>
      <View style={styles.separator} />
      <Text style={styles.text1}>Lịch</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedOption}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedOption(itemValue)}
        >
          <Picker.Item label="Gửi thú cưng" value="petSitting" />
          <Picker.Item label="Trông tại nhà" value="homeCare" />
          <Picker.Item label="Cắt móng" value="nailCutting" />
          <Picker.Item label="Vệ sinh tai và mắt" value="earEyeCleaning" />
        </Picker>
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.squareContainer}>
          <View style={[styles.square, { backgroundColor: "#BAE8C9" }]} />
          <Text style={styles.squareText}>Thời gian rảnh</Text>
        </View>
        <View style={styles.squareContainer}>
          <View style={[styles.square, { backgroundColor: "#D9D9D9" }]} />
          <Text style={styles.squareText}>Thời gian bận</Text>
        </View>
      </View>
      <CatSitterCalendarSetting
        availableDays={availableDays}
        busyDays={busyDays}
      />
      <View style={styles.footerTextContainer}>
        <Text style={styles.updateText}>Lịch được cập nhật 1 ngày trước</Text>
        <View style={styles.policyTextContainer}>
          <Text style={styles.policyText}>
            Chính sách hủy lịch của MeowCare.
          </Text>
          <Text style={styles.readMoreText1}>Đọc thêm</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: height * 0.0,
    paddingVertical: height * 0.01,
  },
  text: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: -height * 0.02,
  },
  text1: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: height * 0.02,
  },
  readMoreText: {
    textAlign: "left",
    fontSize: width * 0.037,
    color: "#3060A7",
    fontWeight: "600",
    marginTop: height * 0.02,
    textDecorationLine: "underline",
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02,
    width: "100%",
  },
  holidayContainer: {
    paddingLeft: width * 0.13,
  },
  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceImage: {
    width: width * 0.1,
    height: height * 0.05,
    resizeMode: "contain",
    marginRight: width * 0.03,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    minHeight: height * 0.07,
  },
  textAndIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#000857",
    marginRight: width * 0.02,
  },
  newMainText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#000857",
    marginRight: width * 0.02,
    marginBottom: height * 0.02,
  },
  newIconStyle: {
    marginBottom: height * 0.02,
  },
  subText: {
    fontSize: width * 0.035,
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "600",
  },
  priceContainer: {
    alignItems: "center",
  },
  price: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#2B764F",
  },
  perNight: {
    fontSize: width * 0.035,
    color: "rgba(0, 8, 87, 0.6)",
    fontWeight: "600",
  },
  separator: {
    width: width * 0.9,
    height: 1,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginTop: height * 0.02,
    right: height * 0.02,
  },
  extraServiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02,
    width: "100%",
  },
  extraServiceImage: {
    width: width * 0.1,
    height: height * 0.05,
    resizeMode: "contain",
    marginRight: width * 0.03,
  },
  pickerContainer: {
    width: width * 0.9,
    alignSelf: "center",
    marginTop: height * 0.01,
    backgroundColor: "#FFF6ED",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    right: height * 0.02,
  },
  picker: {
    height: height * 0.05,
    width: "100%",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02,
    width: width * 0.9,
    alignSelf: "center",
    right: height * 0.02,
  },
  squareContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  square: {
    width: width * 0.035,
    height: width * 0.035,
    marginRight: width * 0.02,
  },
  squareText: {
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
  },
  footerTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.03,
  },
  updateText: {
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "500",
    marginBottom: height * 0.01,
  },
  policyTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  policyText: {
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "500",
  },
  readMoreText1: {
    textAlign: "left",
    fontSize: width * 0.037,
    color: "#3060A7",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
