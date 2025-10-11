
"use client";

import { useAuth } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/profile');
    }
  }, [currentUser, router]);

  if (currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
        <div className="absolute left-4 top-4">
            <Image src="/logo.png" alt="logo" width={40} height={40} className="rounded-full" />
        </div>
       {children}
    </div>
  );
}
