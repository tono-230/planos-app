import { useState } from "react";
import { useLocations } from "@/hooks/use-locations";
import { useProducts } from "@/hooks/use-products";
import { usePlans, useCreatePlan, useDeletePlan } from "@/hooks/use-plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Check, Pencil, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BRAND_COLORS: Record<string, string> = {
  AIR: "bg-blue-500",
  SUN: "bg-orange-500",
  GB: "bg-emerald-500",
  JD: "bg-indigo-500",
  ES: "bg-rose-500",
  KM: "bg-slate-700",
  NICHE: "bg-purple-500",
  MOVE: "bg-cyan-600",
  JUNNI: "bg-amber-600",
  HP: "bg-lime-600",
  "The ONE": "bg-stone-500",
  BinB: "bg-zinc-600",
  "AIR PLA": "bg-sky-400",
  "AIR METAL": "bg-gray-400",
  "カラー レンズ": "bg-pink-400",
  "店舗限定": "bg-red-600",
  "雑貨": "bg-teal-500",
  "その他": "bg-neutral-400",
};

// Static last-week mock (differs from current to show changes)
const LAST_WEEK_MOCK: Record<string, string> = {
  "Entrance Table": "SUN",
  "Wall A Upper": "GB",
  "Wall A Middle": "KM",
  "Wall B Feature": "AIR",
  "Cashier Side": "雑貨",
};

function getDiff(last: string | undefined, curr: string | undefined) {
  if (!last && !curr) return "empty";
  if (!last && curr) return "added";
  if (last && !curr) return "removed";
  if (last !== curr) return "changed";
  return "same";
}

export default function PlanManager() {
  const { toast } = useToast();
  const { data: locations, isLoading: loadingLocs } = useLocations();
  const { data: products, isLoading: loadingProds } = useProducts();
  const { data: plans, isLoading: loadingPlans } = usePlans();

  const createPlan = useCreatePlan();
  const deletePlan = useDeletePlan();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);

  const handleAssignBrand = (productId: number) => {
    if (!activeLocationId) return;
    const existingPlan = plans?.find(p => p.locationId === activeLocationId);
    if (existingPlan) deletePlan.mutate(existingPlan.id);
    createPlan.mutate({ locationId: activeLocationId, productId }, {
      onSuccess: () => {
        toast({ title: "更新完了", description: "ブランドを割り当てました。" });
        setIsDialogOpen(false);
      }
    });
  };

  const handleClearLocation = (locationId: number) => {
    const existingPlan = plans?.find(p => p.locationId === locationId);
    if (existingPlan) {
      deletePlan.mutate(existingPlan.id, {
        onSuccess: () => toast({ title: "解除完了", description: "割り当てを解除しました。" })
      });
    }
  };

  const isLoading = loadingLocs || loadingProds || loadingPlans;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const displayLocations = locations?.slice(0, 5) ?? [];

  const changedCount = displayLocations.filter(loc => {
    const plan = plans?.find(p => p.locationId === loc.id);
    const curr = products?.find(p => p.id === plan?.productId)?.name;
    const last = LAST_WEEK_MOCK[loc.name];
    return getDiff(last, curr) !== "same" && getDiff(last, curr) !== "empty";
  }).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">今週の売場計画</h1>
          <p className="mt-2 text-muted-foreground">先週と今週のブランド配置を比較・確認します。</p>
        </div>
        {changedCount > 0 && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold px-3 py-1.5">
            {changedCount} 件の変更
          </Badge>
        )}
      </div>

      {/* Side-by-side comparison table */}
      <div className="rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_1fr_1fr] bg-secondary/30 border-b border-border/40">
          <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">陳列ロケーション</div>
          <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-l border-border/40">
            先週
          </div>
          <div className="px-5 py-3 text-xs font-bold text-primary uppercase tracking-wider border-l border-border/40 flex items-center justify-between">
            <span>今週</span>
            <span className="text-muted-foreground normal-case font-normal text-[11px]">クリックで編集</span>
          </div>
        </div>

        {displayLocations.map(loc => {
          const plan = plans?.find(p => p.locationId === loc.id);
          const product = products?.find(p => p.id === plan?.productId);
          const currName = product?.name;
          const lastName = LAST_WEEK_MOCK[loc.name];
          const diff = getDiff(lastName, currName);
          const brandColor = currName ? (BRAND_COLORS[currName] || "bg-primary") : null;
          const lastBrandColor = lastName ? (BRAND_COLORS[lastName] || "bg-primary") : null;

          const diffBadge = () => {
            if (diff === "same" || diff === "empty") return null;
            const styles = {
              added: "bg-emerald-100 text-emerald-700 border-emerald-200",
              removed: "bg-rose-100 text-rose-700 border-rose-200",
              changed: "bg-amber-100 text-amber-700 border-amber-200",
            };
            const labels = { added: "新規", removed: "削除", changed: "変更" };
            return (
              <span className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${styles[diff as keyof typeof styles]}`}>
                {labels[diff as keyof typeof labels]}
              </span>
            );
          };

          return (
            <div key={loc.id} className="grid grid-cols-[1fr_1fr_1fr] border-b border-border/40 last:border-0 hover:bg-secondary/10 transition-colors group">
              {/* Location name */}
              <div className="px-5 py-4 flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{loc.name}</span>
                {diffBadge()}
              </div>

              {/* Last week */}
              <div className="px-5 py-4 border-l border-border/40 flex items-center">
                {lastName ? (
                  <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-bold text-white opacity-60 ${lastBrandColor} ${diff === "changed" || diff === "removed" ? "line-through opacity-40" : ""}`}>
                    {lastName}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/50 italic">未割り当て</span>
                )}
              </div>

              {/* This week — editable */}
              <div className="px-5 py-4 border-l border-border/40 flex items-center justify-between">
                <div>
                  {currName ? (
                    <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-bold text-white ${brandColor} ${diff === "added" || diff === "changed" ? "ring-2 ring-offset-1 ring-emerald-400" : ""}`}>
                      {currName}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/50 italic">未割り当て</span>
                  )}
                </div>

                {/* Edit button */}
                <Dialog open={isDialogOpen && activeLocationId === loc.id} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (open) setActiveLocationId(loc.id);
                }}>
                  <DialogTrigger asChild>
                    <button
                      className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all ml-2"
                      data-testid={`edit-location-${loc.id}`}
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{loc.name} — ブランド割り当て</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-4">
                      {products?.map((prod) => (
                        <Button
                          key={prod.id}
                          variant="outline"
                          className={`h-14 flex items-center justify-center relative overflow-hidden ${BRAND_COLORS[prod.name] || 'bg-primary'} text-white border-none hover:opacity-90`}
                          onClick={() => handleAssignBrand(prod.id)}
                        >
                          <span className="text-base font-black tracking-tighter">{prod.name}</span>
                          {plans?.find(p => p.locationId === loc.id && p.productId === prod.id) && (
                            <Check className="absolute top-1 right-1 h-4 w-4" />
                          )}
                        </Button>
                      ))}
                    </div>
                    {plan && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          handleClearLocation(loc.id);
                          setIsDialogOpen(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        割り当てをクリア
                      </Button>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diff summary banner */}
      {changedCount > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">{changedCount} 件のロケーションで変更があります</p>
            <p className="text-xs text-amber-700 mt-0.5">変更内容を確認し、全店舗への計画共有を行ってください。</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded border border-emerald-300 bg-emerald-100" />
          <span>新規追加</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded border border-amber-300 bg-amber-100" />
          <span>変更</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded border border-rose-300 bg-rose-100" />
          <span>削除</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-8 h-2 rounded-full bg-emerald-400 ring-2 ring-offset-1 ring-emerald-400" />
          <span>今週の新規・変更ブランド</span>
        </div>
      </div>
    </div>
  );
}
