import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays } from "date-fns";

export const useSteps = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const todayQuery = useQuery({
    queryKey: ["steps", "today", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("step_logs")
        .select("*")
        .eq("user_id", user!.id)
        .eq("date", today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const weekQuery = useQuery({
    queryKey: ["steps", "week", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const weekAgo = format(subDays(new Date(), 6), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("step_logs")
        .select("*")
        .eq("user_id", user!.id)
        .gte("date", weekAgo)
        .order("date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const logSteps = useMutation({
    mutationFn: async (steps: number) => {
      const { error } = await supabase
        .from("step_logs")
        .upsert({ user_id: user!.id, date: today, steps }, { onConflict: "user_id,date" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["steps"] });
    },
  });

  return {
    todaySteps: todayQuery.data,
    weekSteps: weekQuery.data ?? [],
    isLoading: todayQuery.isLoading,
    logSteps,
  };
};
