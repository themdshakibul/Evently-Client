import type { Metadata } from "next";
import { EditEventPage } from "./edit-event-page";

export const metadata: Metadata = {
  title: "Edit Event - Evently",
};

export default function EditEvent() {
  return <EditEventPage />;
}
