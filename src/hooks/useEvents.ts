import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  images: string[];
  capacity: number;
  price: number;
  organizer: { _id: string; name: string; email: string; avatar?: string };
  status: "draft" | "pending" | "published" | "cancelled";
  views: number;
  attendeesCount: number;
  createdAt: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EventFilters {
  search?: string;
  category?: string;
  date?: string;
  location?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export function useEvents(filters: EventFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, String(v));
  });

  return useQuery<PaginatedResponse<Event>>({
    queryKey: ["events", filters],
    queryFn: () => apiClient(`/events?${params.toString()}`),
    placeholderData: (prev) => prev,
  });
}

export function useEvent(id: string) {
  return useQuery<{ success: boolean; data: Event }>({
    queryKey: ["event", id],
    queryFn: () => apiClient(`/events/${id}`),
    enabled: !!id,
  });
}

export function useRelatedEvents(id: string) {
  return useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ["events", "related", id],
    queryFn: () => apiClient(`/events/${id}/related`),
    enabled: !!id,
  });
}

export function useMyEvents() {
  return useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ["events", "mine"],
    queryFn: () => apiClient("/events/my-events"),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: Event }, ApiError, {
    title: string;
    description: string;
    category: string;
    date: string;
    location: string;
    images?: string[];
    capacity: number;
    price: number;
  }>({
    mutationFn: (data) => apiClient("/events", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: Event },
    ApiError,
    { id: string; data: Partial<Event> }
  >({
    mutationFn: ({ id, data }) => apiClient(`/events/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiError, string>({
    mutationFn: (id) => apiClient(`/events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
