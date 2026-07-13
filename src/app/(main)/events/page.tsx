import type { Metadata } from "next";
import { Suspense } from "react";
import { EventsPage } from "./events-page";

export const metadata: Metadata = {
  title: "Explore Events - Evently",
  description: "Discover events near you. Search, filter, and find the perfect event.",
};

export default function Events() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-72 bg-muted rounded" />
            <div className="h-12 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <EventsPage />
    </Suspense>
  );
}
