"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/_contexts/authContext";

type ProtectedPageProps = {
  children: React.ReactNode;
  roles: string[];
  redirectTo?: string;
};

const ProtectedPage: React.FC<ProtectedPageProps> = ({
  children,
  roles,
  redirectTo = "/",
}) => {
  const router = useRouter();
  const { isLoading, hasRoles } = useAuth();

  useEffect(() => {
    if (!isLoading && !hasRoles(roles)) {
      router.push(redirectTo);
    }
  }, [isLoading, hasRoles, roles, router, redirectTo]);

  if (isLoading) return null;

  if (!hasRoles(roles)) return null;

  return <>{children}</>;
};

export default ProtectedPage;
