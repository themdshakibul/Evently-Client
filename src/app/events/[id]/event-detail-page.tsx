"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  User,
  Clock,
  Share2,
  Bookmark,
  Ticket,
  ChevronLeft,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["Overview", "Gallery", "Reviews", "Similar Events"] as const;

const event = {
  id: "1",
  title: "Tech Innovation Summit 2024",
  category: "Business",
  date: "December 15, 2024",
  time: "9:00 AM - 6:00 PM",
  location: "Moscone Center, San Francisco, CA",
  organizer: "TechEvents Inc.",
  organizerAvatar: "TE",
  price: 149,
  capacity: 1200,
  attendees: 892,
  image: "bg-gradient-to-br from-blue-500 to-purple-600",
  description: `Join us for the largest technology innovation summit of the year. This full-day event brings together industry leaders, startups, and technology enthusiasts to explore the latest trends shaping our digital future.

What to expect:
- Keynote speeches from Fortune 500 CTOs
- Hands-on workshops on AI, Cloud, and Cybersecurity
- Networking sessions with industry professionals
- Startup showcase and pitch competition
- Panel discussions on emerging technologies

Whether you're a seasoned professional or just starting your tech journey, the Tech Innovation Summit offers invaluable insights and connections that will accelerate your career and business growth.`,
  gallery: [
    "bg-gradient-to-br from-blue-400 to-indigo-500",
    "bg-gradient-to-br from-purple-400 to-pink-500",
    "bg-gradient-to-br from-cyan-400 to-teal-500",
    "bg-gradient-to-br from-rose-400 to-orange-500",
  ],
};

const similarEvents = [
  { id: "2", title: "AI Conference 2024", date: "Jan 20, 2025", category: "Business", image: "bg-gradient-to-br from-purple-500 to-indigo-600", price: 199 },
  { id: "3", title: "Startup Networking Night", date: "Jul 25, 2024", category: "Business", image: "bg-gradient-to-br from-emerald-500 to-teal-600", price: 25 },
  { id: "4", title: "Entrepreneurship Bootcamp", date: "Aug 10, 2024", category: "Education", image: "bg-gradient-to-br from-amber-500 to-orange-600", price: 0 },
];

const reviews = [
  { name: "Alex M.", rating: 5, comment: "Amazing event! The speakers were world-class and the networking opportunities were incredible.", date: "Dec 16, 2024" },
  { name: "Jessica L.", rating: 4, comment: "Very well organized. Would have liked more breakout sessions, but overall a great experience.", date: "Dec 15, 2024" },
  { name: "Ryan T.", rating: 5, comment: "Best tech conference I've attended this year. The AI workshop was particularly insightful.", date: "Dec 15, 2024" },
];

export function EventDetailPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
  const [registered, setRegistered] = useState(false);

  return (
    <div className="min-h-screen">
      <div className={`h-64 sm:h-80 ${event.image} relative flex items-end`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <Link href="/events" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-3">
            <ChevronLeft className="h-4 w-4" />
            Back to events
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{event.title}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {event.organizer}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 -mt-6 relative z-20">
          <div className="flex-1">
            <div className="rounded-xl border bg-background overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "Overview" && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="rounded-lg border px-4 py-3 text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Date</div>
                        <div className="font-semibold text-sm mt-1">{event.date}</div>
                      </div>
                      <div className="rounded-lg border px-4 py-3 text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Time</div>
                        <div className="font-semibold text-sm mt-1">{event.time}</div>
                      </div>
                      <div className="rounded-lg border px-4 py-3 text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Price</div>
                        <div className="font-semibold text-sm mt-1">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                      </div>
                      <div className="rounded-lg border px-4 py-3 text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Capacity</div>
                        <div className="font-semibold text-sm mt-1">{event.attendees}/{event.capacity}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">About this event</h3>
                      <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {event.description}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Gallery" && (
                  <div className="grid grid-cols-2 gap-4">
                    {event.gallery.map((gradient, i) => (
                      <div key={i} className={`h-48 rounded-xl ${gradient}`} />
                    ))}
                  </div>
                )}

                {activeTab === "Reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="font-semibold">4.7</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
                    </div>
                    {reviews.map((r, i) => (
                      <div key={i} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{r.name}</span>
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "Similar Events" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {similarEvents.map((e) => (
                      <Link key={e.id} href={`/events/${e.id}`} className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-24 ${e.image}`} />
                        <div className="p-3 space-y-1">
                          <div className="text-xs text-muted-foreground">{e.date}</div>
                          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{e.title}</h4>
                          <div className="text-xs font-medium">{e.price === 0 ? "Free" : `$${e.price}`}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-80 shrink-0 space-y-4">
            <div className="rounded-xl border bg-background p-6 space-y-4 sticky top-20">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </div>
                <div className="text-sm text-muted-foreground mt-1">per person</div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => setRegistered(!registered)}
              >
                <Ticket className="h-4 w-4" />
                {registered ? "Registered!" : "Register Now"}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {event.organizerAvatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{event.organizer}</div>
                    <div className="text-xs text-muted-foreground">Organizer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Event starts in 5 months
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
