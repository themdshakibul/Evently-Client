"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  date: string;
  status: "published" | "draft" | "cancelled";
  views: number;
}

const myEvents: EventItem[] = [
  { id: "1", title: "Tech Innovation Summit", date: "Dec 15, 2024", status: "published", views: 1234 },
  { id: "2", title: "Startup Networking Night", date: "Jul 25, 2024", status: "published", views: 567 },
  { id: "3", title: "AI Workshop", date: "Aug 10, 2024", status: "draft", views: 0 },
];

const statusColors: Record<string, string> = {
  published: "bg-green-500/10 text-green-600",
  draft: "bg-yellow-500/10 text-yellow-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export function ManageEventsPage() {
  const [events] = useState<EventItem[]>(myEvents);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-muted-foreground mt-1">Manage your events.</p>
          </div>
          <Link href="/events/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">Create your first event to get started.</p>
            <Link href="/events/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border bg-background overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 text-sm font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-sm font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">Views</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-sm">{event.title}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{event.date}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{event.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="View">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Edit">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
