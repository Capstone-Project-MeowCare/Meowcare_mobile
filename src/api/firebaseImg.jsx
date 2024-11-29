import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../configs/firebase";

export const firebaseImg = async (imageUri) => {
  try {
    if (!imageUri) {
      console.error("Image URI is missing");
      return null;
    }

    // Tạo tên file dựa trên thời gian hiện tại và một số ngẫu nhiên
    const fileName = `pet_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    const imageRef = ref(storage, `images/${fileName}`);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
export const firebaseImgForPet = async (imageUri) => {
  try {
    if (!imageUri) {
      console.error("Image URI is missing");
      return null;
    }

    // Tạo tên file dựa trên thời gian hiện tại và một số ngẫu nhiên
    const fileName = `pet_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    const imageRef = ref(storage, `petImages/${fileName}`);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
export const firebaseTask = async (mediaUri, isVideo = false) => {
  try {
    if (!mediaUri) {
      console.error("Media URI is missing");
      return null;
    }
    const fileName = `task_${Date.now()}_${Math.floor(Math.random() * 10000)}.${isVideo ? "mp4" : "jpg"}`;
    const folder = isVideo ? "videosTask/" : "imagesTask/";
    const mediaRef = ref(storage, `${folder}${fileName}`);

    const response = await fetch(mediaUri);
    const blob = await response.blob();

    await uploadBytes(mediaRef, blob);
    const mediaUrl = await getDownloadURL(mediaRef);
    return mediaUrl;
  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
  }
};
export const firebaseAvatar = async (imageUri) => {
  try {
    if (!imageUri) {
      console.error("Image URI is missing");
      return null;
    }

    // Tạo tên file dựa trên thời gian hiện tại và số ngẫu nhiên
    const fileName = `avatar_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    const imageRef = ref(storage, `avatar/${fileName}`);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
};
