import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface AuthUser {
  id: number;
  username: string;
  email?: string | null;
  displayName?: string | null;
}

interface AuthState {
  authenticated: boolean;
  user: AuthUser | null;
}

export function useAuthUser() {
  return useQuery<AuthState>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await fetch(`${basePath}/api/auth/user`, {
        credentials: "include",
      });
      if (!res.ok) return { authenticated: false, user: null };
      return res.json();
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${basePath}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}
