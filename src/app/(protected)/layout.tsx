
"use client";

import { useAuth } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // A small delay to allow auth state to be read from session storage
    const timer = setTimeout(() => {
        if (currentUser === null) {
            router.push('/login');
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (currentUser === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
  );
}
