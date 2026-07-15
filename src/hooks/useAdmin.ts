import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type { Event, User } from "@/types";

interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  totalViews: number;
}

export function useAdminStats() {
  return useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ["admin", "stats"],
    queryFn: () => apiClient("/admin/stats"),
  });
}

export function useAdminEvents() {
  return useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ["admin", "events"],
    queryFn: () => apiClient("/admin/events"),
  });
}

export function useAdminUsers() {
  return useQuery<{ success: boolean; data: User[] }>({
    queryKey: ["admin", "users"],
    queryFn: () => apiClient("/admin/users"),
  });
}

export function useAdminDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiError, string>({
    mutationFn: (id) => apiClient(`/admin/events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function usePendingEvents() {
  return useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ["admin", "events", "pending"],
    queryFn: () => apiClient("/admin/events/pending"),
  });
}

export function useApproveEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: Event }, ApiError, string>({
    mutationFn: (id) => apiClient(`/admin/events/${id}/approve`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useRejectEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: Event }, ApiError, string>({
    mutationFn: (id) => apiClient(`/admin/events/${id}/reject`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
