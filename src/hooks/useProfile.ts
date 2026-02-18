import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  goal: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Omit<Profile, "id" | "user_id">>) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", user?.id] }),
  });

  return { profile: query.data, isLoading: query.isLoading, updateProfile };
};
