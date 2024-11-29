import React from "react";
import { Routes } from "./Routes";
import { AuthProvider } from "./auth/useAuth";
import { NotificationProvider } from "./src/context/NotificationContext";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes />
      </NotificationProvider>
    </AuthProvider>
  );
}
