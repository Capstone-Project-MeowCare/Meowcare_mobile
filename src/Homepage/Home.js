import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import CatSitterCard from "./CatSitterCard";
import BecomeCatSitterCard from "./BecomeCatSitterCard";

const { width, height } = Dimensions.get("window");

export default function Home({ navigation }) {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/bannerlogo2.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.squareContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.leftSide}>
              <View style={styles.iconContainer}>
                <FontAwesome
                  name="money"
                  size={24}
                  color="#2ebf11"
                  style={styles.icon}
                />
                <Text style={styles.moneyText}>0.00 VNĐ</Text>
              </View>
              <Text style={styles.cashbackText}>
                Nhận hoàn tiền với mỗi lần book thứ 3
              </Text>
            </View>

            <View style={styles.divider} />
            <View style={styles.rightSide}>
              <Text style={styles.text}>Book ngay !</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.roundButton}>
              <FontAwesome5 name="cat" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Gửi thú cưng</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.roundButton}>
              <FontAwesome5 name="cut" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Chải chuốt</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.roundButton}>
              <FontAwesome5 name="paw" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Dắt bộ</Text>
          </View>
        </View>

        <View style={styles.buttonContainerBottom}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.roundButtonBottom}>
              <Image
                source={require("../../assets/PetCommandsTrain.png")}
                style={styles.buttonImage}
              />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Huấn luyện</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.roundButtonBottom}>
              <Image
                source={require("../../assets/CatCaregivers.png")}
                style={styles.buttonImage}
              />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Trông thú cưng</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.roundButtonBottom}>
              <FontAwesome5 name="syringe" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Tiêm Vaccine</Text>
          </View>
        </View>

        <View style={styles.catSitterContainer}>
          <Text style={styles.catSitterText}>Cat Sitter gần bạn:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.catSitterCardsContainer}>
              <CatSitterCard
                serviceName="Dịch vụ trông thú cưng"
                price="150000"
                rating={5}
                imageSource={require("../../assets/bannerlogo2.png")}
              />
              <CatSitterCard
                serviceName="Dịch vụ chăm sóc thú cưng"
                price="200000"
                rating={5}
                imageSource={require("../../assets/bannerlogo2.png")}
              />
              <CatSitterCard
                serviceName="Dịch vụ trông thú cưng"
                price="150000"
                rating={5}
                imageSource={require("../../assets/bannerlogo2.png")}
              />
              <CatSitterCard overlayText="Xem thêm" />
            </View>
          </ScrollView>
        </View>
        <View style={styles.centeredContainer}>
          <BecomeCatSitterCard />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  headerContainer: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    height: (width * 226) / 500,
    zIndex: 1,
  },
  logo: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  squareContainer: {
    position: "absolute",
    top: (width * 226) / 500 - width * 0.03,
    left: (width - width * 0.8) / 2,
    width: width * 0.8,
    height: width * 0.2,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow cho Android
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: width * 0.03,
  },
  leftSide: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: width * 0.03,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.005,
  },
  icon: {
    marginRight: width * 0.02,
  },
  moneyText: {
    fontSize: width * 0.04,
    color: "black",
  },
  cashbackText: {
    fontSize: width * 0.03,
    color: "#c6c9cf",
    marginTop: height * 0.01,
  },
  rightSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    position: "absolute",
    height: "60%",
    width: 1,
    backgroundColor: "#c6c9cf",
    left: width * 0.4,
    top: "20%",
  },
  text: {
    fontSize: 15,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: height * 0.1,
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.1,
  },
  roundButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 3,
    backgroundColor: "#872B6E",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainerBottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: -height * 0.02,
    marginBottom: height * 0.06,
    paddingHorizontal: width * 0.1,
  },
  roundButtonBottom: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 3,
    backgroundColor: "#872B6E",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.05,
  },
  buttonText: {
    fontSize: width * 0.04,
    marginTop: height * 0.01,
    color: "black",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  buttonImage: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: "contain",
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  catSitterContainer: {
    marginTop: height * 0.01,
  },
  catSitterText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "black",
    marginBottom: height * 0.01,
    marginLeft: width * 0.02,
  },
  catSitterCardsContainer: {
    flexDirection: "row",
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02, // Khoảng cách trên từ các thành phần khác
  },
});
