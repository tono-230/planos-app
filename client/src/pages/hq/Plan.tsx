import { useState } from "react";
import { useLocations } from "@/hooks/use-locations";
import { useProducts } from "@/hooks/use-products";
import { usePlans, useCreatePlan, useDeletePlan } from "@/hooks/use-plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Package, Plus, Trash2, Layers } from "lucide-react";

export default function PlanManager() {
  const { toast } = useToast();
  const { data: locations, isLoading: loadingLocs } = useLocations();
  const { data: products, isLoading: loadingProds } = useProducts();
  const { data: plans, isLoading: loadingPlans } = usePlans();
  
  const createPlan = useCreatePlan();
  const deletePlan = useDeletePlan();

  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleAddPlan = () => {
    if (!selectedLocation || !selectedProduct) {
      toast({ title: "入力不備", description: "ロケーションと商品の両方を選択してください。", variant: "destructive" });
      return;
    }

    createPlan.mutate({
      locationId: parseInt(selectedLocation),
      productId: parseInt(selectedProduct),
    }, {
      onSuccess: () => {
        toast({ title: "完了", description: "計画が正常に登録されました。" });
        setSelectedProduct("");
      }
    });
  };

  const isFormLoading = loadingLocs || loadingProds || loadingPlans;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">週間売場計画</h1>
          <p className="mt-2 text-muted-foreground">商品グループを店舗の陳列場所に割り当てます。</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-xl shadow-black/5 bg-gradient-to-b from-card to-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-primary" />
                陳列の割り当て
              </CardTitle>
              <CardDescription>店舗での実施ルールを新規作成します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> 
                  ロケーションゾーン
                </label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={isFormLoading}>
                  <SelectTrigger className="w-full bg-background border-border/50 focus:ring-primary/20">
                    <SelectValue placeholder="ゾーンを選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  商品グループ
                </label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct} disabled={isFormLoading}>
                  <SelectTrigger className="w-full bg-background border-border/50 focus:ring-primary/20">
                    <SelectValue placeholder="商品を選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id.toString()}>
                        {prod.name} <span className="text-xs text-muted-foreground ml-2">({prod.productGroup})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAddPlan} 
                disabled={isFormLoading || createPlan.isPending || !selectedLocation || !selectedProduct}
                className="w-full shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
              >
                {createPlan.isPending ? "登録中..." : "計画に追加"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-md shadow-black/5 min-h-[500px] flex flex-col">
            <CardHeader className="border-b border-border/30 bg-secondary/30 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                現在の有効なマッピング
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {isFormLoading ? (
                <div className="flex h-full min-h-[300px] items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : plans?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 text-border mb-4" />
                  <p className="text-lg font-medium text-foreground">計画が設定されていません</p>
                  <p className="text-sm mt-1">フォームを使用して商品をゾーンに割り当ててください。</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {plans?.map((plan) => {
                    const loc = locations?.find(l => l.id === plan.locationId);
                    const prod = products?.find(p => p.id === plan.productId);
                    return (
                      <div key={plan.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{loc?.name || "不明なゾーン"}</p>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                              <Package className="h-3 w-3" />
                              <span>{prod?.name || "不明な商品"}</span>
                              <span className="px-1.5 py-0.5 rounded-md bg-border/50 text-[10px] uppercase font-bold tracking-wider ml-2">
                                {prod?.productGroup}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deletePlan.mutate(plan.id)}
                          disabled={deletePlan.isPending}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
