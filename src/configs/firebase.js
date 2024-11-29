import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7wKUnxFflvf2Ubv4B9ghqStuU6MhQviU",
  authDomain: "meowcare-22fd8.firebaseapp.com",
  projectId: "meowcare-22fd8",
  storageBucket: "meowcare-22fd8.appspot.com",
  messagingSenderId: "818268491134",
  appId: "1:818268491134:android:f5b38e867e5d3e893eb72f",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Khởi tạo Firebase Auth với AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
