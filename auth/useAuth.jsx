import React, { createContext, useContext, useState } from "react";
import { Ability } from "@casl/ability";
import { defineRulesFor } from "./roles";
import { useStorage } from "../src/hooks/useLocalStorage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser, removeUser] = useStorage("user", null);
  const [roles, setRoles, removeRoles] = useStorage("roles", []);
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
      setRoles(userData.roles);
      console.log("Roles set:", userData.roles); // Log các role được set
    }

    setExpoPushToken(expoPushToken || "");
  };

  const logout = async () => {
    try {
      if (user) {
        await removeUser();
        setUser(null);
      }

      if (accessToken) {
        await removeAccessToken();
      }

      if (roles && Array.isArray(roles) && roles.length > 0) {
        await removeRoles();
      } else {
        console.log("Roles are null or not an array.");
      }

      if (expoPushToken) {
        await removeExpoPushToken();
      }

      console.log("Logged out successfully!");
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
        roles,
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
