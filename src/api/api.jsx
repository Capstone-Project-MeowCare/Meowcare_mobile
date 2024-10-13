import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://basico.click/meow-care/api/v1/",
});

api.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken"); // Lấy token từ AsyncStorage
      if (accessToken) {
        const token = accessToken.replace(/"/g, "");
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      // Xử lý lỗi nếu có khi lấy token từ AsyncStorage
      console.error("Error getting access token:", error);
      return config; // Trả về config để yêu cầu vẫn được gửi đi, có thể xử lý ở interceptor khác
    }
  },
  (error) => Promise.reject(error)
);
export const getData = async (endpoint, params = {}, headers = {}) => {
  try {
    const response = await api.get(endpoint, { params, headers });
    return response.data; // Trả về toàn bộ phản hồi từ API
  } catch (error) {
    throw error;
  }
};

export const postData = async (endpoint, data, headers = {}) => {
  try {
    const response = await api.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putData = async (endpoint, id, data, headers = {}) => {
  try {
    const response = await api.put(
      id ? `${endpoint}/${id}` : `${endpoint}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (endpoint, id, data = {}, headers = {}) => {
  try {
    const response = await api.delete(
      id ? `${endpoint}/${id}` : `${endpoint}`,
      { data, headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchData = async (endpoint, id, data, headers = {}) => {
  try {
    const response = await api.patch(
      id ? `${endpoint}/${id}` : `${endpoint}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
