import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";

// Hàm gửi thông báo tái sử dụng
export const sendNotification = async ({
  userId,
  title,
  message,
  relatedId = null,
  relatedType = null,
  type = "GENERAL",
  status = "PENDING",
}) => {
  try {
    const notifyRef = doc(collection(db, "notify"));
    await setDoc(notifyRef, {
      userId,
      title,
      message,
      relatedId,
      relatedType,
      type,
      status,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Thông báo được gửi:", title);
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
    throw new Error("Không thể gửi thông báo.");
  }
};
