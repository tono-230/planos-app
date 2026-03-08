import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ScanLine, Send, CheckCircle2, AlertCircle, Package, MapPin,
  Warehouse, ArrowRight, AlertTriangle, X, LayoutGrid, Store, Clock,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { FIXTURES } from "@/context/StorePlanContext";

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

const MOCK_STATS = {
  totalSKU: 1480,
  floorSKU: 1234,
  floorPct: 83,
  backyardSKU: 246,
  backyardPct: 17,
  unknownSKU: 222,
  unknownPct: 18,
  compliancePct: 82,
  complianceSKU: 1012,
  overflowPct: 12,
  overflowSKU: 148,
  lastScan: "2026-03-08 10:25",
  displayCount: 50,
};

const generateMockScans = () => {
  const brands = ["AIR Slim", "SUN Classic", "GB Metal", "JD Bold", "ES Basic", "KM Light", "NICHE Pro", "MOVE Fit"];
  const fixtureNames = FIXTURES.map(f => f.labelJp);
  const statuses = ["売場展開SKU", "バックヤードSKU"];

  return Array.from({ length: MOCK_STATS.displayCount }, (_, i) => {
    const brand = brands[Math.floor((i * 7 + 3) % brands.length)];
    const isBackyard = i % 6 === 0;
    const status = isBackyard ? "バックヤードSKU" : "売場展開SKU";
    const plannedFixture = fixtureNames[Math.floor((i * 5 + 1) % fixtureNames.length)];

    let fixture = "-";
    let comparison = "要確認";

    if (!isBackyard) {
      if (i % 7 === 2) {
        fixture = "未特定";
        comparison = "要確認";
      } else {
        fixture = fixtureNames[Math.floor((i * 3 + 2) % fixtureNames.length)];
        comparison = fixture === plannedFixture ? "計画通り" : "誤配置";
      }
    } else {
      comparison = "未展開";
    }

    return {
      id: i + 1,
      epc: `3034E439${(i * 0x1a3c5f + 0xdeadbeef).toString(16).toUpperCase().padStart(8, "0").slice(0, 8)}`,
      sku: `EYE-${4000 + i * 29}`,
      name: `${brand} ${["01", "02", "03", "04"][i % 4]}`,
      fixture,
      status,
      plannedBlock: brand.split(" ")[0],
      comparison,
    };
  });
};

function ComparisonBadge({ comparison }: { comparison: string }) {
  switch (comparison) {
    case "計画通り":
      return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">計画通り</Badge>;
    case "未展開":
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-400/30 text-xs">未展開</Badge>;
    case "誤配置":
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">誤配置</Badge>;
    case "要確認":
      return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-xs">要確認</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{comparison}</Badge>;
  }
}

export default function ScanSubmission() {
  const params = useParams<{ id: string }>();
  const storeId = params.id || "1";
  const storeName = STORE_NAMES[storeId] || "店舗";
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const scanData = useMemo(() => generateMockScans(), []);
  const unknownItems = useMemo(() => scanData.filter(s => s.comparison === "要確認"), [scanData]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({ title: "送信完了", description: "RFIDスキャン結果を本部へ送信しました。" });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-4">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/hq/stores" className="hover:text-foreground transition-colors">店舗一覧</Link>
          <span>/</span>
          <Link href={`/store/${storeId}/summary`} className="hover:text-foreground transition-colors">{storeName}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">RFIDスキャン</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ScanLine className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          RFIDスキャン
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground hidden md:block">最新スキャン結果の詳細。店舗サマリーの内訳を表示します。</p>

        {/* 導線ボタン */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-goto-summary">
            <Link href={`/store/${storeId}/summary`} className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              店舗サマリへ戻る
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-goto-layout-from-scan">
            <Link href={`/store/${storeId}/layout`} className="flex items-center gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5" />
              店舗レイアウトで確認する
            </Link>
          </Button>
        </div>
      </div>

      {/* Submit status banner */}
      <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isSubmitted ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 text-muted-foreground shrink-0" />
          )}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">送信ステータス</p>
            <p className={`text-sm font-bold ${isSubmitted ? "text-emerald-600" : "text-foreground"}`}>
              {isSubmitted ? "送信済み" : "未送信"}
            </p>
          </div>
        </div>
        <Button
          disabled={isSubmitted || isSubmitting}
          onClick={handleSubmit}
          className="h-11 px-5 text-base font-bold shadow-lg shadow-primary/20 shrink-0"
          data-testid="button-submit-scan"
        >
          {isSubmitting ? "送信中..." : "本部へ送信"}
          {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* 最終スキャン日時 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
        <Clock className="h-4 w-4 shrink-0" />
        <span>最終スキャン日時：<span className="font-semibold text-foreground">{MOCK_STATS.lastScan}</span></span>
        <span className="text-border">·</span>
        <span>総検出 <span className="font-semibold text-foreground">{MOCK_STATS.totalSKU.toLocaleString()}</span> SKU</span>
      </div>

      {/* KPI cards — 2×3 grid */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">

        {/* 売場展開SKU */}
        <Card className="border-none shadow-md shadow-black/5 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">売場展開SKU</p>
            </div>
            <div className="text-3xl font-black" data-testid="stat-floor-sku">{MOCK_STATS.floorSKU.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">総検出の {MOCK_STATS.floorPct}%</p>
          </CardContent>
        </Card>

        {/* バックヤードSKU */}
        <Card className="border-none shadow-md shadow-black/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Warehouse className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-medium text-muted-foreground">バックヤードSKU</p>
            </div>
            <div className="text-3xl font-black" data-testid="stat-backyard-sku">{MOCK_STATS.backyardSKU.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">総検出の {MOCK_STATS.backyardPct}%</p>
          </CardContent>
        </Card>

        {/* 要確認SKU */}
        <Card className="border border-amber-200/80 shadow-md shadow-black/5 bg-amber-50/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <p className="text-xs font-medium text-muted-foreground">要確認SKU</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="text-3xl font-black text-amber-600" data-testid="stat-unknown-sku">
                  {MOCK_STATS.unknownSKU.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">売場展開の {MOCK_STATS.unknownPct}%</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 active:bg-amber-200 shrink-0 touch-manipulation"
                onClick={() => setAnalysisOpen(true)}
                data-testid="button-goto-analysis"
              >
                詳細 <ArrowRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 棚割遵守率 */}
        <Card className="border-none shadow-md shadow-black/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-medium text-muted-foreground">棚割遵守率</p>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-3xl font-black text-emerald-600" data-testid="stat-compliance-pct">{MOCK_STATS.compliancePct}</div>
              <span className="text-lg font-bold text-emerald-500 opacity-70">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">計画通り展開SKU：{MOCK_STATS.complianceSKU.toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* キャパ超過率 */}
        <Card className="border-none shadow-md shadow-black/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Package className="h-4 w-4 text-orange-500" />
              <p className="text-xs font-medium text-muted-foreground">キャパ超過率</p>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-3xl font-black text-orange-600" data-testid="stat-overflow-pct">{MOCK_STATS.overflowPct}</div>
              <span className="text-lg font-bold text-orange-500 opacity-70">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">キャパ超過SKU：{MOCK_STATS.overflowSKU.toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* 総検出SKU (summary) */}
        <Card className="border-none shadow-md shadow-black/5 bg-secondary/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <ScanLine className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">総検出SKU</p>
            </div>
            <div className="text-3xl font-black" data-testid="stat-total-sku">{MOCK_STATS.totalSKU.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">売場 + バックヤード</p>
          </CardContent>
        </Card>
      </div>

      {/* Scan results */}
      <div>
        {/* Mobile card list */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">スキャン結果詳細</h2>
            <span className="text-xs text-muted-foreground bg-secondary/60 rounded-full px-2.5 py-1 font-medium">
              {MOCK_STATS.totalSKU.toLocaleString()}件中 {MOCK_STATS.displayCount}件を表示
            </span>
          </div>
          <div className="space-y-2.5">
            {scanData.map(scan => (
              <div
                key={scan.id}
                className="rounded-xl border border-border/50 bg-card p-4 flex items-center justify-between gap-3 shadow-sm"
                data-testid={`card-scan-${scan.id}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">{scan.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {scan.fixture !== "-" && scan.fixture !== "未特定" ? scan.fixture : scan.status}
                  </p>
                </div>
                <div className="shrink-0">
                  <ComparisonBadge comparison={scan.comparison} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4 py-2 border-t border-border/30">
            {MOCK_STATS.totalSKU.toLocaleString()}件中 {MOCK_STATS.displayCount}件を表示
          </p>
        </div>

        {/* Desktop table */}
        <Card className="hidden md:block border-border/50 shadow-xl shadow-black/5 overflow-hidden">
          <CardHeader className="bg-secondary/30 border-b border-border/40 py-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">スキャン結果詳細（棚割比較）</CardTitle>
              <CardDescription className="text-xs mt-0.5">検出されたRFIDタグと本部計画との照合結果</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold shrink-0">
              {MOCK_STATS.totalSKU.toLocaleString()}件中 {MOCK_STATS.displayCount}件を表示
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/10 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground w-[150px]">EPC</th>
                    <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground">商品名</th>
                    <th className="text-left px-4 py-3 font-bold text-xs text-primary">計画ブロック</th>
                    <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground">検出什器</th>
                    <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground">検出状態</th>
                    <th className="text-left px-4 py-3 font-bold text-xs text-primary">判定</th>
                  </tr>
                </thead>
                <tbody>
                  {scanData.map((scan) => (
                    <tr key={scan.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/5 transition-colors" data-testid={`row-scan-${scan.id}`}>
                      <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{scan.epc}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{scan.name}</div>
                        <div className="text-[10px] text-muted-foreground">{scan.sku}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-bold border-primary/20 text-primary text-[11px]">
                          {scan.plannedBlock}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {scan.fixture !== "-" && <MapPin className="h-3 w-3 text-primary" />}
                          {scan.fixture}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{scan.status}</td>
                      <td className="px-4 py-3"><ComparisonBadge comparison={scan.comparison} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border/30 bg-secondary/10 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                全 <span className="font-semibold text-foreground">{MOCK_STATS.totalSKU.toLocaleString()}</span> 件中 {MOCK_STATS.displayCount} 件を表示
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 要確認SKU lightbox */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700 text-base md:text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              要確認SKU — スキャン結果詳細
            </DialogTitle>
            <DialogDescription>
              位置が特定できなかったSKUの一覧です。売場確認または在庫確認が必要です。
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 px-3 py-2.5 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-semibold">
              全 {MOCK_STATS.unknownSKU.toLocaleString()} 件の要確認SKU（うち {unknownItems.length} 件を表示）
            </p>
          </div>

          {/* Mobile: cards, Desktop: table */}
          <div className="overflow-auto flex-1">
            <div className="md:hidden space-y-2 p-1">
              {unknownItems.map(scan => (
                <div key={scan.id} className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-foreground">{scan.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{scan.sku}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-500" /> {scan.fixture}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary text-xs shrink-0">
                    {scan.plannedBlock}
                  </Badge>
                </div>
              ))}
            </div>

            <table className="hidden md:table w-full text-sm">
              <thead className="sticky top-0 bg-secondary/80 backdrop-blur-sm">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground">商品名</th>
                  <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground w-[120px]">SKU</th>
                  <th className="text-left px-4 py-3 font-bold text-xs text-primary">計画ブロック</th>
                  <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground">検出什器</th>
                  <th className="text-left px-4 py-3 font-bold text-xs text-muted-foreground">検出状態</th>
                </tr>
              </thead>
              <tbody>
                {unknownItems.map((scan) => (
                  <tr key={scan.id} className="border-b border-border/30 last:border-0 hover:bg-amber-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold">{scan.name}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{scan.sku}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-bold border-primary/20 text-primary text-[11px]">{scan.plannedBlock}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-500" /> {scan.fixture}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{scan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-border/40">
            <Button
              variant="outline"
              className="h-11 px-6 text-base"
              onClick={() => setAnalysisOpen(false)}
              data-testid="button-close-analysis"
            >
              <X className="h-4 w-4 mr-1.5" /> 閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
