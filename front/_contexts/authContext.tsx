"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/_config/api";
import { useMessage } from "@/app/_components/notification";

type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  hasRoles: (rolesToCheck: string | string[]) => boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const showMessage = useMessage();

  useLayoutEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        router.push("/login");
      }

      try {
        const res = await fetch(API_URL + "/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          router.push("/login");
        }
      } catch {
        setUser(null);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(API_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      showMessage(res);
      return;
    }

    const { token } = await res.json();
    localStorage.setItem("token", token.token);

    const me = await fetch(API_URL + "/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });
    if (!me.ok) return;

    const use = await me.json();
    localStorage.setItem("authUserId", use.id);
    setUser(use.user);

    return;
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(API_URL + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("authUserId");
    setUser(null);
    router.push("/login");

    showMessage(res);
  };

  const hasRoles = (rolesToCheck: string | string[]): boolean => {
    if (!user?.roles) return false;

    const userRoles = user.roles;

    if (Array.isArray(rolesToCheck)) {
      return rolesToCheck.some((role) => userRoles.includes(role));
    }

    return userRoles.includes(rolesToCheck);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRoles }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
