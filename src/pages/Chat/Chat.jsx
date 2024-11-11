import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { sendMessage, listenForMessages } from "../../api/firebaseChat";

export default function Chat({ route }) {
  const { conversationId, userEmail } = route.params; // Sử dụng conversationId có chứa cả bookingId
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = listenForMessages(conversationId, setMessages);
    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = () => {
    if (messageText.trim() && userEmail) {
      sendMessage(conversationId, userEmail, messageText);
      setMessageText("");
    } else {
      console.error("User email is undefined or invalid.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={{
              padding: 5,
              backgroundColor: "#e1f5fe",
              marginVertical: 2,
            }}
          >
            {item.text}
          </Text>
        )}
      />
      <TextInput
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Type a message"
        style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
}
