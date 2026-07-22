import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type { Event } from "@/types";

export function useSavedEvents(enabled?: boolean) {
  return useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ["saved-events"],
    queryFn: () => apiClient("/users/me/saved-events"),
    enabled,
  });
}

export function useSaveEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiError, string>({
    mutationFn: (eventId) => apiClient(`/users/me/saved-events/${eventId}`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
    },
  });
}

export function useUnsaveEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiError, string>({
    mutationFn: (eventId) => apiClient(`/users/me/saved-events/${eventId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
    },
  });
}