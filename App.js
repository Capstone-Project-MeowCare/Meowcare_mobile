import React from "react";
import { Routes } from "./Routes"; // Import Routes
import { AuthProvider } from "./auth/useAuth"; // Import AuthProvider

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
