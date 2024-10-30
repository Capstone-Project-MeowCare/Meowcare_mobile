import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");

const catData = [
  { id: 1, name: "Kitty", image: require("../../../assets/image88.png") },
  { id: 2, name: "Kitt2y", image: require("../../../assets/image88.png") },
];

export default function Pets({ navigation }) {
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
        <Text style={styles.label}>Mèo của tôi</Text>
      </View>
      <View style={styles.separator} />

      <View
        style={[
          styles.catContainerRow,
          catData.length < 2 && styles.singleCatRow,
        ]}
      >
        {catData.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.catContainer}>
            <Image source={cat.image} style={styles.catImage} />
            <View style={styles.catFooter}>
              <Text style={styles.catName}>{cat.name}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View
          style={[
            styles.newContainerWrapper,
            catData.length === 1 && styles.newContainerSingle,
          ]}
        >
          <TouchableOpacity
            style={styles.catContainer}
            onPress={() => navigation.navigate("CreatePet")}
          >
            <Image
              source={require("../../../assets/image89.png")}
              style={styles.catImage}
            />
            <View style={styles.catFooter1}>
              <Text style={styles.addCatText}>Thêm thú cưng</Text>
              <Text style={styles.addCatHintText}>
                Nhấn vào đây để thêm thú cưng
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
  catContainerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width * 0.9,
    marginTop: height * 0.05,
  },
  singleCatRow: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: width * 0.9,
  },
  catContainer: {
    width: width * 0.4,
    height: height * 0.25,
    backgroundColor: "#FFFAF5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "flex-end",
  },
  catImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  catFooter: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: height * 0.01,
    borderBottomRightRadius: height * 0.01,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: height * 0.01,
  },
  catFooter1: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: height * 0.01,
    borderBottomRightRadius: height * 0.01,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: height * 0.01,
  },
  catName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
  },
  newContainerWrapper: {
    marginTop: height * 0.04,
    width: width * 0.9,
  },
  newContainerSingle: {
    marginTop: 0,
    width: width * 0.4,
    alignSelf: "flex-end",
    marginLeft: width * 0.1,
  },

  addCatText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000857",
    textAlign: "center",
  },
  addCatHintText: {
    fontSize: 12,
    color: "#000857",
    textAlign: "center",
    marginTop: height * 0.001,
  },
});
