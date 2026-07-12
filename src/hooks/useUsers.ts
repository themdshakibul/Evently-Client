import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

export function useProfile() {
  return useQuery<{ success: boolean; data: UserProfile }>({
    queryKey: ["profile"],
    queryFn: () => apiClient("/users/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: UserProfile }, Error, { name?: string; avatar?: string }>({
    mutationFn: (data) => apiClient("/users/me", { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
