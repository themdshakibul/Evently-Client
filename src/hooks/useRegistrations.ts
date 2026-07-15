import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type { Registration } from "@/types";

export function useMyRegistrations(enabled?: boolean) {
  return useQuery<{ success: boolean; data: Registration[] }>({
    queryKey: ["registrations", "mine"],
    queryFn: () => apiClient("/registrations/my"),
    enabled,
    retry: false,
  });
}

export function useEventRegistrations(eventId: string) {
  return useQuery<{ success: boolean; data: Registration[] }>({
    queryKey: ["registrations", "event", eventId],
    queryFn: () => apiClient(`/events/${eventId}/registrations`),
    enabled: !!eventId,
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: Registration }, ApiError, string>({
    mutationFn: (eventId) => apiClient(`/events/${eventId}/register`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useCancelRegistration() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiError, string>({
    mutationFn: (eventId) => apiClient(`/events/${eventId}/register`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
