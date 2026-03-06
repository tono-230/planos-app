import { useScans } from "@/hooks/use-scans";
import { useAnalysis } from "@/hooks/use-analysis";
import { usePlans } from "@/hooks/use-plans";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, AlertCircle, Store, AlertTriangle, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: scans, isLoading: isLoadingScans } = useScans();
  const { data: analysis, isLoading: isLoadingAnalysis } = useAnalysis();
  const { data: plans, isLoading: isLoadingPlans } = usePlans();

  const isLoading = isLoadingScans || isLoadingAnalysis || isLoadingPlans;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">読み込み中...</p>
        </div>
      </div>
    );
  }

  const totalScans = scans?.length || 0;
  const totalPlanned = plans?.length || 0;
  
  const mismatchCount = analysis?.filter(a => a.status === 'mismatch').length || 0;
  const missingCount = analysis?.filter(a => a.status === 'missing').length || 0;

  const mockScannedStores = 420;
  const mockTotalStores = 500;
  const mockComplianceRate = 65;
  const mockComplianceSku = 825;
  const mockOverflowRate = 35;
  const mockOverflowSku = 524;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">ダッシュボード</h1>
        <p className="mt-2 text-muted-foreground">全店舗の棚割実行状況をリアルタイムで監視します</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. スキャン店舗数 (Blue) */}
        <Card 
          className="border-none shadow-md shadow-black/5 overflow-hidden relative group cursor-pointer hover:bg-blue-500/[0.02] transition-colors"
          onClick={() => setLocation("/hq/stores")}
        >
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">スキャン店舗数</CardTitle>
            <Store className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-4xl font-black font-display text-blue-600">{mockScannedStores} / {mockTotalStores}</div>
            {mockScannedStores < mockTotalStores && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                未完了
              </Badge>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium pt-1">
              スキャン済み店舗 / 全対象店舗
            </p>
          </CardContent>
        </Card>

        {/* 2. 棚割遵守率 (Green) */}
        <Card 
          className="border-none shadow-md shadow-black/5 cursor-pointer hover:bg-emerald-500/[0.02] transition-colors"
          onClick={() => setLocation("/hq/stores")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">棚割遵守率</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black font-display text-emerald-600">{mockComplianceRate}%</div>
              <div className="text-lg font-bold text-emerald-600/80">{mockComplianceSku} SKU</div>
            </div>
            {mockComplianceRate < 80 && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                要改善
              </Badge>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium pt-1">
              計画通りに展開されているSKU
            </p>
          </CardContent>
        </Card>

        {/* 3. オーバーフロー率 (Orange) */}
        <Card 
          className="border-none shadow-md shadow-black/5 cursor-pointer hover:bg-orange-500/[0.02] transition-colors"
          onClick={() => setLocation("/hq/stores")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">オーバーフロー率</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black font-display text-orange-600">{mockOverflowRate}%</div>
              <div className="text-lg font-bold text-orange-600/80">{mockOverflowSku} SKU</div>
            </div>
            {mockOverflowRate > 20 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                キャパ超過
              </Badge>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium pt-1">
              売場キャパを超えているSKU
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">次のアクション</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {mockScannedStores < mockTotalStores && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Store className="h-5 w-5" />
                  <CardTitle className="text-base">店舗スキャン待ち</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">未スキャン店舗があります。RFIDスキャンデータを送信してください。</p>
                <Button asChild size="sm" variant="outline" className="w-full justify-between">
                  <Link href="/hq/stores" className="flex items-center justify-between w-full">
                    店舗一覧へ <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {mockOverflowRate > 20 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  <CardTitle className="text-base">売場キャパ超過</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">一部SKUが売場キャパを超えています。SKU削減または売場再配置を検討してください。</p>
                <Button asChild size="sm" variant="outline" className="w-full justify-between">
                  <Link href="/hq/stores" className="flex items-center justify-between w-full">
                    店舗一覧へ <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {mockComplianceRate < 100 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <CardTitle className="text-base">棚割差異確認</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">計画と異なる配置が検出されています。売場配置を確認してください。</p>
                <Button asChild size="sm" variant="outline" className="w-full justify-between">
                  <Link href="/hq/stores" className="flex items-center justify-between w-full">
                    店舗一覧へ <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
