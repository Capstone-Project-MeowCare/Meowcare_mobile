import React from "react";
import { Text, View, StyleSheet, TouchableOpacity,ScrollView, Image, TextInput  } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';

export default function Service({ roles, navigation }) {


const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CatSitterService" component={CatSitterService} />
      <Stack.Screen name="RequestScreen" component={RequestScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="GuideScreen" component={GuideScreen} />
    </Stack.Navigator>
  );
}
  return (
    <View style={styles.container}>
      {/* Nếu role là "user", hiển thị giao diện cho User */}
      {roles === "User" ? (
        <View style={styles.userContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/BecomeCatsitter.png")} 
              style={styles.image}
            />
          </View>
          <Text style={styles.title}>Trở thành người chăm sóc mèo tại MeowCare!</Text>
          <Text style={styles.description}>
            Bạn yêu thích chăm sóc mèo? Trở thành người chăm sóc mèo tại MeowCare
            ngay hôm nay để kiếm thêm thu nhập và tận hưởng niềm vui khi làm việc
            với những chú mèo dễ thương!
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      ) : roles === "Cat Sitter" ? (
        // Nếu role là "Cat Sitter", hiển thị giao diện cho Cat Sitter
        <View style={styles.catSitterContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/BecomeCatsitter.png")} 
              style={styles.image}
            />
          </View>
          <View style={styles.sitterFunctions}>
            <Image source={require("../../../assets/IconRequest.png")} style={styles.icon} />
            <Image source={require("../../../assets/IconProfile.png")} style={styles.icon} />
            <Image source={require("../../../assets/IconWallet.png")} style={styles.icon} />
            <Image source={require("../../../assets/IconGuide.png")} style={styles.icon} />
          </View>
          <Text style={styles.sitterText}>Hiện vẫn chưa có yêu cầu nào</Text>
        </View>
      ) : (
        // Nếu không có role, có thể hiển thị thông báo lỗi hoặc trang mặc định
        <View style={styles.catSitterContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/BecomeCatsitter.png")} 
              style={styles.image}
            />
          </View>
            {/* Function Icons */}
           {/* Box Function Icons */}
          
      <View style={styles.functionBox}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('RequestScreen')}>
          <Image source={require("../../../assets/IconRequest.png")} style={styles.icon} />
          <Text style={styles.iconText}>Nhận yêu cầu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ProfileScreen')}>
          <Image source={require("../../../assets/IconProfile.png")} style={styles.icon} />
          <Text style={styles.iconText}>Hồ sơ dịch vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('WalletScreen')}>
          <Image source={require("../../../assets/IconWallet.png")} style={styles.icon} />
          <Text style={styles.iconText}>Ví tiền</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('GuideScreen')}>
          <Image source={require("../../../assets/IconGuide.png")} style={styles.icon} />
          <Text style={styles.iconText}>Hướng dẫn</Text>
        </TouchableOpacity>
      </View>
           {/* Search Bar */}
           <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image source={require("../../../assets/SearchIcon.png")} style={styles.searchIcon} />
        </TouchableOpacity>
        
      </View>
        {/* Request Status Tabs */}
        <View style={styles.statusTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.tabActive}> 
          <Text style={styles.tabTextActive}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Chờ xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Đã xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Đang diễn ra</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Hoàn thành</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Đã hủy</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>


          <Text style={styles.sitterText}>Hiện vẫn chưa có yêu cầu nào</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  userContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  catSitterContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  functionBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,  // Cho Android
    marginTop: -50,  // Di chuyển box lên gần hình ảnh
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 10,
    color: "#000857",
    fontWeight: "bold",
  },
  sitterFunctions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  statusTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 4,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#FFFAF5",
    borderWidth: 1,
    borderColor: "#902C6C",
    marginRight: 10,
  },
  tabActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#902C6C",
    marginRight: 10,
  },
  tabText: {
    color: "#902C6C",
    fontSize: 14,
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    
  },
  image: {
    width: 430,
    height: 197,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 20,
    color: "#000857",
  },
  description: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    color: "#000857",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#1E57F1",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sitterFunctions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  sitterText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 30,
  },

});
