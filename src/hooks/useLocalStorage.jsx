import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue !== null) {
          setStoredValue(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const updateStoredValue = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      setStoredValue(value);
    } catch (error) {
      console.log(error);
    }
  };

  const removeStoredValue = async () => {
    try {
      setStoredValue(null);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing value from AsyncStorage", error);
    }
  };

  return [storedValue, updateStoredValue, removeStoredValue];
};
