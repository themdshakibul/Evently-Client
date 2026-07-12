"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, X, AlertTriangle, Loader2 } from "lucide-react";

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

function DeleteModal({
  event,
  onClose,
  onConfirm,
  deleting,
}: {
  event: EventItem;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="font-semibold text-lg">Delete Event</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={deleting}
            className="gap-2"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b animate-pulse">
      <td className="px-4 py-3"><div className="h-4 w-40 bg-muted rounded" /></td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 w-24 bg-muted rounded" /></td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-5 w-20 bg-muted rounded-full" /></td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-12 bg-muted rounded" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 bg-muted rounded ml-auto" /></td>
    </tr>
  );
}

export function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(myEvents);
  const [loading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleting(false);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor your events.</p>
          </div>
          <Link href="/events/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </Link>
        </div>

        {loading ? (
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
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              📅
            </div>
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first event and it will appear here. You can manage, edit, and track your events from this dashboard.
            </p>
            <Link href="/events/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border bg-background overflow-hidden">
            <div className="overflow-x-auto">
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
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{event.views.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/events/${event.id}`}
                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Link>
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(event)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal
          event={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}
