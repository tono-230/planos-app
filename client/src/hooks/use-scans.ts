import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type SubmitScansInput = z.infer<typeof api.scans.submit.input>;

export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scans");
      return api.scans.list.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitScans() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmitScansInput) => {
      const validated = api.scans.submit.input.parse(data);
      const res = await fetch(api.scans.submit.path, {
        method: api.scans.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit scans");
      return api.scans.submit.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analysis.get.path] });
    },
  });
}

export function useClearScans() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.scans.clear.path, {
        method: api.scans.clear.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear scans");
      return api.scans.clear.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analysis.get.path] });
    },
  });
}
