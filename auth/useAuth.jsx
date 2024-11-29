import React, { createContext, useContext, useState } from "react";
import { Ability } from "@casl/ability";
import { defineRulesFor } from "./roles";
import { useStorage } from "../src/hooks/useLocalStorage";
import { postData } from "../src/api/api";
import * as Device from "expo-device";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser, removeUser] = useStorage("user", null);
  const [roles, setRoles, removeRoles] = useStorage("roles", []);
  const [accessToken, setAccessToken, removeAccessToken] = useStorage(
    "accessToken",
    null
  );
  const [refreshToken, setRefreshToken, removeRefreshToken] = useStorage(
    "refreshToken",
    null
  );

  const refreshAccessToken = async () => {
    try {
      const deviceId = Device.osBuildId || "unknown_deviceId";
      const response = await postData("/auth/refresh", {
        token: accessToken,
        refreshToken,
        deviceId,
      });

      if (response.status !== 1000 || !response.data.token) {
        throw new Error("Làm mới token thất bại");
      }

      const newAccessToken = response.data.token;
      await setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);

      // Xử lý khi `refreshToken` hết hạn
      if (error?.response?.status === 401) {
        await logout();
        return null;
      }

      throw error;
    }
  };

  const login = (userData, tokens) => {
    const { token, refreshToken } = tokens;

    setAccessToken(token); // Lưu accessToken
    setRefreshToken(refreshToken); // Lưu refreshToken
    setUser(userData); // Lưu thông tin user

    if (userData?.roles && userData.roles.length > 0) {
      setRoles(userData.roles); // Lưu vai trò
    }
  };

  const logout = async () => {
    try {
      await removeUser();
      await removeAccessToken();
      await removeRefreshToken();
      await removeRoles();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        accessToken,
        refreshAccessToken,
        roles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
