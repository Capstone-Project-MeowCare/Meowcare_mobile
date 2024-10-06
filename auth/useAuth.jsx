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

  const login = (userData, expoPushToken) => {
    const ability = new Ability(defineRulesFor(userData));
    setUser({ ...userData });
    setRole(userData?.roles[0]);
    setExpoPushToken(expoPushToken);
  };

  const logout = async () => {
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
