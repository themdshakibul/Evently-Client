"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/providers";
import { useMyEvents, useDeleteEvent, useCreateEvent } from "@/hooks/useEvents";
import { useUpdateProfile } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  Calendar,
  Users,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  LayoutDashboard,
  User,
  Save,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const statusColors: Record<string, string> = {
  published: "bg-green-500/10 text-green-600 border-green-200",
  draft: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  cancelled: "bg-red-500/10 text-red-600 border-red-200",
};

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Select a category"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
});

type EventForm = z.infer<typeof eventSchema>;

const categories = [
  "Music", "Education", "Business", "Health",
  "Food & Drink", "Gaming", "Art & Culture", "Sports",
];

type Tab = "overview" | "events" | "create" | "profile";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "events", label: "My Events", icon: Calendar },
  { id: "create", label: "Create Event", icon: Plus },
  { id: "profile", label: "Profile", icon: User },
];

function DeleteModal({
  event,
  onClose,
  onConfirm,
  deleting,
}: {
  event: { _id: string; title: string };
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
          <Button variant="destructive" onClick={onConfirm} disabled={deleting} className="gap-2">
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-background p-5 flex items-start gap-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data: eventsData, isLoading } = useMyEvents();
  const events = eventsData?.data || [];
  const publishedCount = events.filter((e) => e.status === "published").length;
  const draftCount = events.filter((e) => e.status === "draft").length;
  const totalViews = events.reduce((sum, e) => sum + e.views, 0);

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Total Events" value={events.length} />
        <StatCard icon={FileText} label="Published" value={publishedCount} />
        <StatCard icon={BarChart3} label="Drafts" value={draftCount} />
        <StatCard icon={Users} label="Total Views" value={totalViews.toLocaleString()} />
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Events</h2>
        {isLoading ? (
          <div className="rounded-xl border bg-background p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="rounded-xl border bg-background p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">Create your first event to get started.</p>
          </div>
        ) : (
          <div className="rounded-xl border bg-background overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 text-sm font-medium">Event</th>
                    <th className="text-left px-4 py-3 text-sm font-medium hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">Status</th>
                    <th className="text-right px-4 py-3 text-sm font-medium">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr key={event._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm truncate max-w-[200px]">{event.title}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[event.status] || ""}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground text-right">{event.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function EventsTab() {
  const { data: eventsData, isLoading, error } = useMyEvents();
  const deleteMutation = useDeleteEvent();
  const [deleteTarget, setDeleteTarget] = useState<{ _id: string; title: string } | null>(null);

  const events = eventsData?.data || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      toast.success("Event deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-destructive/5 p-8 text-center">
        <p className="text-destructive font-medium">Failed to load events</p>
        <p className="text-sm text-muted-foreground mt-1">Please try again later.</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No events yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Create your first event from the dashboard.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 text-sm font-medium">Event</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden lg:table-cell">Views</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="min-w-0 max-w-[200px] lg:max-w-xs">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{event.category}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[event.status] || "bg-gray-500/10 text-gray-600 border-gray-200"}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{event.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/events/${event._id}`}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <Link
                        href={`/events/${event._id}/edit`}
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

      {deleteTarget && (
        <DeleteModal
          event={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleteMutation.isPending}
        />
      )}
    </>
  );
}

function CreateEventTab() {
  const createMutation = useCreateEvent();

  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: { price: 0, capacity: 100 },
  });

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) return false;
      if (f.size > 5 * 1024 * 1024) return false;
      return true;
    });
    setImages((prev) => [
      ...prev,
      ...valid.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EventForm) => {
    try {
      const dateTime = `${data.date}T${data.time}:00`;
      await createMutation.mutateAsync({
        title: data.title,
        description: data.description,
        category: data.category,
        date: dateTime,
        location: data.location,
        capacity: data.capacity,
        price: data.price,
        images: images.map((i) => i.preview),
      });
      toast.success("Event created successfully!");
      reset();
      setImages([]);
    } catch {
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border bg-background p-6 space-y-5">
          <h2 className="font-semibold">Basic Information</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              {...register("title")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter event title"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              rows={5}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              placeholder="Describe your event in detail..."
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              {...register("category")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-6 space-y-5">
          <h2 className="font-semibold">Date & Location</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                {...register("date")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <input
                type="time"
                {...register("time")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <input
              {...register("location")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Event venue or online link"
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-6 space-y-5">
          <h2 className="font-semibold">Capacity & Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              <input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-6 space-y-5">
          <h2 className="font-semibold">Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                <img
                  src={img.preview}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors text-muted-foreground">
              <Plus className="h-6 w-6" />
              <span className="text-xs">Add Image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={addImages}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 gap-2" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {createMutation.isPending ? "Creating..." : "Create Event"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProfileTab() {
  const { user, logout } = useAuth();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile.mutateAsync({ name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-xl border bg-background p-6 space-y-4">
        <h2 className="font-semibold">Account Information</h2>

        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg border border-input bg-muted px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <Button onClick={handleSave} disabled={saving || !name.trim()} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6 space-y-4">
        <h2 className="font-semibold">Account Actions</h2>
        <p className="text-sm text-muted-foreground">Sign out of your account.</p>
        <Button variant="destructive" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ActiveComponent = {
    overview: OverviewTab,
    events: EventsTab,
    create: CreateEventTab,
    profile: ProfileTab,
  }[activeTab];

  return (
    <div className="min-h-screen flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="border-t p-4 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-20 border-b bg-background px-4 py-2 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            {tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}
          </span>
        </div>

        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold">
              {activeTab === "overview" && `Welcome back, ${user?.name?.split(" ")[0]}`}
              {activeTab === "events" && "My Events"}
              {activeTab === "create" && "Create Event"}
              {activeTab === "profile" && "Profile"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "overview" && "Here&apos;s what&apos;s happening with your events."}
              {activeTab === "events" && "Manage and monitor all your events."}
              {activeTab === "create" && "Fill in the details to publish a new event."}
              {activeTab === "profile" && "Manage your account settings."}
            </p>
          </div>

          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
