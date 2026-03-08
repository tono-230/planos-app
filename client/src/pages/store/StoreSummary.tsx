import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Store, ArrowRight, ScanLine, LayoutGrid, Clock } from "lucide-react";
import { Link, useParams } from "wouter";

const MOCK_STORE_DATA: Record<string, {
  name: string; area: string;
  compliance: number; complianceSku: number; floorSku: number;
  overflow: number; overflowSku: number;
  scanned: boolean; lastScan: string;
}> = {
  "1": { name: "渋谷店", area: "東京エリア", compliance: 82, complianceSku: 1012, floorSku: 1234, overflow: 12, overflowSku: 148, scanned: true, lastScan: "2026-03-08 10:25" },
  "2": { name: "新宿店", area: "東京エリア", compliance: 65, complianceSku: 825, floorSku: 1269, overflow: 35, overflowSku: 444, scanned: true, lastScan: "2026-03-07 14:12" },
  "3": { name: "池袋店", area: "東京エリア", compliance: 0, complianceSku: 0, floorSku: 0, overflow: 0, overflowSku: 0, scanned: false, lastScan: "-" },
  "4": { name: "横浜店", area: "神奈川エリア", compliance: 91, complianceSku: 910, floorSku: 1000, overflow: 8, overflowSku: 80, scanned: true, lastScan: "2026-03-08 09:43" },
  "5": { name: "川崎店", area: "神奈川エリア", compliance: 0, complianceSku: 0, floorSku: 0, overflow: 0, overflowSku: 0, scanned: false, lastScan: "-" },
  "6": { name: "大宮店", area: "埼玉エリア", compliance: 73, complianceSku: 730, floorSku: 1000, overflow: 22, overflowSku: 220, scanned: true, lastScan: "2026-03-07 16:30" },
  "7": { name: "千葉店", area: "千葉エリア", compliance: 0, complianceSku: 0, floorSku: 0, overflow: 0, overflowSku: 0, scanned: false, lastScan: "-" },
  "8": { name: "立川店", area: "東京エリア", compliance: 88, complianceSku: 880, floorSku: 1000, overflow: 15, overflowSku: 150, scanned: true, lastScan: "2026-03-08 08:55" },
};

export default function StoreSummary() {
  const params = useParams<{ id: string }>();
  const storeId = params.id || "1";
  const store = MOCK_STORE_DATA[storeId] || MOCK_STORE_DATA["1"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/hq/stores" className="hover:text-foreground transition-colors">店舗一覧</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{store.name}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{store.name}</h1>
        <p className="mt-1 text-muted-foreground">{store.area} · 店舗サマリー</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* スキャン状況 */}
        <Card className="border-none shadow-md shadow-black/5 overflow-hidden" data-testid="kpi-scan-status">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">スキャン状況</CardTitle>
            <Store className={`h-5 w-5 ${store.scanned ? "text-emerald-500" : "text-amber-500"}`} />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className={`text-3xl font-black font-display ${store.scanned ? "text-emerald-600" : "text-amber-600"}`}>
              {store.scanned ? "スキャン済み" : "未スキャン"}
            </div>
            {store.scanned && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">最終スキャン日時：{store.lastScan}</span>
              </div>
            )}
            {!store.scanned && (
              <p className="text-xs text-muted-foreground/70 font-medium">RFIDスキャンデータ未取得</p>
            )}
          </CardContent>
        </Card>

        {/* 棚割遵守率 */}
        <Card className="border-none shadow-md shadow-black/5" data-testid="kpi-store-compliance">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">棚割遵守率</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            {store.scanned ? (
              <>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-5xl font-black leading-none tabular-nums text-emerald-600" data-testid="value-compliance-pct">
                    {store.compliance}
                  </span>
                  <span className="text-2xl font-bold leading-none text-emerald-500 opacity-70">%</span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground/80 font-medium">
                    計画通り展開SKU：<span className="text-foreground font-bold">{store.complianceSku.toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-medium">
                    売場展開SKU：{store.floorSku.toLocaleString()}
                  </p>
                </div>
                {store.compliance < 80 && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                    要改善
                  </Badge>
                )}
              </>
            ) : (
              <div className="text-2xl font-black font-display text-muted-foreground">データ未取得</div>
            )}
          </CardContent>
        </Card>

        {/* キャパ超過率 */}
        <Card className="border-none shadow-md shadow-black/5" data-testid="kpi-store-overflow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">キャパ超過率</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            {store.scanned ? (
              <>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-5xl font-black leading-none tabular-nums text-orange-600" data-testid="value-overflow-pct">
                    {store.overflow}
                  </span>
                  <span className="text-2xl font-bold leading-none text-orange-500 opacity-70">%</span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground/80 font-medium">
                    キャパ超過SKU：<span className="text-foreground font-bold">{store.overflowSku.toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-medium">
                    売場展開SKU：{store.floorSku.toLocaleString()}
                  </p>
                </div>
                {store.overflow > 20 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                    キャパ超過
                  </Badge>
                )}
              </>
            ) : (
              <div className="text-2xl font-black font-display text-muted-foreground">データ未取得</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 導線ボタン */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="h-11 px-5 font-bold shadow-md shadow-primary/20 flex-1 sm:flex-none" data-testid="button-goto-rfid">
          <Link href={`/store/${storeId}/scan`} className="flex items-center justify-center gap-2">
            <ScanLine className="h-4 w-4" />
            RFID詳細を見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 px-5 font-semibold flex-1 sm:flex-none" data-testid="button-goto-layout">
          <Link href={`/store/${storeId}/layout`} className="flex items-center justify-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            店舗レイアウトを見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
