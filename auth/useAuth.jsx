import React, { createContext, useContext, useState } from "react";
import { Ability } from "@casl/ability";
import { defineRulesFor } from "./roles";
import { useStorage } from "../src/hooks/useLocalStorage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser, removeUser] = useStorage("user", null);
  const [role, setRole, removeRole] = useStorage("role", null);
  const [accessToken, setAccessToken, removeAccessToken] = useStorage(
    "accessToken",
    null
  );
  const [expoPushToken, setExpoPushToken, removeExpoPushToken] = useStorage(
    "expoPushToken",
    ""
  );

  const login = (userData, expoPushToken = "") => {
    console.log("User data received:", userData);
    console.log("Roles:", userData.roles);

    const ability = new Ability(defineRulesFor(userData));
    setUser({ ...userData });

    if (userData?.roles && userData.roles.length > 0) {
      setRole(userData.roles[0].name);
      console.log("Role set:", userData.roles[0].name); // Log role được set
    }

    setExpoPushToken(expoPushToken || ""); // Đảm bảo expoPushToken không bị undefined
  };

  const logout = async () => {
    console.log("Logging out...");
    await removeUser();
    await setUser(null);
    await removeAccessToken();
    await removeRole();
    await removeExpoPushToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        accessToken,
        role,
        expoPushToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
