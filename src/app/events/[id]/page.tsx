import type { Metadata } from "next";
import { EventDetailPage } from "./event-detail-page";

export const metadata: Metadata = {
  title: "Event Details - Evently",
};

export default function EventDetail() {
  return <EventDetailPage />;
}
