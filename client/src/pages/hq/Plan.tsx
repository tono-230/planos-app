import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Check, ArrowRight, Pencil, TrendingUp, TrendingDown, Minus,
  BarChart2, Package, Send, Store
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { HQ_GROUPS, HQ_VARIANTS, HQ_THIS_WEEK, HQ_LAST_WEEK } from "@/context/StorePlanContext";

const GROUPS = HQ_GROUPS;
const VARIANTS = HQ_VARIANTS;
const POSITIONS = GROUPS.flatMap(g => VARIANTS.map(v => `${g} ${v}`));

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

type Trend = "up" | "flat" | "down";

interface BrandAnalytics {
  lastWeekSales: number;
  weekOverWeek: number;
  salesRank: number;
  trend: Trend;
  comment: string;
  stock: number;
  weekSales: number;
  stockWeeks: number;
}

const BRAND_ANALYTICS: Record<string, BrandAnalytics> = {
  "AIR":       { lastWeekSales: 285, weekOverWeek: 8.2,  salesRank: 1,  trend: "up",   comment: "春先に向けて需要急上昇中。在庫補充を優先してください。",     stock: 142, weekSales: 47, stockWeeks: 3.0 },
  "SUN":       { lastWeekSales: 198, weekOverWeek: -3.1, salesRank: 3,  trend: "down", comment: "前週比微減。競合ブランドとの競争が激化しています。",         stock: 89,  weekSales: 33, stockWeeks: 2.7 },
  "GB":        { lastWeekSales: 212, weekOverWeek: 1.5,  salesRank: 2,  trend: "flat", comment: "安定した売れ行きを維持。在庫水準も良好です。",               stock: 201, weekSales: 35, stockWeeks: 5.7 },
  "JD":        { lastWeekSales: 156, weekOverWeek: 4.8,  salesRank: 5,  trend: "up",   comment: "若年層を中心に支持率が上昇中です。",                         stock: 115, weekSales: 26, stockWeeks: 4.4 },
  "ES":        { lastWeekSales: 134, weekOverWeek: -8.5, salesRank: 7,  trend: "down", comment: "売上低下傾向。フェイシングの見直しを検討してください。",       stock: 178, weekSales: 22, stockWeeks: 8.1 },
  "KM":        { lastWeekSales: 167, weekOverWeek: 2.3,  salesRank: 4,  trend: "flat", comment: "コア顧客に根強い支持。横ばい継続中です。",                   stock: 95,  weekSales: 28, stockWeeks: 3.4 },
  "NICHE":     { lastWeekSales: 88,  weekOverWeek: 12.1, salesRank: 9,  trend: "up",   comment: "SNS効果で急上昇。フェイシング拡大を推奨します。",             stock: 43,  weekSales: 15, stockWeeks: 2.9 },
  "MOVE":      { lastWeekSales: 143, weekOverWeek: 0.5,  salesRank: 6,  trend: "flat", comment: "横ばい継続。季節変動の影響はほぼなし。",                     stock: 132, weekSales: 24, stockWeeks: 5.5 },
  "JUNNI":     { lastWeekSales: 112, weekOverWeek: -2.0, salesRank: 8,  trend: "down", comment: "小幅な下降傾向。テコ入れが必要かもしれません。",               stock: 87,  weekSales: 19, stockWeeks: 4.6 },
  "HP":        { lastWeekSales: 79,  weekOverWeek: 6.4,  salesRank: 11, trend: "up",   comment: "健康意識の高まりと連動して伸び中。今後も注目。",               stock: 64,  weekSales: 13, stockWeeks: 4.9 },
  "The ONE":   { lastWeekSales: 95,  weekOverWeek: -5.2, salesRank: 10, trend: "down", comment: "競合施策の影響で苦戦中。要ウォッチです。",                   stock: 54,  weekSales: 16, stockWeeks: 3.4 },
  "BinB":      { lastWeekSales: 67,  weekOverWeek: 3.8,  salesRank: 13, trend: "up",   comment: "回復基調。在庫が少なめなので補充を早めに。",                 stock: 38,  weekSales: 11, stockWeeks: 3.5 },
  "AIR PLA":   { lastWeekSales: 103, weekOverWeek: 15.3, salesRank: 10, trend: "up",   comment: "新商品効果で急伸中。継続的な注目が必要です。",               stock: 72,  weekSales: 17, stockWeeks: 4.2 },
  "AIR METAL": { lastWeekSales: 58,  weekOverWeek: -1.2, salesRank: 15, trend: "flat", comment: "概ね安定。大きな動きはなし。",                               stock: 91,  weekSales: 10, stockWeeks: 9.1 },
  "雑貨":       { lastWeekSales: 145, weekOverWeek: 7.6,  salesRank: 6,  trend: "up",   comment: "衝動買い需要が高い。レジ付近への配置が効果的です。",           stock: 203, weekSales: 24, stockWeeks: 8.5 },
};


type DiffType = "same" | "empty" | "added" | "removed" | "changed";

function getDiff(last: string, curr: string): DiffType {
  if (!last && !curr) return "empty";
  if (!last && curr) return "added";
  if (last && !curr) return "removed";
  if (last !== curr) return "changed";
  return "same";
}

function BrandTag({ name, faded = false, small = false }: { name: string; faded?: boolean; small?: boolean }) {
  const color = BRAND_COLORS[name] || "bg-primary";
  return (
    <span className={`inline-flex items-center justify-center rounded-md text-white font-black leading-none ${color} ${faded ? "opacity-40" : ""} ${small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}>
      {name}
    </span>
  );
}

function TrendIcon({ trend, size = "sm" }: { trend: Trend; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";
  if (trend === "up")   return <TrendingUp   className={`${cls} text-emerald-500`} />;
  if (trend === "down") return <TrendingDown className={`${cls} text-rose-500`} />;
  return <Minus className={`${cls} text-muted-foreground`} />;
}

function TrendLabel({ trend }: { trend: Trend }) {
  if (trend === "up") return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
      <TrendingUp className="h-3.5 w-3.5" />上昇
    </span>
  );
  if (trend === "down") return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-2.5 py-1">
      <TrendingDown className="h-3.5 w-3.5" />減少
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-secondary border border-border rounded-full px-2.5 py-1">
      <Minus className="h-3.5 w-3.5" />横ばい
    </span>
  );
}

function LastWeekCell({ pos, onSelect, currentWeekBrands }: {
  pos: string;
  onSelect: (pos: string) => void;
  currentWeekBrands: Record<string, string>;
}) {
  const brand = HQ_LAST_WEEK[pos] || "";
  const currBrand = currentWeekBrands[pos] || "";
  const diff = getDiff(brand, currBrand);
  const faded = diff === "changed" || diff === "removed";
  const a = brand ? BRAND_ANALYTICS[brand] : null;

  return (
    <button
      className="group relative flex flex-col items-center justify-center gap-1 h-20 w-full rounded-xl border border-border/30 bg-secondary/30 px-2 py-2 transition-all cursor-pointer hover:bg-secondary/60 hover:border-border/60 hover:shadow-sm"
      onClick={() => onSelect(pos)}
      data-testid={`cell-lastweek-${pos.replace(/\s/g, "-")}`}
    >
      {brand ? (
        <>
          <BrandTag name={brand} faded={faded} />
          {a && (
            <div className="flex items-center gap-1 text-[9px] font-semibold">
              <TrendIcon trend={a.trend} size="xs" />
              <span className={a.weekOverWeek >= 0 ? "text-emerald-600" : "text-rose-500"}>
                {a.weekOverWeek >= 0 ? "+" : ""}{a.weekOverWeek}%
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-muted-foreground/70">¥{a.lastWeekSales}万</span>
            </div>
          )}
        </>
      ) : (
        <span className="text-[10px] text-muted-foreground/30 italic">未割り当て</span>
      )}
    </button>
  );
}

function ThisWeekCell({ pos, brands, onEdit }: {
  pos: string;
  brands: Record<string, string>;
  onEdit: (pos: string) => void;
}) {
  const currBrand = brands[pos] || "";
  const lastBrand = HQ_LAST_WEEK[pos] || "";
  const diff = getDiff(lastBrand, currBrand);

  const ringClass =
    diff === "added"   ? "ring-2 ring-emerald-400 ring-offset-1" :
    diff === "changed" ? "ring-2 ring-amber-400 ring-offset-1" :
    diff === "removed" ? "ring-2 ring-rose-400 ring-offset-1" : "";

  const badgeStyle =
    diff === "added"   ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
    diff === "changed" ? "bg-amber-100 text-amber-700 border-amber-200" :
    diff === "removed" ? "bg-rose-100 text-rose-700 border-rose-200" : "";

  const badgeLabel =
    diff === "added"   ? "新規" :
    diff === "changed" ? "変更" :
    diff === "removed" ? "削除" : "";

  return (
    <button
      className={`group relative flex flex-col items-center justify-center h-20 w-full rounded-xl border border-border/30 px-2 gap-0.5 transition-all hover:shadow-md hover:border-primary/30 hover:bg-primary/[0.02] cursor-pointer bg-secondary/30 ${ringClass}`}
      onClick={() => onEdit(pos)}
      data-testid={`cell-thisweek-${pos.replace(/\s/g, "-")}`}
    >
      {badgeLabel && (
        <span className={`absolute top-1 right-1.5 text-[8px] font-bold border rounded px-1 py-0.5 leading-none ${badgeStyle}`}>
          {badgeLabel}
        </span>
      )}
      <div className="flex items-center justify-center w-full">
        {currBrand ? (
          <BrandTag name={currBrand} />
        ) : (
          <span className="text-[10px] text-muted-foreground/30 italic">未割り当て</span>
        )}
      </div>
      {diff === "changed" && (
        <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground/60 font-medium">
          <span>{lastBrand}</span>
          <ArrowRight className="h-2.5 w-2.5" />
          <span>{currBrand}</span>
        </div>
      )}
      {diff === "removed" && lastBrand && (
        <div className="text-[9px] text-rose-400/80 font-medium line-through">{lastBrand}</div>
      )}
      <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </div>
    </button>
  );
}

export default function PlanManager() {
  const { toast } = useToast();
  const { data: products, isLoading: loadingProds } = useProducts();

  const [thisWeek, setThisWeek] = useState<Record<string, string>>(HQ_THIS_WEEK);
  const [editingPos, setEditingPos] = useState<string | null>(null);
  const [analyticsPos, setAnalyticsPos] = useState<string | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSendDialogOpen(false);
    }, 800);
    setTimeout(() => {
      toast({
        title: "VMD指示を送信しました",
        description: "全8店舗にVMD指示が送信されました。",
      });
    }, 900);
  };

  const handleAssignBrand = (brand: string) => {
    if (!editingPos) return;
    setThisWeek(prev => ({ ...prev, [editingPos]: brand }));
    toast({ title: "更新完了", description: `${editingPos} に ${brand || "未割り当て"} を設定しました。` });
    setEditingPos(null);
  };

  const changedPositions = POSITIONS.filter(pos => {
    const diff = getDiff(HQ_LAST_WEEK[pos] || "", thisWeek[pos] || "");
    return diff !== "same" && diff !== "empty";
  });

  const assignedBrands = new Set(Object.values(thisWeek).filter(Boolean));
  const allBrands = products?.map(p => p.name) ?? Object.keys(BRAND_COLORS);
  const unassignedBrands = allBrands.filter(b => !assignedBrands.has(b));
  const displayProducts = products ?? Object.keys(BRAND_COLORS).map((name, i) => ({ id: i, name }));

  const analyticsBrand = analyticsPos ? (HQ_LAST_WEEK[analyticsPos] || "") : "";
  const analyticsData = analyticsBrand ? BRAND_ANALYTICS[analyticsBrand] : null;

  if (loadingProds) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">今週のVMD指示</h1>
          <p className="mt-2 text-muted-foreground">
            <span className="text-muted-foreground/70">先週セル</span>をクリックで詳細分析、
            <span className="text-primary font-medium">今週セル</span>をクリックで編集。
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          {changedPositions.length > 0 && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold px-3 py-1.5">
              {changedPositions.length} 件の変更
            </Badge>
          )}
          <Button
            onClick={() => setSendDialogOpen(true)}
            className="gap-2"
            data-testid="button-send-to-stores"
          >
            <Send className="h-4 w-4" />
            店舗に送信
          </Button>
        </div>
      </div>

      {/* Unassigned brands strip */}
      <div className="rounded-xl border border-border/40 bg-secondary/20 px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap shrink-0">
            未配置ブランド
          </span>
          {unassignedBrands.length === 0 ? (
            <span className="text-xs text-muted-foreground/50 italic">すべてのブランドが配置済みです</span>
          ) : (
            <div className="flex flex-wrap gap-1.5" data-testid="unassigned-brands">
              {unassignedBrands.map(brand => (
                <span key={brand} data-testid={`unassigned-${brand}`}>
                  <BrandTag name={brand} small />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* 先週 */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">先週</CardTitle>
              <span className="text-[10px] text-muted-foreground">クリックで詳細分析</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2 mb-1">
              <div className="w-20" />
              {VARIANTS.map(v => (
                <div key={v} className="text-center text-[10px] font-semibold text-muted-foreground/50 tracking-wider">{v}</div>
              ))}
            </div>
            {GROUPS.map(group => (
              <div key={group} className="grid grid-cols-[auto_1fr_1fr] gap-x-2 mb-2 items-center">
                <div className="w-20 shrink-0">
                  <span className="text-[11px] font-semibold text-muted-foreground leading-tight">{group}</span>
                </div>
                {VARIANTS.map(v => (
                  <LastWeekCell
                    key={`${group} ${v}`}
                    pos={`${group} ${v}`}
                    onSelect={setAnalyticsPos}
                    currentWeekBrands={thisWeek}
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 今週 */}
        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">今週</CardTitle>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Pencil className="h-3 w-3" />クリックで編集
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2 mb-1">
              <div className="w-20" />
              {VARIANTS.map(v => (
                <div key={v} className="text-center text-[10px] font-semibold text-muted-foreground/50 tracking-wider">{v}</div>
              ))}
            </div>
            {GROUPS.map(group => (
              <div key={group} className="grid grid-cols-[auto_1fr_1fr] gap-x-2 mb-2 items-center">
                <div className="w-20 shrink-0">
                  <span className="text-[11px] font-semibold text-muted-foreground leading-tight">{group}</span>
                </div>
                {VARIANTS.map(v => (
                  <ThisWeekCell
                    key={`${group} ${v}`}
                    pos={`${group} ${v}`}
                    brands={thisWeek}
                    onEdit={setEditingPos}
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Diff summary */}
      {changedPositions.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              {changedPositions.length} 件の変更があります
              <span className="font-normal text-amber-700 ml-2 text-xs">({changedPositions.join("、")})</span>
            </p>
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
      </div>

      {/* Analytics lightbox */}
      <Dialog open={!!analyticsPos} onOpenChange={open => !open && setAnalyticsPos(null)}>
        <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden" data-testid="analytics-dialog">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/40">
            <DialogTitle className="flex items-center gap-3 text-base">
              {analyticsBrand && <BrandTag name={analyticsBrand} />}
              <span>{analyticsPos}</span>
              <span className="text-muted-foreground font-normal text-sm">— 先週の実績</span>
            </DialogTitle>
          </DialogHeader>

          {analyticsData ? (
            <div className="grid grid-cols-3 divide-x divide-border/40">
              {/* 売上動向 */}
              <div className="px-5 py-5 space-y-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <BarChart2 className="h-3.5 w-3.5" />売上動向
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">先週売上</p>
                    <p className="text-2xl font-black text-foreground leading-none">
                      ¥{analyticsData.lastWeekSales}
                      <span className="text-sm font-normal text-muted-foreground ml-1">万</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">前週比</p>
                    <p className={`text-lg font-bold leading-none ${analyticsData.weekOverWeek >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                      {analyticsData.weekOverWeek >= 0 ? "+" : ""}{analyticsData.weekOverWeek}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">売れ筋順位</p>
                    <p className="text-lg font-bold text-foreground leading-none">#{analyticsData.salesRank}</p>
                  </div>
                </div>
              </div>

              {/* 傾向 */}
              <div className="px-5 py-5 space-y-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <TrendingUp className="h-3.5 w-3.5" />傾向
                </div>
                <div className="space-y-3">
                  <TrendLabel trend={analyticsData.trend} />
                  <p className="text-xs text-muted-foreground leading-relaxed">{analyticsData.comment}</p>
                </div>
              </div>

              {/* 在庫 */}
              <div className="px-5 py-5 space-y-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Package className="h-3.5 w-3.5" />在庫
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">現在庫</p>
                    <p className="text-2xl font-black text-foreground leading-none">
                      {analyticsData.stock}
                      <span className="text-sm font-normal text-muted-foreground ml-1">点</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">週販</p>
                    <p className="text-lg font-bold text-foreground leading-none">
                      {analyticsData.weekSales}
                      <span className="text-xs text-muted-foreground ml-1">点/週</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">在庫週数</p>
                    <p className={`text-lg font-bold leading-none ${analyticsData.stockWeeks < 3 ? "text-rose-500" : analyticsData.stockWeeks < 5 ? "text-amber-500" : "text-foreground"}`}>
                      {analyticsData.stockWeeks.toFixed(1)}
                      <span className="text-xs text-muted-foreground ml-1">週</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              このロケーションのデータはありません
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Brand picker dialog */}
      <Dialog open={!!editingPos} onOpenChange={open => !open && setEditingPos(null)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>{editingPos} — ブランド割り当て</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2.5 py-4">
            {displayProducts.map(prod => {
              const color = BRAND_COLORS[prod.name] || "bg-primary";
              const isCurrent = editingPos ? thisWeek[editingPos] === prod.name : false;
              return (
                <Button
                  key={prod.id}
                  variant="outline"
                  className={`h-14 flex items-center justify-center relative overflow-hidden border-none text-white hover:opacity-90 ${color}`}
                  onClick={() => handleAssignBrand(prod.name)}
                  data-testid={`brand-pick-${prod.name}`}
                >
                  <span className="text-sm font-black tracking-tighter">{prod.name}</span>
                  {isCurrent && <Check className="absolute top-1 right-1 h-3.5 w-3.5" />}
                </Button>
              );
            })}
          </div>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground border border-border/40"
            onClick={() => handleAssignBrand("")}
            data-testid="brand-pick-clear"
          >
            未割り当てにする
          </Button>
        </DialogContent>
      </Dialog>

      {/* Send to stores confirmation dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={open => !open && setSendDialogOpen(false)}>
        <DialogContent className="sm:max-w-[460px]" data-testid="send-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              VMD指示を店舗に送信
            </DialogTitle>
            <DialogDescription>
              今週のVMD指示を全店舗に送信します。送信後、各店舗のVMD計画ページに反映されます。
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <div className="rounded-lg border border-border/40 bg-secondary/20 p-4 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">送信内容</p>
              <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                {Object.entries(thisWeek).filter(([, b]) => b).map(([pos, brand]) => (
                  <div key={pos} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-24 shrink-0">{pos}</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-black text-white ${BRAND_COLORS[brand] || "bg-slate-400"}`}>
                      {brand}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border/40 bg-secondary/20 px-4 py-3 flex items-center gap-2.5">
              <Store className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">送信先: <span className="font-semibold text-foreground">全8店舗</span></p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSendDialogOpen(false)} disabled={sending} data-testid="button-send-cancel">
              キャンセル
            </Button>
            <Button onClick={handleSend} disabled={sending} className="gap-2" data-testid="button-send-confirm">
              {sending ? (
                <>送信中...</>
              ) : (
                <><Send className="h-4 w-4" />送信する</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
