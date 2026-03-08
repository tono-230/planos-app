import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ROWS = ["A", "B", "C", "D"] as const;
const COLS = ["1", "2", "3", "4"] as const;
const POSITIONS = ROWS.flatMap(r => COLS.map(c => `${r}${c}`));

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

const LAST_WEEK: Record<string, string> = {
  A1: "AIR",     A2: "SUN",       A3: "GB",      A4: "JD",
  B1: "ES",      B2: "KM",        B3: "NICHE",   B4: "MOVE",
  C1: "JUNNI",   C2: "HP",        C3: "The ONE", C4: "BinB",
  D1: "AIR PLA", D2: "AIR METAL", D3: "雑貨",    D4: "",
};

const THIS_WEEK_INIT: Record<string, string> = {
  A1: "AIR",   A2: "KM",        A3: "GB",      A4: "JD",
  B1: "ES",    B2: "SUN",       B3: "NICHE",   B4: "MOVE",
  C1: "JUNNI", C2: "HP",        C3: "The ONE", C4: "AIR PLA",
  D1: "",      D2: "AIR METAL", D3: "雑貨",    D4: "GB",
};

type DiffType = "same" | "empty" | "added" | "removed" | "changed";

function getDiff(last: string, curr: string): DiffType {
  if (!last && !curr) return "empty";
  if (!last && curr) return "added";
  if (last && !curr) return "removed";
  if (last !== curr) return "changed";
  return "same";
}

function BrandTag({ name, faded = false }: { name: string; faded?: boolean }) {
  const color = BRAND_COLORS[name] || "bg-primary";
  return (
    <span className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-black text-white leading-none ${color} ${faded ? "opacity-40" : ""}`}>
      {name}
    </span>
  );
}

function LastWeekCell({ pos }: { pos: string }) {
  const brand = LAST_WEEK[pos] || "";
  const currBrand = THIS_WEEK_INIT[pos] || "";
  const diff = getDiff(brand, currBrand);
  const faded = diff === "changed" || diff === "removed";

  return (
    <div className="flex flex-col items-center justify-center h-20 rounded-xl bg-secondary/30 border border-border/30 px-2 gap-1">
      <span className="text-[9px] font-mono text-muted-foreground/50 self-start">{pos}</span>
      <div className="flex-1 flex items-center justify-center w-full">
        {brand ? (
          <BrandTag name={brand} faded={faded} />
        ) : (
          <span className="text-[10px] text-muted-foreground/30 italic">未割り当て</span>
        )}
      </div>
    </div>
  );
}

function ThisWeekCell({
  pos,
  brands,
  onEdit,
}: {
  pos: string;
  brands: Record<string, string>;
  onEdit: (pos: string) => void;
}) {
  const currBrand = brands[pos] || "";
  const lastBrand = LAST_WEEK[pos] || "";
  const diff = getDiff(lastBrand, currBrand);
  const color = currBrand ? (BRAND_COLORS[currBrand] || "bg-primary") : null;

  const ringClass =
    diff === "added" ? "ring-2 ring-emerald-400 ring-offset-1" :
    diff === "changed" ? "ring-2 ring-amber-400 ring-offset-1" :
    diff === "removed" ? "ring-2 ring-rose-400 ring-offset-1 border-dashed" : "";

  const badgeStyle =
    diff === "added" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
    diff === "changed" ? "bg-amber-100 text-amber-700 border-amber-200" :
    diff === "removed" ? "bg-rose-100 text-rose-700 border-rose-200" : "";

  const badgeLabel =
    diff === "added" ? "新規" :
    diff === "changed" ? "変更" :
    diff === "removed" ? "削除" : "";

  return (
    <button
      className={`group relative flex flex-col items-center justify-center h-20 w-full rounded-xl border border-border/30 px-2 gap-0.5 transition-all hover:shadow-md hover:border-primary/30 hover:bg-primary/[0.02] cursor-pointer ${ringClass} ${diff !== "empty" && diff !== "same" ? "bg-secondary/10" : "bg-secondary/30"}`}
      onClick={() => onEdit(pos)}
      data-testid={`cell-thisweek-${pos}`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[9px] font-mono text-muted-foreground/50">{pos}</span>
        {badgeLabel && (
          <span className={`text-[8px] font-bold border rounded px-1 py-0.5 leading-none ${badgeStyle}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        {currBrand ? (
          <BrandTag name={currBrand} />
        ) : (
          <span className="text-[10px] text-muted-foreground/30 italic">未割り当て</span>
        )}
      </div>

      {(diff === "changed") && (
        <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground/60 font-medium">
          <span>{lastBrand}</span>
          <ArrowRight className="h-2.5 w-2.5" />
          <span>{currBrand}</span>
        </div>
      )}
      {diff === "removed" && lastBrand && (
        <div className="text-[9px] text-rose-400/80 font-medium line-through">{lastBrand}</div>
      )}

      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </div>
    </button>
  );
}

export default function PlanManager() {
  const { toast } = useToast();
  const { data: products, isLoading: loadingProds } = useProducts();

  const [thisWeek, setThisWeek] = useState<Record<string, string>>(THIS_WEEK_INIT);
  const [editingPos, setEditingPos] = useState<string | null>(null);

  const handleAssignBrand = (brand: string) => {
    if (!editingPos) return;
    setThisWeek(prev => ({ ...prev, [editingPos]: brand }));
    toast({ title: "更新完了", description: `${editingPos} に ${brand || "未割り当て"} を設定しました。` });
    setEditingPos(null);
  };

  const changedPositions = POSITIONS.filter(pos => {
    const diff = getDiff(LAST_WEEK[pos] || "", thisWeek[pos] || "");
    return diff !== "same" && diff !== "empty";
  });

  if (loadingProds) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">今週の売場計画</h1>
          <p className="mt-2 text-muted-foreground">先週と今週のブランド配置をグリッドで比較します。各セルをクリックして編集できます。</p>
        </div>
        {changedPositions.length > 0 && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold px-3 py-1.5">
            {changedPositions.length} 件の変更
          </Badge>
        )}
      </div>

      {/* Grid comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* 先週 */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">先週</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {/* Column headers */}
            <div className="grid grid-cols-4 gap-2 mb-1">
              {COLS.map(c => (
                <div key={c} className="text-center text-[10px] font-mono text-muted-foreground/40">{c}</div>
              ))}
            </div>
            {/* Grid rows */}
            {ROWS.map(row => (
              <div key={row} className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-muted-foreground/40 w-3 shrink-0">{row}</span>
                <div className="grid grid-cols-4 gap-2 flex-1">
                  {COLS.map(col => (
                    <LastWeekCell key={`${row}${col}`} pos={`${row}${col}`} />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 今週 */}
        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">今週</CardTitle>
              <span className="text-[10px] text-muted-foreground">クリックで編集</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {/* Column headers */}
            <div className="grid grid-cols-4 gap-2 mb-1">
              {COLS.map(c => (
                <div key={c} className="text-center text-[10px] font-mono text-muted-foreground/40">{c}</div>
              ))}
            </div>
            {/* Grid rows */}
            {ROWS.map(row => (
              <div key={row} className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-muted-foreground/40 w-3 shrink-0">{row}</span>
                <div className="grid grid-cols-4 gap-2 flex-1">
                  {COLS.map(col => (
                    <ThisWeekCell
                      key={`${row}${col}`}
                      pos={`${row}${col}`}
                      brands={thisWeek}
                      onEdit={setEditingPos}
                    />
                  ))}
                </div>
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
              {changedPositions.length} 件のセルで変更があります
              <span className="font-normal text-amber-700 ml-2 text-xs">
                ({changedPositions.join("、")})
              </span>
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
            <DialogTitle>
              セル {editingPos} — ブランド割り当て
            </DialogTitle>
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
          >
            未割り当てにする
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
