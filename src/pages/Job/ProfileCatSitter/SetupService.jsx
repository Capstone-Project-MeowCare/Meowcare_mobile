import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SetupService({ navigation }) {
  const [atHomeCare, setAtHomeCare] = useState(false);
  const [boardingCare, setBoardingCare] = useState(false);

  const [atHomePrices, setAtHomePrices] = useState({
    normal: "",
    holiday: "",
    extraCat: "",
  });
  const [boardingPrices, setBoardingPrices] = useState({
    normal: "",
    holiday: "",
    extraCat: "",
  });

  const [additionalServices, setAdditionalServices] = useState([]);
  const [maxCats, setMaxCats] = useState(""); // Maximum number of cats state

  // Predefined additional services
  const [predefinedServices, setPredefinedServices] = useState([
    { id: "bathing", name: "Tắm cho mèo", enabled: false, price: "" },
    { id: "nailTrimming", name: "Cắt móng tay", enabled: false, price: "" },
    { id: "pickup", name: "Đưa rước thú cưng", enabled: false, price: "" },
  ]);

  const addNewAdditionalService = () => {
    setAdditionalServices((prevServices) => [
      ...prevServices,
      { id: Date.now(), name: "", enabled: true, price: "" },
    ]);
  };

  const handlePredefinedServiceToggle = (id) => {
    setPredefinedServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, enabled: !service.enabled } : service
      )
    );
  };

  const handlePredefinedServicePriceChange = (id, price) => {
    setPredefinedServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, price } : service
      )
    );
  };

  const handleAdditionalServiceNameChange = (id, name) => {
    setAdditionalServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, name } : service
      )
    );
  };

  const handleAdditionalServicePriceChange = (id, price) => {
    setAdditionalServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, price } : service
      )
    );
  };

  const deleteAdditionalService = (id) => {
    setAdditionalServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết kế dịch vụ</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Services */}
        <Text style={styles.sectionTitle}>Dịch vụ chính</Text>

        {/* Maximum Cats Setting */}
        <View style={styles.serviceOption}>
          <Text style={styles.optionLabel}>Số lượng mèo bạn có thể chăm sóc:</Text>
          <TextInput
            style={styles.maxCatsInput}
            placeholder="Nhập số lượng"
            keyboardType="numeric"
            value={maxCats}
            onChangeText={setMaxCats}
          />
        </View>

        {/* At Home Care Service */}
        <View style={styles.serviceOption}>
          <Text style={styles.optionLabel}>Gủi thú cưng (Boarding)</Text>
          <Switch value={atHomeCare} onValueChange={(value) => setAtHomeCare(value)} />
        </View>
        {atHomeCare && (
          <View style={styles.pricingContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="Ngày thường: giá/đêm"
              keyboardType="numeric"
              value={atHomePrices.normal}
              onChangeText={(price) =>
                setAtHomePrices((prevPrices) => ({ ...prevPrices, normal: price }))
              }
            />
            <TextInput
              style={styles.priceInput}
              placeholder="Ngày lễ: giá/đêm"
              keyboardType="numeric"
              value={atHomePrices.holiday}
              onChangeText={(price) =>
                setAtHomePrices((prevPrices) => ({ ...prevPrices, holiday: price }))
              }
            />
            <TextInput
              style={styles.priceInput}
              placeholder="Thêm số lượng mèo: giá/bé mèo"
              keyboardType="numeric"
              value={atHomePrices.extraCat}
              onChangeText={(price) =>
                setAtHomePrices((prevPrices) => ({ ...prevPrices, extraCat: price }))
              }
            />
          </View>
        )}

        {/* Boarding Care Service */}
        <View style={styles.serviceOption}>
          <Text style={styles.optionLabel}>Trông tại nhà (House Sitting)</Text>
          <Switch value={boardingCare} onValueChange={(value) => setBoardingCare(value)} />
        </View>
        {boardingCare && (
          <View style={styles.pricingContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="Ngày thường: giá/đêm"
              keyboardType="numeric"
              value={boardingPrices.normal}
              onChangeText={(price) =>
                setBoardingPrices((prevPrices) => ({ ...prevPrices, normal: price }))
              }
            />
            <TextInput
              style={styles.priceInput}
              placeholder="Ngày lễ: giá/đêm"
              keyboardType="numeric"
              value={boardingPrices.holiday}
              onChangeText={(price) =>
                setBoardingPrices((prevPrices) => ({ ...prevPrices, holiday: price }))
              }
            />
            <TextInput
              style={styles.priceInput}
              placeholder="Thêm số lượng mèo: giá/bé mèo"
              keyboardType="numeric"
              value={boardingPrices.extraCat}
              onChangeText={(price) =>
                setBoardingPrices((prevPrices) => ({ ...prevPrices, extraCat: price }))
              }
            />
          </View>
        )}

        {/* Predefined Additional Services */}
        <Text style={styles.sectionTitle}>Dịch vụ thêm</Text>
        {predefinedServices.map((service) => (
          <View key={service.id} style={styles.additionalService}>
            <Text style={styles.additionalServiceName}>{service.name}</Text>
            <Switch
              value={service.enabled}
              onValueChange={() => handlePredefinedServiceToggle(service.id)}
            />
            {service.enabled && (
              <TextInput
                style={styles.priceInput}
                placeholder="Nhập giá tiền"
                keyboardType="numeric"
                value={service.price}
                onChangeText={(price) => handlePredefinedServicePriceChange(service.id, price)}
              />
            )}
          </View>
        ))}

        {/* Custom Additional Services */}
        {additionalServices.map((service) => (
          <View key={service.id} style={styles.additionalService}>
            <TextInput
              style={styles.additionalServiceNameInput}
              placeholder="Tên dịch vụ"
              value={service.name}
              onChangeText={(name) => handleAdditionalServiceNameChange(service.id, name)}
            />
            
            {service.enabled && (
              <TextInput
                style={styles.priceInput}
                placeholder="Nhập giá tiền"
                keyboardType="numeric"
                value={service.price}
                onChangeText={(price) => handleAdditionalServicePriceChange(service.id, price)}
              />
            )}
            <TouchableOpacity onPress={() => deleteAdditionalService(service.id)}>
              <Ionicons name="trash-outline" size={24} color="#FF3D00" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add New Additional Service Button */}
        <TouchableOpacity style={styles.addServiceButton} onPress={addNewAdditionalService}>
          <Ionicons name="add-circle-outline" size={24} color="#902C6C" />
          <Text style={styles.addServiceButtonText}>Tạo mới dịch vụ thêm</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.completeButton} >
          <Text style={styles.completeButtonText}>HOÀN THÀNH</Text>
        </TouchableOpacity>
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
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#902C6C",
    marginTop: 20,
  },
  serviceOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
  },
  maxCatsInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 100,
  },
  pricingContainer: {
    marginLeft: 20,
    marginTop: 5,
  },
  priceInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  additionalService: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  additionalServiceName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  additionalServiceNameInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addServiceButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  addServiceButtonText: {
    color: "#902C6C",
    fontSize: 16,
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
