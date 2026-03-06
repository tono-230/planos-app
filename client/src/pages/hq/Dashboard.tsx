import { useScans } from "@/hooks/use-scans";
import { useAnalysis } from "@/hooks/use-analysis";
import { usePlans } from "@/hooks/use-plans";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, AlertCircle, MapPin, Store, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
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
  
  const correctCount = analysis?.filter(a => a.status === 'correct').length || 0;
  const mismatchCount = analysis?.filter(a => a.status === 'mismatch').length || 0;
  const missingCount = analysis?.filter(a => a.status === 'missing').length || 0;
  
  const totalItems = analysis?.length || 0;
  const accuracyRate = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : null;

  // Mock total stores and capacity for the requested display
  const totalStores = 500;
  const scannedStores = totalScans > 0 ? 420 : 0; // Using user's example numbers if data exists
  
  // Mock overflow data based on capacity rules
  const overflowRate = totalItems > 0 ? 35 : null;
  const overflowSkuCount = 524;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">ダッシュボード</h1>
        <p className="mt-2 text-muted-foreground">全店舗の棚割実行状況をリアルタイムで監視します</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. スキャン店舗数 (Blue) */}
        <Card className="border-none shadow-md shadow-black/5 overflow-hidden relative group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">スキャン店舗数</CardTitle>
            <Store className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-blue-600">
              {totalScans > 0 ? `${scannedStores} / ${totalStores}` : 'データ未取得'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalScans > 0 ? 'データ受信済み店舗' : 'スキャン待ち'}
            </p>
          </CardContent>
        </Card>

        {/* 2. 棚割遵守率 (Green) */}
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">棚割遵守率</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-emerald-600">
              {accuracyRate !== null ? `${accuracyRate}%` : 'データ未取得'}
            </div>
            {accuracyRate !== null && (
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {correctCount} SKU
              </p>
            )}
          </CardContent>
        </Card>

        {/* 3. オーバーフロー率 (Orange) */}
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">オーバーフロー率</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-orange-600">
              {totalScans > 0 ? `${overflowRate}%` : 'データ未取得'}
            </div>
            {totalScans > 0 && (
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {overflowSkuCount} SKU
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 shadow-lg shadow-black/5 col-span-1">
          <CardHeader>
            <CardTitle>次のアクション</CardTitle>
            <CardDescription>現在の状況に基づいた推奨操作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {totalPlanned === 0 ? (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-500">週間売場計画を作成</h4>
                  <p className="text-sm text-amber-800/80 dark:text-amber-400/80 mt-1 mb-3">今週の売場計画がまだ作成されていません。商品を什器に割り当てて棚割を作成してください。</p>
                  <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href="/hq/plan">売場計画を作成</Link>
                  </Button>
                </div>
              </div>
            ) : totalScans === 0 ? (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50 flex items-start gap-3">
                <Store className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-500">店舗スキャン待ち</h4>
                  <p className="text-sm text-blue-800/80 dark:text-blue-400/80 mt-1 mb-3">週間計画は準備完了していますが、店舗からのRFIDスキャンデータがまだ送信されていません。</p>
                  <Button asChild size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <Link href="/store/scan">スキャンをシミュレート</Link>
                  </Button>
                </div>
              </div>
            ) : (mismatchCount > 0 || missingCount > 0) ? (
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-semibold text-destructive">不一致の確認</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">解析の結果、計画と実際の陳列の間に差異が検出されました。詳細を確認して店舗へ指示を出してください。</p>
                  <Button asChild size="sm" variant="destructive">
                    <Link href="/hq/analysis">分析結果を表示</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/50 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-500">問題なし</h4>
                  <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 mt-1">店舗の陳列は計画通りです。対応は不要です。</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
