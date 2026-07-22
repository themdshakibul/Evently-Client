"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  User,
  Share2,
  Bookmark,
  Ticket,
  ChevronLeft,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/protected-route";
import { useEvent, useRelatedEvents } from "@/hooks/useEvents";
import { useRegisterForEvent, useCancelRegistration, useMyRegistrations } from "@/hooks/useRegistrations";
import { useAuth } from "@/components/providers";
import { toast } from "sonner";

const tabs = ["Overview", "Gallery", "Reviews", "Similar Events"] as const;

export function EventDetailPage() {
  return (
    <ProtectedRoute>
      <EventDetailContent />
    </ProtectedRoute>
  );
}

function EventDetailContent() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: eventData, isLoading } = useEvent(id);
  const { data: relatedData } = useRelatedEvents(id);
  const { data: myRegsData } = useMyRegistrations(!!user);
  const registerMutation = useRegisterForEvent();
  const cancelMutation = useCancelRegistration();

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");

  const event = eventData?.data;
  const related = relatedData?.data || [];
  const myRegs = myRegsData?.data || [];
  const isRegistered = myRegs.some((r) => (typeof r.event === "string" ? r.event === id : r.event._id === id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">Event not found</p>
        <Link href="/events">
          <Button variant="outline">Back to events</Button>
        </Link>
      </div>
    );
  }

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync(id);
      toast.success("Successfully registered for this event!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register";
      toast.error(msg);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Registration cancelled");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel registration";
      toast.error(msg);
    }
  };

  const organizerName = typeof event.organizer === "object" ? event.organizer.name : "Organizer";
  const organizerInitial = typeof event.organizer === "object" ? event.organizer.name.charAt(0).toUpperCase() : "O";

  return (
    <div className="min-h-screen">
      <div className={`h-64 sm:h-80 ${event.images.length > 0 ? "" : "bg-gradient-to-br from-blue-500 to-purple-600"} relative flex items-end`}>
        {event.images.length > 0 ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${event.images[0]})` }} />
        ) : null}
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
              {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
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
                        <div className="font-semibold text-sm mt-1">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </div>
                      <div className="rounded-lg border px-4 py-3 text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Price</div>
                        <div className="font-semibold text-sm mt-1">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                      </div>
                      <div className="rounded-lg border px-4 py-3 text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Capacity</div>
                        <div className="font-semibold text-sm mt-1">{event.attendeesCount}/{event.capacity}</div>
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
                    {event.images.length === 0 ? (
                      <p className="text-sm text-muted-foreground col-span-2 text-center py-8">No images available</p>
                    ) : (
                      event.images.map((img, i) => (
                        <div key={i} className="h-48 rounded-xl bg-muted overflow-hidden">
                          <img src={img} alt={`${event.title} ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "Reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="font-semibold">4.7</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(3 reviews)</span>
                    </div>
                    <div className="text-sm text-muted-foreground text-center py-8">Reviews coming soon</div>
                  </div>
                )}

                {activeTab === "Similar Events" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {related.length === 0 ? (
                      <p className="text-sm text-muted-foreground col-span-full text-center py-8">No similar events found</p>
                    ) : (
                      related.map((e) => (
                        <Link key={e._id} href={`/events/${e._id}`} className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                          <div className={`h-24 ${e.images?.length > 0 ? "bg-cover bg-center" : "bg-gradient-to-br from-primary/20 to-primary/10"}`} style={e.images?.length > 0 ? { backgroundImage: `url(${e.images[0]})` } : {}} />
                          <div className="p-3 space-y-1">
                            <div className="text-xs text-muted-foreground">
                              {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{e.title}</h4>
                            <div className="text-xs font-medium">{e.price === 0 ? "Free" : `$${e.price}`}</div>
                          </div>
                        </Link>
                      ))
                    )}
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

              {user ? (
                isRegistered ? (
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Ticket className="h-4 w-4" />
                    )}
                    {cancelMutation.isPending ? "Cancelling..." : "Registered!"}
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Ticket className="h-4 w-4" />
                    )}
                    {registerMutation.isPending ? "Registering..." : "Register Now"}
                  </Button>
                )
              ) : (
                <Link href="/login">
                  <Button className="w-full gap-2" size="lg">
                    <Ticket className="h-4 w-4" />
                    Login to Register
                  </Button>
                </Link>
              )}

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
                    {organizerInitial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{organizerName}</div>
                    <div className="text-xs text-muted-foreground">Organizer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {event.attendeesCount} / {event.capacity} registered
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
