"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/providers";
import { useMyEvents, useDeleteEvent, useCreateEvent } from "@/hooks/useEvents";
import { useMyRegistrations, useEventRegistrations, useCancelRegistration } from "@/hooks/useRegistrations";
import { useSavedEvents, useUnsaveEvent } from "@/hooks/useSavedEvents";
import { useUpdateProfile } from "@/hooks/useUsers";
import { useAdminStats, useAdminEvents, useAdminUsers, useAdminDeleteEvent, usePendingEvents, useApproveEvent, useRejectEvent } from "@/hooks/useAdmin";
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
  List,
  ChevronLeft,
  Globe,
  Shield,
  Clock,
  PieChart,
  Activity,
  Bookmark,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart as RePieChart, Pie, Cell,
  AreaChart, Area,
  ComposedChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";

const statusColors: Record<string, string> = {
  published: "bg-green-500/10 text-green-600 border-green-200",
  pending: "bg-orange-500/10 text-orange-600 border-orange-200",
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
  const { data: regsData } = useMyRegistrations();
  const { data: savedData } = useSavedEvents();
  const events = eventsData?.data || [];
  const myRegs = regsData?.data || [];
  const savedEvents = savedData?.data || [];
  const publishedCount = events.filter((e) => e.status === "published").length;
  const draftCount = events.filter((e) => e.status === "draft").length;
  const totalViews = events.reduce((sum, e) => sum + e.views, 0);
  const totalRegistrations = events.reduce((sum, e) => sum + e.attendeesCount, 0);

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
        <StatCard icon={Calendar} label="Total Events" value={events.length} />
        <StatCard icon={FileText} label="Published" value={publishedCount} />
        <StatCard icon={BarChart3} label="Drafts" value={draftCount} />
        <StatCard icon={Users} label="Registrations" value={totalRegistrations.toLocaleString()} />
        <StatCard icon={Ticket} label="My Registered" value={myRegs.length} />
        <StatCard icon={Bookmark} label="Saved Events" value={savedEvents.length} />
        <StatCard icon={Eye} label="Total Views" value={totalViews.toLocaleString()} />
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
                <Image
                  src={img.preview}
                  alt={`Preview ${i + 1}`}
                  fill
                  className="object-cover"
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

function RegistrationsTab() {
  const { data: eventsData, isLoading } = useMyEvents();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { data: regsData } = useEventRegistrations(selectedEvent || "");

  const events = eventsData?.data || [];
  const registrations = regsData?.data || [];

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No registrations yet</h3>
        <p className="text-muted-foreground mb-6">Create and publish events to see registrations here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedEvent ? (
        <div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to all events
          </button>

          {registrations.length === 0 ? (
            <div className="rounded-xl border bg-background p-12 text-center">
              <p className="text-muted-foreground">No one has registered for this event yet.</p>
            </div>
          ) : (
            <div className="rounded-xl border bg-background overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium hidden sm:table-cell">Email</th>
                      <th className="text-right px-4 py-3 text-sm font-medium">Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => {
                      const regUser = typeof reg.user === "object" ? reg.user : null;
                      return (
                        <tr key={reg._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                                {regUser?.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <span className="font-medium text-sm">{regUser?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                            {regUser?.email || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground text-right">
                            {new Date(reg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event._id} className="rounded-xl border bg-background p-5 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {event.attendeesCount} / {event.capacity} registered
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shrink-0 ml-4"
                onClick={() => setSelectedEvent(event._id)}
              >
                <List className="h-4 w-4" />
                View
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MyRegisteredTab() {
  const { data: regsData, isLoading } = useMyRegistrations();
  const cancelMutation = useCancelRegistration();
  const regs = regsData?.data || [];

  const handleCancel = async (eventId: string) => {
    try {
      await cancelMutation.mutateAsync(eventId);
      toast.success("Registration cancelled");
    } catch {
      toast.error("Failed to cancel registration");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (regs.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Ticket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No registrations yet</h3>
        <p className="text-muted-foreground mb-6">
          Register for events to see them here.
        </p>
        <Link href="/events">
          <Button className="gap-2">
            <Eye className="h-4 w-4" />
            Browse Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {regs.map((reg) => {
        const ev = typeof reg.event === "object" ? reg.event : null;
        if (!ev) return null;
        return (
          <div key={reg._id} className="rounded-xl border bg-background p-5 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link href={`/events/${ev._id}`} className="font-medium text-sm hover:underline truncate block">
                {ev.title}
              </Link>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                <span>{new Date(ev.date).toLocaleDateString()}</span>
                <span>{ev.location}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0 text-destructive hover:text-destructive"
              onClick={() => handleCancel(ev._id)}
              disabled={cancelMutation.isPending && cancelMutation.variables === ev._id}
            >
              {cancelMutation.isPending && cancelMutation.variables === ev._id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              Cancel
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function SavedEventsTab() {
  const { data: savedData, isLoading } = useSavedEvents();
  const unsaveMutation = useUnsaveEvent();
  const events = (savedData?.data || []).filter(Boolean);

  const handleUnsave = async (eventId: string) => {
    try {
      await unsaveMutation.mutateAsync(eventId);
      toast.success("Event removed from saved");
    } catch {
      toast.error("Failed to remove event");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Bookmark className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No saved events</h3>
        <p className="text-muted-foreground mb-6">
          Save events to come back to them later.
        </p>
        <Link href="/events">
          <Button className="gap-2">
            <Eye className="h-4 w-4" />
            Browse Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {events.map((ev) => (
        <div key={ev._id} className="rounded-xl border bg-background p-5 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link href={`/events/${ev._id}`} className="font-medium text-sm hover:underline truncate block">
              {ev.title}
            </Link>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
              <span>{new Date(ev.date).toLocaleDateString()}</span>
              <span>{ev.location}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0 text-destructive hover:text-destructive"
            onClick={() => handleUnsave(ev._id)}
            disabled={unsaveMutation.isPending && unsaveMutation.variables === ev._id}
          >
            {unsaveMutation.isPending && unsaveMutation.variables === ev._id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bookmark className="h-3.5 w-3.5 fill-current" />
            )}
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

const CHART_COLORS = ["hsl(var(--primary))", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6"];

function AdminOverviewTab() {
  const { data: statsData, isLoading: statsLoading } = useAdminStats();
  const { data: eventsData, isLoading: eventsLoading } = useAdminEvents();
  const stats = statsData?.data;
  const events = useMemo(() => eventsData?.data || [], [eventsData]);

  const monthlyTrend = useMemo(() => {
    const months: Record<string, number> = {};
    const n = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(n.getFullYear(), n.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months[key] = 0;
    }
    events.forEach((e) => {
      const d = new Date(e.createdAt);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([month, count]) => ({ month, events: count }));
  }, [events]);

  const categoryPerformance = useMemo(() => {
    const map: Record<string, { events: number; attendees: number; capacity: number; views: number }> = {};
    events.forEach((e) => {
      if (!map[e.category]) map[e.category] = { events: 0, attendees: 0, capacity: 0, views: 0 };
      map[e.category].events++;
      map[e.category].attendees += e.attendeesCount;
      map[e.category].capacity += e.capacity;
      map[e.category].views += e.views;
    });
    return Object.entries(map)
      .map(([name, d]) => ({
        name,
        events: d.events,
        attendees: d.attendees,
        fillRate: d.capacity > 0 ? Math.round((d.attendees / d.capacity) * 100) : 0,
        views: d.views,
      }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 6);
  }, [events]);

  const radarData = useMemo(() => {
    if (!stats || events.length === 0) return [];
    const avgAttendees = events.reduce((s, e) => s + e.attendeesCount, 0) / events.length;
    const publishedRatio = events.filter((e) => e.status === "published").length / events.length;
    return [
      { metric: "Events", value: Math.min(stats.totalEvents * 2, 100) },
      { metric: "Users", value: Math.min(stats.totalUsers / 2, 100) },
      { metric: "Registration", value: Math.min(stats.totalRegistrations / 5, 100) },
      { metric: "Views", value: Math.min(stats.totalViews / 100, 100) },
      { metric: "Attendance", value: Math.min(avgAttendees * 10, 100) },
      { metric: "Published", value: Math.round(publishedRatio * 100) },
    ];
  }, [stats, events]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { published: 0, pending: 0, draft: 0, cancelled: 0 };
    events.forEach((e) => { counts[e.status] = (counts[e.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [events]);

  const barData = useMemo(() => {
    if (!stats) return [];
    return [
      { metric: "Events", value: stats.totalEvents },
      { metric: "Users", value: stats.totalUsers },
      { metric: "Registrations", value: stats.totalRegistrations },
      { metric: "Views", value: stats.totalViews },
    ];
  }, [stats]);

  const trendConfig = { events: { label: "Events Created", color: "hsl(var(--primary))" } };
  const barConfig = {
    Events: { label: "Events", color: "hsl(var(--primary))" },
    Users: { label: "Users", color: "#8b5cf6" },
    Registrations: { label: "Registrations", color: "#f59e0b" },
    Views: { label: "Views", color: "#10b981" },
  };
  const statusConfig = Object.fromEntries(
    statusData.map((d, i) => [d.name.toLowerCase(), { label: d.name, color: CHART_COLORS[i % CHART_COLORS.length] }])
  );
  const compConfig = {
    events: { label: "Events", color: "hsl(var(--primary))" },
    fillRate: { label: "Fill Rate %", color: "#f59e0b" },
  };
  const radarConfig = Object.fromEntries(
    radarData.map((d) => [d.metric.toLowerCase(), { label: d.metric, color: "hsl(var(--primary))" }])
  );

  if (statsLoading || eventsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-background p-5 h-24 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-background p-6 h-72 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Globe} label="Total Events" value={stats?.totalEvents ?? 0} />
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard icon={FileText} label="Registrations" value={(stats?.totalRegistrations ?? 0).toLocaleString()} />
        <StatCard icon={Eye} label="Total Views" value={(stats?.totalViews ?? 0).toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="rounded-xl border bg-background p-6 hover:shadow-md transition-shadow lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Event Creation Trend</h3>
              <p className="text-[11px] text-muted-foreground">Monthly trend with average reference</p>
            </div>
          </div>
          <ChartContainer config={trendConfig} className="h-64 aspect-auto">
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={8} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dx={-4} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <ReferenceLine y={monthlyTrend.reduce((s, m) => s + m.events, 0) / monthlyTrend.length} stroke="hsl(var(--muted-foreground))" strokeDasharray="6 4" strokeOpacity={0.5} label={{ value: "Avg", position: "insideTopRight", fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Area type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#trendFill)" dot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }} animationDuration={900} animationEasing="ease-out" />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border bg-background p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center ring-1 ring-purple-500/10">
              <PieChart className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Event Status</h3>
              <p className="text-[11px] text-muted-foreground">Distribution by status</p>
            </div>
          </div>
          <ChartContainer config={statusConfig} className="h-56 aspect-auto">
            <RePieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value" nameKey="name" animationBegin={200} animationDuration={800} animationEasing="ease-out">
                {statusData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="hsl(var(--background))" strokeWidth={2} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            </RePieChart>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
            {statusData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full ring-1 ring-offset-1 ring-offset-background" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-xs text-muted-foreground">{item.name} <span className="font-medium text-foreground">{item.value}</span></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="rounded-xl border bg-background p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center ring-1 ring-amber-500/10">
              <BarChart3 className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Platform Metrics</h3>
              <p className="text-[11px] text-muted-foreground">Key performance indicators</p>
            </div>
          </div>
          <ChartContainer config={barConfig} className="h-64 aspect-auto">
            <BarChart data={barData} barSize={44} barGap={8}>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
              <XAxis dataKey="metric" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={8} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dx={-4} />
              <ChartTooltip cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.3 }} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800} animationEasing="ease-out">
                {barData.map((entry, i) => (
                  <Cell key={i} fill={[ "hsl(var(--primary))", "#8b5cf6", "#f59e0b", "#10b981" ][i]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {radarData.length > 0 && (
          <div className="rounded-xl border bg-background p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center ring-1 ring-cyan-500/10">
                <Activity className="h-4 w-4 text-cyan-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Performance Radar</h3>
                <p className="text-[11px] text-muted-foreground">Multi-dimensional analysis</p>
              </div>
            </div>
            <ChartContainer config={radarConfig} className="h-64 aspect-auto">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary))" fillOpacity={0.15} animationDuration={900} animationEasing="ease-out" />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              </RadarChart>
            </ChartContainer>
          </div>
        )}

        {categoryPerformance.length > 0 && (
          <div className="rounded-xl border bg-background p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center ring-1 ring-emerald-500/10">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Category Performance</h3>
                <p className="text-[11px] text-muted-foreground">Events vs fill rate</p>
              </div>
            </div>
            <ChartContainer config={compConfig} className="h-64 aspect-auto">
              <ComposedChart data={categoryPerformance} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.4} horizontal={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={6} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dx={-4} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dx={4} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.2 }} content={<ChartTooltipContent indicator="line" />} />
                <Bar yAxisId="left" dataKey="events" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={800} />
                <Line yAxisId="right" type="monotone" dataKey="fillRate" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b", stroke: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={900} />
              </ComposedChart>
            </ChartContainer>
          </div>
        )}

      </div>
    </div>
  );
}

function AdminAllEventsTab() {
  const { data: eventsData, isLoading } = useAdminEvents();
  const deleteMutation = useAdminDeleteEvent();
  const [deleteTarget, setDeleteTarget] = useState<{ _id: string; title: string } | null>(null);

  const events = eventsData?.data || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      toast.success("Event deleted");
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

  if (events.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <p className="text-muted-foreground">No events in the system yet.</p>
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
                <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">Organizer</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium hidden lg:table-cell">Registrations</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm truncate max-w-[200px]">{event.title}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {typeof event.organizer === "object" ? event.organizer.name : "N/A"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[event.status] || ""}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                    {event.attendeesCount}/{event.capacity}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/events/${event._id}`} className="p-1.5 rounded-md hover:bg-muted" title="View">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(event)}
                        className="p-1.5 rounded-md hover:bg-destructive/10"
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

function AdminPendingTab() {
  const { data: pendingData, isLoading } = usePendingEvents();
  const approveMutation = useApproveEvent();
  const rejectMutation = useRejectEvent();

  const pending = pendingData?.data || [];

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success("Event approved and published!");
    } catch {
      toast.error("Failed to approve event");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync(id);
      toast.success("Event rejected");
    } catch {
      toast.error("Failed to reject event");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No pending events</h3>
        <p className="text-muted-foreground">All events have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((event) => (
        <div key={event._id} className="rounded-xl border bg-background p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{event.title}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors.pending}`}>
                  Pending
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{event.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{event.category}</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span>{event.location}</span>
                <span>by {typeof event.organizer === "object" ? event.organizer.name : "Unknown"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => handleApprove(event._id)}
                disabled={approveMutation.isPending && approveMutation.variables === event._id}
              >
                {approveMutation.isPending && approveMutation.variables === event._id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => handleReject(event._id)}
                disabled={rejectMutation.isPending && rejectMutation.variables === event._id}
              >
                {rejectMutation.isPending && rejectMutation.variables === event._id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminUsersTab() {
  const { data: usersData, isLoading } = useAdminUsers();
  const users = usersData?.data || [];

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 text-sm font-medium">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Role</th>
              <th className="text-right px-4 py-3 text-sm font-medium hidden md:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    user.role === "admin"
                      ? "bg-purple-500/10 text-purple-600 border border-purple-200"
                      : "bg-blue-500/10 text-blue-600 border border-blue-200"
                  }`}>
                    {user.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground text-right hidden md:table-cell">
                  {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = user?.role === "admin";
  const activeTab = searchParams.get("tab") || "overview";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setActiveTab = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "overview") params.delete("tab");
    else params.set("tab", tab);
    router.replace(`/dashboard${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }, [router, searchParams]);

  const userTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "My Events", icon: Calendar },
    { id: "my-registrations", label: "My Registered", icon: Ticket },
    { id: "saved-events", label: "Saved Events", icon: Bookmark },
    { id: "registrations", label: "Registrations", icon: Users },
    { id: "create", label: "Create Event", icon: Plus },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  const adminTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "all-events", label: "All Events", icon: Globe },
    { id: "users", label: "Users", icon: Shield },
    { id: "create", label: "Create Event", icon: Plus },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  const tabs = isAdmin ? adminTabs : userTabs;

  const userComponents: Record<string, React.ElementType> = {
    overview: OverviewTab,
    events: EventsTab,
    "my-registrations": MyRegisteredTab,
    "saved-events": SavedEventsTab,
    registrations: RegistrationsTab,
    create: CreateEventTab,
    profile: ProfileTab,
  };

  const adminComponents: Record<string, React.ElementType> = {
    overview: AdminOverviewTab,
    pending: AdminPendingTab,
    "all-events": AdminAllEventsTab,
    users: AdminUsersTab,
    create: CreateEventTab,
    profile: ProfileTab,
  };

  const components = isAdmin ? adminComponents : userComponents;
  const ActiveComponent = components[activeTab] || components.overview;

  return (
    <div className="min-h-screen flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background flex flex-col transform transition-transform duration-200 lg:translate-x-0 h-screen ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Link href="/" className="h-14 flex items-center gap-2.5 px-5 border-b hover:bg-muted/40 transition-colors">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            E
          </div>
          <span className="font-bold text-lg tracking-tight">Evently</span>
        </Link>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Menu
          </p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`relative flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {activeTab === tab.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary" />
              )}
              <tab.icon className={`h-4 w-4 shrink-0 ${activeTab === tab.id ? "text-primary" : ""}`} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t p-3 space-y-2">
          <Link
            href="/"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          >
            <Home className="h-4 w-4 shrink-0" />
            Back to Home
          </Link>
          <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate leading-tight">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold mt-1 capitalize ${
                  user?.role === "admin"
                    ? "bg-purple-500/15 text-purple-600"
                    : "bg-blue-500/15 text-blue-600"
                }`}>
                  {user?.role === "admin" ? <Shield className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0 lg:pl-64">
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
              {activeTab === "pending" && "Pending Approval"}
              {activeTab === "events" && "My Events"}
              {activeTab === "my-registrations" && "My Registered Events"}
              {activeTab === "saved-events" && "Saved Events"}
              {activeTab === "registrations" && "Registrations"}
              {activeTab === "all-events" && "All Events"}
              {activeTab === "users" && "Users"}
              {activeTab === "create" && "Create Event"}
              {activeTab === "profile" && "Profile"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "pending" && "Review and approve or reject events submitted by users."}
              {activeTab === "overview" && (isAdmin ? "Platform overview and statistics." : "Here&apos;s what&apos;s happening with your events.")}
              {activeTab === "events" && "Manage and monitor all your events."}
              {activeTab === "my-registrations" && "Events you have registered for."}
              {activeTab === "saved-events" && "Events you have bookmarked."}
              {activeTab === "registrations" && "View who registered for your events."}
              {activeTab === "all-events" && "Manage all events on the platform."}
              {activeTab === "users" && "View all registered users."}
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
