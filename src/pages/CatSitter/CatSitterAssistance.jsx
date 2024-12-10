import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CatSitterCalendarSetting from "./CatSitterCalendarSetting";
import { Picker } from "@react-native-picker/picker";
import { getData } from "../../api/api";

const { width, height } = Dimensions.get("window");

const ServiceItem = ({ image, mainText, price }) => (
  <View style={styles.serviceContainer}>
    <View style={styles.iconAndTextContainer}>
      {image && <Image source={image} style={styles.serviceImage} />}
      <Text style={styles.mainText}>{mainText}</Text>
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

export default function CatSitterAssistance({ id }) {
  const [mainServices, setMainServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Fetching services for sitter id:", id);
        const response = await getData(`/services/sitter/${id}`);

        // Kiểm tra status trả về từ API
        if (response?.status === 1000 && Array.isArray(response.data)) {
          const services = response.data;

          // Lọc và xử lý các dịch vụ
          const mains = services
            .filter(
              (service) =>
                service.serviceType === "MAIN_SERVICE" &&
                service.status === "ACTIVE"
            )
            .map((service) => ({
              name: service.name,
              price: service.price,
            }));

          const additionals = services
            .filter(
              (service) =>
                service.serviceType === "ADDITION_SERVICE" &&
                service.status === "ACTIVE"
            )
            .map((service) => ({
              name: service.name,
              price: service.price,
            }));

          console.log("Filtered main services:", mains);
          console.log("Filtered additional services:", additionals);

          setMainServices(mains);
          setAdditionalServices(additionals);
        } else {
          console.warn("Invalid API response format or status:", response);
        }
      } catch (error) {
        console.error("Error fetching sitter services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServices();
    } else {
      // console.warn("No sitter ID provided.");
      setLoading(false);
    }
  }, [id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : (
        <>
          {/* Render loại dịch vụ  */}
          <Text style={styles.text}>Loại dịch vụ</Text>
          {mainServices.length > 0 ? (
            mainServices.map((service, index) => (
              <ServiceItem
                key={index} // Vì dữ liệu chỉ chứa name và price, dùng index làm key
                image={require("../../../assets/Vector.png")}
                mainText={service.name}
                price={`${service.price}đ`}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>Không có dịch vụ</Text>
          )}

          <View style={styles.separator} />

          {/* Render Dịch vụ phụ */}
          <Text style={styles.text1}>Dịch vụ</Text>
          {additionalServices.length > 0 ? (
            additionalServices.map((service, index) => (
              <ExtraServiceItem
                key={index}
                image={require("../../../assets/Check1.png")}
                mainText={service.name}
                price={`${service.price}đ`}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>Không có dịch vụ phụ</Text>
          )}

          <View style={styles.separator} />

          {/* Lịch */}
          <Text style={styles.text1}>Lịch</Text>
          <CatSitterCalendarSetting
            availableDays={availableDays}
            busyDays={busyDays}
          />

          {/* Chính sách và thông tin cập nhật */}
          <View style={styles.footerTextContainer}>
            <Text style={styles.updateText}>
              Lịch được cập nhật 1 ngày trước
            </Text>
            <View style={styles.policyTextContainer}>
              <Text style={styles.policyText}>
                Chính sách hủy lịch của MeowCare.
              </Text>
              <Text style={styles.readMoreText1}>Đọc thêm</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    alignItems: "flex-start", // Căn giữa theo chiều ngang
    justifyContent: "flex-start", // Căn giữa theo chiều dọc
    marginRight: -20,
  },
  text: {
    textAlign: "center", // Đặt text chính giữa
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
  },
  mainText: {
    width: 200,
    fontSize: 16,
    fontWeight: "600",
  },
  text1: {
    textAlign: "center", // Đặt text chính giữa
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: height * 0.02,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Đưa toàn bộ container về bên trái
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.02,
  },

  extraServiceContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Đưa toàn bộ container về bên trái
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.02,
  },
  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center", // Đảm bảo icon và text cùng hàng
    justifyContent: "flex-start", // Đưa icon và text về bên trái
    marginRight: 20, // Khoảng cách giữa các thành phần
  },
  serviceImage: {
    width: width * 0.1,
    height: height * 0.05,
    resizeMode: "contain",
    MarginLeft: 20,
  },
  extraServiceImage: {
    width: width * 0.1,
    height: height * 0.05,
    resizeMode: "contain",
    marginRight: width * 0.03,
  },

  priceContainer: {
    flex: 1,
    alignItems: "flex-end",
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
    width: "90%", // Đảm bảo phần separator không tràn màn hình
    height: 1,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  footerTextContainer: {
    alignItems: "center", // Căn giữa nội dung trong footer
    marginTop: height * 0.03,
  },
  updateText: {
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "500",
    marginBottom: height * 0.01,
    textAlign: "center",
  },
  policyTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  policyText: {
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "500",
    textAlign: "center",
  },
  readMoreText1: {
    fontSize: width * 0.037,
    color: "#3060A7",
    fontWeight: "600",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
