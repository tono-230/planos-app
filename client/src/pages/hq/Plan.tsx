import { useState } from "react";
import { useLocations } from "@/hooks/use-locations";
import { useProducts } from "@/hooks/use-products";
import { usePlans, useCreatePlan, useDeletePlan } from "@/hooks/use-plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, Plus, Trash2, Check } from "lucide-react";
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
  NICHE: "bg-purple-500",
  ES: "bg-rose-500",
  KM: "bg-slate-700",
  MOVE: "bg-cyan-600",
};

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

    // Remove existing plan for this location if any
    const existingPlan = plans?.find(p => p.locationId === activeLocationId);
    if (existingPlan) {
      deletePlan.mutate(existingPlan.id);
    }

    createPlan.mutate({
      locationId: activeLocationId,
      productId: productId,
    }, {
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
        onSuccess: () => {
          toast({ title: "解除完了", description: "割り当てを解除しました。" });
        }
      });
    }
  };

  const isLoading = loadingLocs || loadingProds || loadingPlans;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">週間売場計画 (VMDボード)</h1>
        <p className="mt-2 text-muted-foreground">店舗の陳列ブロックをクリックしてブランドを割り当てます。</p>
      </div>

      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b border-border/40 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            ストア・ディスプレイ・グリッド
          </CardTitle>
          <CardDescription>4列 × 3行 の陳列ユニット構成</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locations?.slice(0, 12).map((loc) => {
              const plan = plans?.find(p => p.locationId === loc.id);
              const product = products?.find(p => p.id === plan?.productId);
              const brandColor = product ? (BRAND_COLORS[product.name] || "bg-primary") : "bg-secondary/50";

              return (
                <div key={loc.id} className="relative group aspect-square">
                  <Dialog open={isDialogOpen && activeLocationId === loc.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) setActiveLocationId(loc.id);
                  }}>
                    <DialogTrigger asChild>
                      <button
                        className={`w-full h-full rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/30 overflow-hidden ${plan ? 'border-none' : ''}`}
                      >
                        {plan && product ? (
                          <div className={`w-full h-full ${brandColor} text-white flex flex-col items-center justify-center p-4 relative animate-in zoom-in-95 duration-300`}>
                            <span className="text-2xl font-black tracking-tighter">{product.name}</span>
                            <span className="text-[10px] opacity-80 font-bold mt-1 uppercase tracking-widest">{loc.name}</span>
                          </div>
                        ) : (
                          <>
                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">{loc.name}</span>
                          </>
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{loc.name} へのブランド割り当て</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-3 py-4">
                        {products?.map((prod) => (
                          <Button
                            key={prod.id}
                            variant="outline"
                            className={`h-16 flex flex-col items-center justify-center relative overflow-hidden group ${BRAND_COLORS[prod.name] || 'bg-primary'} text-white border-none hover:opacity-90`}
                            onClick={() => handleAssignBrand(prod.id)}
                          >
                            <span className="text-lg font-black tracking-tighter">{prod.name}</span>
                            {plans?.find(p => p.locationId === loc.id && p.productId === prod.id) && (
                              <Check className="absolute top-1 right-1 h-4 w-4" />
                            )}
                          </Button>
                        ))}
                      </div>
                      {plan && (
                        <Button
                          variant="destructive"
                          className="w-full mt-2"
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
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <p className="text-sm text-muted-foreground italic">
          ※ 各ブロックは売場の陳列ユニットを表しています。
        </p>
      </div>
    </div>
  );
}
