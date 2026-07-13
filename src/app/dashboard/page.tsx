import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardPage } from "./dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard - Evently",
};

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
