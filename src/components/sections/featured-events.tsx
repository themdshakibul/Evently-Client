"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import Link from "next/link";

interface EventItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  views: number;
  images: string[];
  capacity: number;
}

interface EventsResponse {
  success: boolean;
  data: EventItem[];
}

export function FeaturedEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await apiClient<EventsResponse>("/events?limit=4&sort=popular");
        if (res.success) {
          setEvents(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Featured Events"
          description="Hand-picked events you don't want to miss."
        />
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No featured events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <Link href={`/events/${event._id}`} key={event._id}>
                <div
                  className="group h-full rounded-xl border bg-background overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {event.images && event.images.length > 0 ? (
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${event.images[0]})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="relative h-full flex items-start justify-end p-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium shadow-sm">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-start justify-end p-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium shadow-sm">
                        {event.category}
                      </span>
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {event.views || 0} views
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
