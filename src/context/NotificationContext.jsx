import React, { createContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../configs/firebase";
import { useAuth } from "../../auth/useAuth";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications and listen for updates
  const fetchNotifications = () => {
    if (!userId) {
      console.log("User chưa đăng nhập, không truy vấn Firestore.");
      return;
    }

    console.log("Fetching notifications for userId:", userId);

    const q = query(
      collection(db, "notify"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(fetchedNotifications);

        // Cập nhật số lượng thông báo chưa đọc
        const unread = fetchedNotifications.filter(
          (notify) => !notify.isRead
        ).length;
        setUnreadCount(unread);
      },
      (error) => {
        console.error("Lỗi khi truy vấn Firestore:", error);
      }
    );

    return unsubscribe;
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "notify", notificationId);
      await updateDoc(notificationRef, { isRead: true });

      // Cập nhật trạng thái đã đọc trên UI
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    }
  };

  // Add a new notification
  const sendNotification = async ({
    userId,
    title,
    message,
    relatedId,
    relatedType,
    type,
    status,
  }) => {
    try {
      const newNotification = {
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
      };

      await addDoc(collection(db, "notify"), newNotification);

      console.log("Thông báo mới đã được thêm:", newNotification);
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
    }
  };

  useEffect(() => {
    return fetchNotifications(); // Gọi fetchNotifications khi component được mount
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        sendNotification, // Thêm chức năng gửi thông báo
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
