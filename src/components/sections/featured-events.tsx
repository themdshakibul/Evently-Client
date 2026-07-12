import { SectionHeader } from "@/components/section-header";
import { Calendar, MapPin, Users } from "lucide-react";

const featuredEvents = [
  {
    title: "Tech Innovation Summit 2024",
    date: "Dec 15, 2024",
    location: "San Francisco, CA",
    category: "Business",
    image: "bg-gradient-to-br from-blue-500 to-purple-600",
    attendees: 1200,
  },
  {
    title: "Summer Music Festival",
    date: "Aug 10, 2024",
    location: "Central Park, NYC",
    category: "Music",
    image: "bg-gradient-to-br from-pink-500 to-rose-600",
    attendees: 5000,
  },
  {
    title: "Startup Networking Night",
    date: "Jul 25, 2024",
    location: "WeWork, Austin",
    category: "Business",
    image: "bg-gradient-to-br from-emerald-500 to-teal-600",
    attendees: 350,
  },
  {
    title: "Art & Design Workshop",
    date: "Sep 5, 2024",
    location: "MOMA, NYC",
    category: "Art & Culture",
    image: "bg-gradient-to-br from-amber-500 to-orange-600",
    attendees: 150,
  },
];

export function FeaturedEvents() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Featured Events"
          description="Hand-picked events you don't want to miss."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((event) => (
            <div
              key={event.title}
              className="group rounded-xl border bg-background overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-40 ${event.image} flex items-center justify-center`}>
                <span className="inline-block px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                  {event.category}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {event.attendees.toLocaleString()} attendees
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
