"use client";

import { useUser } from "@clerk/nextjs";
import Dashboard from "@/components/_components/dashboard";
import { LoadingAnimation } from "@/components/_components/loading-animation";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation state="initial" message="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return null; // Handle unauthorized access
  }

  return <Dashboard userId={user.id} />;
}