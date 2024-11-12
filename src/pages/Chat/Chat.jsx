import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { sendMessage, listenForMessages } from "../../api/firebaseChat";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../auth/useAuth";

const { width, height } = Dimensions.get("window");

export default function Chat({ route, navigation }) {
  const { conversationId } = route.params;
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = listenForMessages(conversationId, (newMessages) => {
      // Sắp xếp tin nhắn từ cũ đến mới dựa trên timestamp.seconds
      const sortedMessages = newMessages.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });
      // console.log("Sorted Messages:", sortedMessages); // Kiểm tra lại xem log có hiển thị đúng thứ tự không
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = () => {
    if (messageText.trim() && user?.id) {
      sendMessage(conversationId, user.id, messageText);
      setMessageText("");
      // Cuộn đến cuối danh sách khi có tin nhắn mới
      flatListRef.current.scrollToEnd({ animated: true });
    } else {
      console.error("User ID is undefined or invalid.");
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userId === user?.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser
            ? styles.currentUserMessageContainer
            : styles.otherUserMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

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
        <Text style={styles.label}>Chat</Text>
      </View>
      <View style={styles.separator} />

      <FlatList
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#FFFAF5",
  },
  backButton: {
    marginRight: "auto",
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#000000",
    marginTop: height * 0.02,
  },
  messageList: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.1,
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  currentUserMessageContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherUserMessageContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageBubble: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "85%",
  },
  currentUserMessage: {
    backgroundColor: "#2E67D1",
  },
  otherUserMessage: {
    backgroundColor: "#e1f5fe",
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: "#FFFFFF",
  },
  otherUserText: {
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFAF5",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E67D1",
    justifyContent: "center",
    alignItems: "center",
  },
});
