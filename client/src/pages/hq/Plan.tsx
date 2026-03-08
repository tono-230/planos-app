import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Check, ArrowRight, Pencil, TrendingUp, TrendingDown, Minus,
  BarChart2, Package, X, Search
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GROUPS = ["Hot spot", "Sub hot", "Main", "定番", "Feature", "Seasonal", "Sale"] as const;
const VARIANTS = ["A", "B"] as const;
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

const LAST_WEEK: Record<string, string> = {
  "Hot spot A": "AIR",     "Hot spot B": "SUN",
  "Sub hot A":  "GB",      "Sub hot B":  "JD",
  "Main A":     "ES",      "Main B":     "KM",
  "定番 A":      "NICHE",   "定番 B":     "MOVE",
  "Feature A":  "JUNNI",   "Feature B":  "HP",
  "Seasonal A": "The ONE", "Seasonal B": "BinB",
  "Sale A":     "雑貨",    "Sale B":     "",
};

const THIS_WEEK_INIT: Record<string, string> = {
  "Hot spot A": "AIR",     "Hot spot B": "KM",
  "Sub hot A":  "GB",      "Sub hot B":  "JD",
  "Main A":     "SUN",     "Main B":     "KM",
  "定番 A":      "NICHE",   "定番 B":     "MOVE",
  "Feature A":  "JUNNI",   "Feature B":  "The ONE",
  "Seasonal A": "",        "Seasonal B": "BinB",
  "Sale A":     "雑貨",    "Sale B":     "AIR PLA",
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

function TrendBadge({ trend }: { trend: Trend }) {
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

function LastWeekCell({ pos, isSelected, onSelect, currentWeekBrands }: {
  pos: string;
  isSelected: boolean;
  onSelect: (pos: string) => void;
  currentWeekBrands: Record<string, string>;
}) {
  const brand = LAST_WEEK[pos] || "";
  const currBrand = currentWeekBrands[pos] || "";
  const diff = getDiff(brand, currBrand);
  const faded = diff === "changed" || diff === "removed";

  return (
    <button
      className={`group relative flex flex-col items-center justify-center h-16 w-full rounded-xl border px-2 transition-all cursor-pointer
        ${isSelected
          ? "border-primary/60 bg-primary/5 ring-2 ring-primary/20 ring-offset-1"
          : "border-border/30 bg-secondary/30 hover:bg-secondary/60 hover:border-border/60 hover:shadow-sm"
        }`}
      onClick={() => onSelect(pos)}
      data-testid={`cell-lastweek-${pos.replace(/\s/g, "-")}`}
    >
      {brand ? (
        <BrandTag name={brand} faded={faded} />
      ) : (
        <span className="text-[10px] text-muted-foreground/30 italic">未割り当て</span>
      )}
      <div className={`absolute bottom-1 flex items-center gap-0.5 transition-opacity ${isSelected ? "opacity-60" : "opacity-0 group-hover:opacity-60"}`}>
        <Search className="h-2.5 w-2.5 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground">分析</span>
      </div>
    </button>
  );
}

function ThisWeekCell({ pos, brands, onEdit }: {
  pos: string;
  brands: Record<string, string>;
  onEdit: (pos: string) => void;
}) {
  const currBrand = brands[pos] || "";
  const lastBrand = LAST_WEEK[pos] || "";
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
      className={`group relative flex flex-col items-center justify-center h-16 w-full rounded-xl border border-border/30 px-2 gap-0.5 transition-all hover:shadow-md hover:border-primary/30 hover:bg-primary/[0.02] cursor-pointer bg-secondary/30 ${ringClass}`}
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

function AnalyticsPanel({ pos, brand, onClose }: { pos: string; brand: string; onClose: () => void }) {
  const a = BRAND_ANALYTICS[brand];

  return (
    <div className="rounded-2xl border border-primary/20 bg-card shadow-md animate-in slide-in-from-bottom-2 duration-200" data-testid="analytics-panel">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
        <div className="flex items-center gap-3">
          {brand && <BrandTag name={brand} />}
          <div>
            <p className="text-sm font-bold text-foreground">{pos}</p>
            <p className="text-xs text-muted-foreground">先週の実績データ</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          data-testid="analytics-panel-close"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {a ? (
        <div className="grid grid-cols-3 divide-x divide-border/40 px-0">
          {/* 売上動向 */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <BarChart2 className="h-3.5 w-3.5" />売上動向
            </div>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] text-muted-foreground">先週売上</p>
                <p className="text-xl font-black text-foreground">¥{a.lastWeekSales}<span className="text-sm font-normal text-muted-foreground ml-0.5">万</span></p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">前週比</p>
                <p className={`text-base font-bold ${a.weekOverWeek >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                  {a.weekOverWeek >= 0 ? "+" : ""}{a.weekOverWeek}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">売れ筋順位</p>
                <p className="text-base font-bold text-foreground">#{a.salesRank}</p>
              </div>
            </div>
          </div>

          {/* 傾向 */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5" />傾向
            </div>
            <div className="space-y-2.5">
              <TrendBadge trend={a.trend} />
              <p className="text-xs text-muted-foreground leading-relaxed">{a.comment}</p>
            </div>
          </div>

          {/* 在庫 */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <Package className="h-3.5 w-3.5" />在庫
            </div>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] text-muted-foreground">現在庫</p>
                <p className="text-xl font-black text-foreground">{a.stock}<span className="text-sm font-normal text-muted-foreground ml-0.5">点</span></p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">週販</p>
                <p className="text-base font-bold text-foreground">{a.weekSales}<span className="text-xs text-muted-foreground ml-0.5">点/週</span></p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">在庫週数</p>
                <p className={`text-base font-bold ${a.stockWeeks < 3 ? "text-rose-500" : a.stockWeeks < 5 ? "text-amber-500" : "text-foreground"}`}>
                  {a.stockWeeks.toFixed(1)}<span className="text-xs text-muted-foreground ml-0.5">週</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          このロケーションのデータはありません
        </div>
      )}
    </div>
  );
}

export default function PlanManager() {
  const { toast } = useToast();
  const { data: products, isLoading: loadingProds } = useProducts();

  const [thisWeek, setThisWeek] = useState<Record<string, string>>(THIS_WEEK_INIT);
  const [editingPos, setEditingPos] = useState<string | null>(null);
  const [selectedLastWeekPos, setSelectedLastWeekPos] = useState<string | null>(null);

  const handleAssignBrand = (brand: string) => {
    if (!editingPos) return;
    setThisWeek(prev => ({ ...prev, [editingPos]: brand }));
    toast({ title: "更新完了", description: `${editingPos} に ${brand || "未割り当て"} を設定しました。` });
    setEditingPos(null);
  };

  const handleSelectLastWeek = (pos: string) => {
    setSelectedLastWeekPos(prev => prev === pos ? null : pos);
  };

  const changedPositions = POSITIONS.filter(pos => {
    const diff = getDiff(LAST_WEEK[pos] || "", thisWeek[pos] || "");
    return diff !== "same" && diff !== "empty";
  });

  const assignedBrands = new Set(Object.values(thisWeek).filter(Boolean));
  const allBrands = products?.map(p => p.name) ?? Object.keys(BRAND_COLORS);
  const unassignedBrands = allBrands.filter(b => !assignedBrands.has(b));

  if (loadingProds) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const selectedBrand = selectedLastWeekPos ? (LAST_WEEK[selectedLastWeekPos] || "") : "";

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">今週の売場計画</h1>
          <p className="mt-2 text-muted-foreground">
            <span className="text-muted-foreground/70">先週セル</span>をクリックで分析表示、
            <span className="text-primary font-medium">今週セル</span>をクリックで編集。
          </p>
        </div>
        {changedPositions.length > 0 && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold px-3 py-1.5">
            {changedPositions.length} 件の変更
          </Badge>
        )}
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
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Search className="h-3 w-3" />クリックで分析表示
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
                  <LastWeekCell
                    key={`${group} ${v}`}
                    pos={`${group} ${v}`}
                    isSelected={selectedLastWeekPos === `${group} ${v}`}
                    onSelect={handleSelectLastWeek}
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

      {/* Analytics detail panel */}
      {selectedLastWeekPos && (
        <AnalyticsPanel
          pos={selectedLastWeekPos}
          brand={selectedBrand}
          onClose={() => setSelectedLastWeekPos(null)}
        />
      )}

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

      {/* Brand picker dialog */}
      <Dialog open={!!editingPos} onOpenChange={open => !open && setEditingPos(null)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>{editingPos} — ブランド割り当て</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2.5 py-4">
            {(products ?? []).map(prod => {
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
    </div>
  );
}
