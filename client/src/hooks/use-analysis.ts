import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAnalysis() {
  return useQuery({
    queryKey: [api.analysis.get.path],
    queryFn: async () => {
      const res = await fetch(api.analysis.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analysis");
      return api.analysis.get.responses[200].parse(await res.json());
    },
  });
}
