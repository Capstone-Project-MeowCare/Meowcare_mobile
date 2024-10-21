import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


const { width, height } = Dimensions.get("window");

export default function Knowledge({ navigation }) {
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#000857" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kiến thức cơ bản về mèo</Text>
      </View>

      {/* Đường kẻ ngang */}
      <View style={styles.divider} />

      {/* Vuốt lên xuống */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
     {/* Nội dung chính */}
     <View style={styles.formContainer}>
        {/* Ngôn ngữ nói của mèo */}
    <Text style={styles.sectionTitle}>Ngôn ngữ nói của mèo</Text>
    <Text style={styles.sectionText}>
    Mèo không có ngôn ngữ nói như con người, nhưng chúng sử dụng một loạt các âm thanh và tiếng kêu để giao tiếp với 
    nhau và với con người. Dưới đây là một số âm thanh và tiếng kêu phổ biến mà mèo sử dụng để thể hiện ý định và tâm trạng của mình:
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Tiếng rên:</Text> Đây là một âm thanh êm dịu và thư giãn, thường được mèo phát ra khi chúng cảm 
      thấy hạnh phúc và thoải mái. Một mèo có thể rên khi được vuốt ve hoặc khi nằm gọn trong vòng tay của chủ nhân.
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Tiếng gầm:</Text> Tiếng gầm thường là dấu hiệu của sự tức giận hoặc căng thẳng. Mèo 
      có thể gầm khi chúng cảm thấy xâm phạm hoặc khi chúng muốn bảo vệ lãnh thổ của mình.
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Tiếng hét:</Text> Đây là một tiếng kêu mạnh mẽ và đầy sức mạnh, thường 
      được mèo sử dụng để yêu cầu sự chú ý hoặc khi chúng cảm thấy bị đe dọa.
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Tiếng kêu:</Text> Mèo có thể phát ra các tiếng kêu khác nhau để thể hiện nhu cầu của mình, 
      bao gồm tiếng kêu để yêu cầu thức ăn, tiếng kêu để yêu cầu ra ngoài, và tiếng kêu để thể hiện sự cô đơn hoặc mong muốn giao tiếp.
    </Text>

    {/* Hình ảnh 1 */}
    <Image
      source={require("../../../../assets/cat-language-1.png")}// Đảm bảo bạn có hình ảnh tương ứng trong thư mục assets
      style={styles.image}
    />
    <Text style={styles.imageCaption}>Ngôn ngữ nói của mèo</Text>

    {/* Ngôn ngữ cơ thể của mèo */}
    <Text style={styles.sectionTitle}>Ngôn ngữ cơ thể của mèo</Text>
    <Text style={styles.sectionText}>
    Ngôn ngữ cơ thể của mèo là một phần quan trọng của cách chúng giao tiếp và thể hiện
     tâm trạng. Dưới đây là một số biểu hiện cơ thể phổ biến của mèo và ý nghĩa của chúng:
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Đuôi:</Text> Đuôi của mèo có thể biểu hiện nhiều tâm trạng khác nhau. Đuôi cao và cong lên thường biểu 
      hiện sự hạnh phúc hoặc niềm vui, trong khi đuôi gập xuống có thể là dấu hiệu của sự căng thẳng hoặc sợ hãi. Mèo cũng có thể làm đuôi rung lắc để thể hiện sự hứng thú hoặc sự lo lắng.
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Tai:</Text> Khi tai của mèo hướng về phía trước và giữa, đó thường là dấu hiệu của sự chú ý và sự quan 
      tâm. Khi tai hướng về phía sau hoặc đang rung lắc, đó có thể là dấu hiệu của sự lo lắng hoặc sự căng thẳng.
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Mắt:</Text> Mắt của mèo có thể nói lên nhiều điều về tâm trạng của chúng. Mèo thường có mắt to và sáng 
      khi chúng cảm thấy hứng khởi hoặc quan tâm. Mắt hẹp lại và miệng mở ra thường là dấu hiệu của sự lo lắng hoặc căng thẳng.
    </Text>
    <Text style={styles.sectionText}>
      <Text style={styles.boldText}>Hành động và vị trí cơ thể:</Text> Mèo có thể sử dụng hành động như cúi đầu, nhấc chân hoặc khuỵu gối để thể hiện 
      sự yêu thương và sự gắn bó. Đồng thời, mèo cũng có thể nhảy lên bàn, cào gỗ hoặc trèo lên đồ đạc để thể hiện sự khao khát sự chú ý hoặc sự phản đối.
    </Text>

    {/* Hình ảnh 2 */}
    <Image
      source={require("../../../../assets/cat-language-2.png")} // Đảm bảo bạn có hình ảnh tương ứng trong thư mục assets
      style={styles.image}
    />
    <Text style={styles.imageCaption}>Ngôn ngữ cơ thể của loài mèo</Text>

    {/* Kết luận */}
    <Text style={styles.sectionText}>
      Bạn tự tin hiểu rõ về mèo cưng? Hãy thử sức với bài kiểm tra của chúng tôi để kiểm tra kiến thức của bạn!
    </Text>
  
     </View> 
      </ScrollView>   
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('RegisterSitterStep2')}>
        <Text style={styles.continueButtonText}>Đã hiểu</Text>
      </TouchableOpacity>
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
    paddingVertical: 8,
    height: 50,
    backgroundColor: "#FFF7F0",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    flex: 1,
  },
  divider: {
    borderBottomColor: "#D3D3D3", // Màu của đường kẻ ngang
    borderBottomWidth: 1, // Độ dày của đường kẻ   
  }, 
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  formContainer: {
    backgroundColor: "#FFFAF5",
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000857",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000857", // Có thể điều chỉnh màu sắc nếu muốn
  },
  sectionText: {
    fontSize: 14,
    color: "#000857",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  imageCaption: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#FDD7D7",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  continueButtonText: {
    fontSize: 16,
    color: "#902C6C",
    fontWeight: "bold",
  },
});
