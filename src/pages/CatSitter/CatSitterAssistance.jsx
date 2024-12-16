import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
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
      <Text style={styles.perNight}>mỗi ngày</Text>
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
  const [childServices, setChildServices] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [sitterProfile, setSitterProfile] = useState();
  const [expandedServices, setExpandedServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
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

  const formatTime = (time) => {
    if (time.includes(":")) {
      return time.split(":").slice(0, 2).join(":");
    }
    return time;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getData(`/services/sitter/${id}`);
        // const reponseSitter = await getData(`/sitter-profiles/${id}`);
        if (response?.status === 1000 && Array.isArray(response.data)) {
          const services = response.data;

          const mains = services
            .filter(
              (service) =>
                service.serviceType === "MAIN_SERVICE" &&
                service.status === "ACTIVE"
            )
            .map((service) => ({
              id: service.id,
              name: service.name,
              price: service.price.toLocaleString("vi-VN"),
            }));

          const additionals = services
            .filter(
              (service) =>
                service.serviceType === "ADDITION_SERVICE" &&
                service.status === "ACTIVE"
            )
            .map((service) => ({
              id: service.id,
              name: service.name,
              price: service.price.toLocaleString("vi-VN"),
            }));

          const children = services
            .filter(
              (service) =>
                service.serviceType === "CHILD_SERVICE" &&
                service.status === "ACTIVE"
            )
            .map((child) => ({
              id: child.id,
              name: child.name,
              startTime: formatTime(child.startTime),
              endTime: formatTime(child.endTime),
            }));

          setMainServices(mains);
          setAdditionalServices(additionals);
          setChildServices(children);
        }
        // if(reponseSitter?.status === 1000){
        //   setSitterProfile(reponseSitter.data)
        // }
      } catch (error) {
        console.error("Error fetching sitter services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServices();
    }
  }, [id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : (
        <>
          {/* Render loại dịch vụ */}
          <Text style={styles.text}>Loại dịch vụ</Text>
          {mainServices.length > 0 ? (
            mainServices.map((service) => (
              <View key={service.id} style={styles.serviceItem}>
                {/* Hiển thị dịch vụ chính */}
                <TouchableOpacity
                  onPress={() =>
                    setSelectedServiceId(
                      selectedServiceId === service.id ? null : service.id
                    )
                  }
                  activeOpacity={0.7}
                >
                  {/* Truyền đúng giá trị price */}
                  <ServiceItem
                    image={require("../../../assets/Vector.png")}
                    mainText={service.name}
                    price={`${service.price}đ`} // Giá trị chính xác được truyền từ mainServices
                  />
                </TouchableOpacity>

                {/* Hiển thị dịch vụ con (lịch trình) nếu được chọn */}
                {selectedServiceId === service.id && (
                  <View style={styles.childServicesContainer}>
                    <Text style={styles.titlesecond}>
                      Lịch trình chăm sóc dự kiến:
                    </Text>
                    {childServices.length > 0 ? (
                      childServices.map((child) => (
                        <View key={child.id} style={styles.scheduleItem}>
                          <View style={styles.dotAndTime}>
                            <View style={styles.dot} />
                            {/* Hiển thị startTime - endTime: name */}
                            <Text style={styles.scheduleTime}>
                              {child.startTime} - {child.endTime}:{" "}
                              <Text style={styles.scheduleActivity}>
                                {child.name}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noChildServices}>
                        Không có lịch trình.
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Không có dịch vụ</Text>
          )}

          <View style={styles.separator} />

          {/* Render Dịch vụ phụ */}
          <Text style={styles.text1}>Dịch vụ phụ</Text>
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
            {/* <Text style={styles.updateText}>
              Lịch được cập nhật 1 ngày trước
            </Text> */}
            <View style={styles.policyTextContainer}>
              <Text style={styles.policyText}>
                Chính sách hủy lịch MeowCare
              </Text>
              <Text style={styles.readMoreText1}> Đọc thêm</Text>
              {/* <Text style={styles.readMoreText1}>{sitterProfile?.fullRefundDay} ngày</Text> */}
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
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginRight: -20,
  },
  text: {
    textAlign: "center",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
  },
  mainText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#000",
    flexWrap: "wrap",
  },
  text1: {
    textAlign: "center",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "600",
    marginTop: height * 0.02,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.01,
  },
  extraServiceContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.02,
  },
  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center", // Căn giữa icon và text
  },
  serviceImage: {
    width: width * 0.1, // Kích thước hình ảnh
    height: width * 0.1,
    marginRight: width * 0.03, // Khoảng cách giữa hình và text
    resizeMode: "contain",
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
  titlesecond: {
    textAlign: "left",
    fontSize: width * 0.04,
    color: "#000857",
    fontWeight: "900",
    marginTop: 10,
  },
  childServicesContainer: {
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01, // Khoảng cách giữa các mục
  },
  dotAndTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: width * 0.008,
    height: width * 0.008,
    backgroundColor: "#000857",
    borderRadius: (width * 0.008) / 2,
    marginRight: height * 0.006,
  },
  scheduleTime: {
    fontSize: width * 0.035,
    color: "#000857",
    fontWeight: "500",
  },
  scheduleActivity: {
    fontSize: width * 0.035,
    color: "rgba(0, 8, 87, 0.8)",
    fontWeight: "500",
  },
  noScheduleText: {
    fontSize: width * 0.035,
    color: "rgba(0, 8, 87, 0.6)",
    fontStyle: "italic",
    marginTop: height * 0.01,
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
