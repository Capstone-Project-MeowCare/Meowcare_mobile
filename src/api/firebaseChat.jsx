import { db } from "../configs/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// Hàm gửi tin nhắn
export async function sendMessage(conversationId, userId, messageText) {
  try {
    const messageRef = collection(
      db,
      `conversations/${conversationId}/messages`
    );
    await addDoc(messageRef, {
      userId,
      text: messageText,
      timestamp: serverTimestamp(),
    });
    console.log("Message sent!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Hàm lắng nghe tin nhắn
export function listenForMessages(conversationId, setMessages) {
  const messagesRef = collection(
    db,
    `conversations/${conversationId}/messages`
  );
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(messages);
  });

  return unsubscribe;
}
