import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../configs/firebase";
import { v4 as uuidv4 } from "uuid";
// export const firebaseImg = async (image) => {
//     const pathParts = image.assets[0].uri?.split('/');
//     const fileName = pathParts[pathParts.length - 1];
//     if (image) {
//       const imageRef = ref(storage, `images/${fileName}`);
//       // Upload image to Firebase Storage
//       await uploadBytes(imageRef, await fetch(image.assets[0].uri).then((res) => res.blob()));
//       // Get the download URL of the image
//       const imageUrl = await getDownloadURL(imageRef);
//       return imageUrl;
//     }
//     return null;
// };
export const firebaseImg = async (image) => {
  try {
    if (!image || !image.assets[0]?.uri) {
      return null; // Handle case where image or URI is missing
    }

    const pathParts = image.assets[0].uri.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const imageRef = ref(storage, `images/${fileName}`);

    // Fetch and upload in parallel
    const [blob] = await Promise.all([
      fetch(image.assets[0].uri).then((res) => res.blob()),
    ]);
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null; // or throw the error for further handling
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
