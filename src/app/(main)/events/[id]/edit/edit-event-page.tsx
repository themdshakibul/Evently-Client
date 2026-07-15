"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { useEvent, useUpdateEvent } from "@/hooks/useEvents";
import Link from "next/link";

const categories = [
  "Music", "Education", "Business", "Health",
  "Food & Drink", "Gaming", "Art & Culture", "Sports",
];

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

export function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: eventData, isLoading: loadingEvent } = useEvent(id);
  const updateMutation = useUpdateEvent();

  const event = eventData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (event) {
      const dateObj = new Date(event.date);
      const dateStr = dateObj.toISOString().split("T")[0];
      const timeStr = dateObj.toTimeString().split(":").slice(0, 2).join(":");
      reset({
        title: event.title,
        description: event.description,
        category: event.category,
        date: dateStr,
        time: timeStr,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: EventForm) => {
    try {
      const dateTime = `${data.date}T${data.time}:00`;
      await updateMutation.mutateAsync({
        id,
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          date: dateTime,
          location: data.location,
          capacity: data.capacity,
          price: data.price,
        },
      });
      toast.success("Event updated successfully!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to update event");
    }
  };

  if (loadingEvent) {
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
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground mt-1">Update your event details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-xl border bg-background p-6 space-y-5">
            <h2 className="font-semibold">Basic Information</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                {...register("title")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
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

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 gap-2" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
