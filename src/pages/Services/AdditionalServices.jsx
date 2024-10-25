import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import Checkbox from "expo-checkbox";

const { width, height } = Dimensions.get("window");

const additionalServicesData = [
  {
    id: 1,
    image: require("../../../assets/BrushFur.png"),
    name: "Chải lông mèo",
    description: "Chăm sóc lông cho mèo bằng việc chải, làm sạch lông.",
    price: 20000,
  },
  {
    id: 2,
    image: require("../../../assets/CleaningEar.png"),
    name: "Vệ sinh tai và mắt",
    description: "Dịch vụ làm sạch tai và mắt cho mèo để giữ vệ sinh.",
    price: 20000,
  },
  {
    id: 3,
    image: require("../../../assets/Bathing.png"),
    name: "Tắm mèo",
    description: "Tắm cho mèo để giữ vệ sinh và làm sạch lông.",
    price: 20000,
  },
  {
    id: 4,
    image: require("../../../assets/CuttingNails.png"),
    name: "Cắt móng",
    description: "Cắt móng chân cho mèo để đảm bảo an toàn và vệ sinh.",
    price: 20000,
  },
  {
    id: 5,
    image: require("../../../assets/VitaminSupplement.png"),
    name: "Bổ sung vitamin",
    description: "Cung cấp vitamin bổ sung cho mèo để tăng cường sức khỏe.",
    price: 20000,
  },
  {
    id: 6,
    image: require("../../../assets/RelaxingMassage.png"),
    name: "Massage thư giãn",
    description: "Dịch vụ massage thư giãn cho mèo để giúp giảm căng thẳng.",
    price: 20000,
  },
];

export default function AdditionalServices({ navigation }) {
  const [selectedServices, setSelectedServices] = useState({});

  const toggleCheckbox = (id, price) => {
    setSelectedServices((prevState) => ({
      ...prevState,
      [id]: prevState[id] ? undefined : price,
    }));
  };

  const totalCost = Object.values(selectedServices).reduce(
    (acc, price) => acc + (price || 0),
    0
  );
  const hasSelectedServices = Object.values(selectedServices).some(
    (price) => price !== undefined
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/BackArrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Dịch vụ bổ sung</Text>
      </View>
      <View style={styles.separator} />
      <Text style={styles.title}>Dịch vụ thêm có phí</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={additionalServicesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Image source={item.image} style={styles.serviceImage} />
            <View style={styles.serviceDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Checkbox
                  value={selectedServices[item.id] !== undefined}
                  onValueChange={() => toggleCheckbox(item.id, item.price)}
                  color={selectedServices[item.id] ? "#2B764F" : undefined}
                />
              </View>
              <Text style={styles.serviceDescription}>{item.description}</Text>
              <Text style={styles.servicePrice}>
                {item.price.toLocaleString()}đ
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      {hasSelectedServices && (
        <View style={styles.totalContainer}>
          <View style={styles.separatorThin} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>
              {totalCost.toLocaleString()}đ
            </Text>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.confirmButtonText}>Xác nhận dịch vụ</Text>
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
  title: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
    marginTop: height * 0.02,
  },
  listContent: {
    paddingVertical: height * 0.02,
  },
  serviceItem: {
    width: width * 0.9,
    height: height * 0.12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
    padding: height * 0.015,
    borderRadius: 10,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    borderColor: "rgba(0,0,0,0.25)",
    borderWidth: 0.25,
  },
  serviceImage: {
    width: width * 0.17,
    height: height * 0.09,
    borderRadius: 8,
    marginRight: width * 0.04,
  },
  serviceDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000857",
  },
  serviceDescription: {
    fontSize: 14,
    color: "rgba(0,8,87,0.8)",
    marginTop: height * 0.005,
  },
  servicePrice: {
    fontSize: 14,
    color: "#2B764F",
    marginTop: height * 0.005,
  },
  totalContainer: {
    width: width,
    height: height * 0.16,
    backgroundColor: "#FFFAF5",
    paddingTop: height * 0.02,
    alignItems: "center",
  },
  separatorThin: {
    position: "absolute",
    left: -height * 0.023,
    right: height * 0.01,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    marginTop: height * 0.01,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.9,
    marginTop: height * 0.01,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000857",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000857",
    marginRight: height * 0.06,
  },
  confirmButton: {
    width: width * 0.8,
    height: height * 0.05,
    backgroundColor: "#2E67D1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.02,
    marginRight: height * 0.05,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
