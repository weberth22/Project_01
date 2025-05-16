"use client";

import { CustomProvider } from "rsuite";
import { AuthProvider } from "./authContext";

export default function AuthClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CustomProvider theme="dark">{children}</CustomProvider>
    </AuthProvider>
  );
}
