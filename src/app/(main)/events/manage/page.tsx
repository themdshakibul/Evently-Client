import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/protected-route";
import { ManageEventsPage } from "./manage-events-page";

export const metadata: Metadata = {
  title: "Manage Events - Evently",
};

export default function ManageEvents() {
  return (
    <ProtectedRoute>
      <ManageEventsPage />
    </ProtectedRoute>
  );
}
