import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/protected-route";
import { AddEventPage } from "./add-event-page";

export const metadata: Metadata = {
  title: "Add Event - Evently",
};

export default function AddEvent() {
  return (
    <ProtectedRoute>
      <AddEventPage />
    </ProtectedRoute>
  );
}
