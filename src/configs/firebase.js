import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA7wKUnxFflvf2Ubv4B9ghqStuU6MhQviU",
  authDomain: "meowcare-22fd8.firebaseapp.com",
  projectId: "meowcare-22fd8",
  storageBucket: "meowcare-22fd8.appspot.com",
  messagingSenderId: "818268491134",
  appId: "1:818268491134:android:f5b38e867e5d3e893eb72f",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
