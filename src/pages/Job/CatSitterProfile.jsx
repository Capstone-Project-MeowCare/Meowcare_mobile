import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'

export default function CatSitterProfile({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
         <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>
      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Nội dung khác */}
      <ScrollView>
        <View style={styles.profileContainer}>
          {/* Ảnh và tên người dùng */}
          <Image
            source={require("../../../assets/BecomeCatsitter.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Nguyễn Hoài Phúc</Text>
          <Text style={styles.editProfile}>Chỉnh sửa hồ sơ</Text>
        </View>

        {/* Các mục chọn */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InformationCatSitter')}>
          <Ionicons name="person-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Hồ sơ dịch vụ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="briefcase-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Dịch vụ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Địa chỉ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="calendar-outline" size={24} color="#000857" />
          <Text style={styles.menuText}>Lịch làm việc</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000857" />
        </TouchableOpacity>

       
      </ScrollView>
       {/* Nút Tôi đồng ý */}
       <TouchableOpacity style={styles.agreeButton}>
          <Text style={styles.agreeText}>Bắt đầu kinh doanh dịch vụ</Text>
        </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
   flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "space-between", // Để đảm bảo các phần tử nằm đúng vị trí
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0", // Màu nền của header (tùy chỉnh theo yêu cầu)
    justifyContent: "space-between", // Để căn đều các phần tử
  },
  backArrow: {
    width: 30,
    height: 30,
    tintColor: "#000857", // Màu sắc của mũi tên quay lại
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F", // Màu sắc tiêu đề
    textAlign: "center", // Để căn giữa tiêu đề
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3", // Màu của đường kẻ ngang
    borderBottomWidth: 1, // Độ dày của đường kẻ
   
  }, 
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginTop: 10,
  },
  editProfile: {
    fontSize: 14,
    color: "#888888",
    marginTop: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    color: "#000857",
  },
  agreeButton: {
    backgroundColor: "#FFE3D5",
    paddingVertical: 15,
    alignItems: "center",
    margin: 0,
    borderRadius: 0,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  agreeText: {
    fontSize: 18,
    color: "#902C6C",
    fontWeight: "bold",
  },
});