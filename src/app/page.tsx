"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/chat");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg text-gray-700">Loading...</p>
    </div>
  );
}