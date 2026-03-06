import { useState } from "react";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Pencil, Check, X, LayoutGrid } from "lucide-react";
import { useStorePlan, FIXTURES, BRAND_COLORS, LAST_WEEK } from "@/context/StorePlanContext";

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

const ALL_BRANDS = [
  "AIR", "SUN", "GB", "JD", "ES", "KM", "NICHE", "MOVE",
  "JUNNI", "HP", "The ONE", "BinB", "AIR PLA", "AIR METAL", "雑貨",
];

function getDiff(last: string[], curr: string[]): "added" | "removed" | "changed" | "same" {
  if (JSON.stringify([...last].sort()) === JSON.stringify([...curr].sort())) return "same";
  const added = curr.some(b => !last.includes(b));
  const removed = last.some(b => !curr.includes(b));
  if (added && removed) return "changed";
  if (added) return "added";
  return "removed";
}

function BrandPill({ brand }: { brand: string }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold text-white ${BRAND_COLORS[brand] || "bg-slate-400"}`}>
      {brand}
    </span>
  );
}

function DiffBadge({ diff }: { diff: ReturnType<typeof getDiff> }) {
  if (diff === "same") return null;
  const styles = {
    added: "bg-emerald-100 text-emerald-700 border-emerald-200",
    removed: "bg-rose-100 text-rose-700 border-rose-200",
    changed: "bg-amber-100 text-amber-700 border-amber-200",
  };
  const labels = { added: "追加", removed: "削除", changed: "変更" };
  return (
    <span className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${styles[diff]}`}>
      {labels[diff]}
    </span>
  );
}

export default function StorePlan() {
  const params = useParams<{ id: string }>();
  const storeId = params.id || "1";
  const storeName = STORE_NAMES[storeId] || "店舗";
  const { assignments, updateAssignment, selectedFixtureId, setSelectedFixtureId } = useStorePlan();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBrands, setEditBrands] = useState<string[]>([]);

  const openEdit = (fixtureId: string) => {
    setEditingId(fixtureId);
    setEditBrands([...(assignments[fixtureId] ?? [])]);
  };

  const toggleBrand = (brand: string) => {
    setEditBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateAssignment(editingId, editBrands);
    setEditingId(null);
  };

  const editingFixture = editingId ? FIXTURES.find(f => f.id === editingId) : null;

  const changedCount = FIXTURES.filter(f => {
    const diff = getDiff(LAST_WEEK[f.id] ?? [], assignments[f.id] ?? []);
    return diff !== "same";
  }).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/hq/stores" className="hover:text-foreground transition-colors">店舗一覧</Link>
          <span>/</span>
          <Link href={`/store/${storeId}/summary`} className="hover:text-foreground transition-colors">{storeName}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">今週の売場計画</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">今週の売場計画</h1>
            <p className="mt-2 text-muted-foreground">先週と今週の什器ブランド割り付けを確認・編集します。</p>
          </div>
          {changedCount > 0 && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold px-3 py-1.5">
              {changedCount} 件の変更
            </Badge>
          )}
        </div>
      </div>

      {/* Week comparison table */}
      <div className="rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr] bg-secondary/30 border-b border-border/40">
          <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">什器</div>
          <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-l border-border/40">
            先週
          </div>
          <div className="px-5 py-3 text-xs font-bold text-primary uppercase tracking-wider border-l border-border/40 flex items-center justify-between">
            <span>今週</span>
            <span className="text-muted-foreground normal-case font-normal text-[11px]">クリックで編集</span>
          </div>
        </div>

        {/* Rows */}
        {FIXTURES.map(fixture => {
          const lastBrands = LAST_WEEK[fixture.id] ?? [];
          const currBrands = assignments[fixture.id] ?? [];
          const diff = getDiff(lastBrands, currBrands);
          const isSelected = selectedFixtureId === fixture.id;

          return (
            <div
              key={fixture.id}
              className={`grid grid-cols-[1fr_1fr_1fr] border-b border-border/40 last:border-0 transition-colors ${
                isSelected ? "bg-primary/5" : "hover:bg-secondary/10"
              }`}
            >
              {/* Fixture name */}
              <button
                className="px-5 py-4 text-left"
                onClick={() => setSelectedFixtureId(isSelected ? null : fixture.id)}
                data-testid={`plan-row-${fixture.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${
                    fixture.type === "wall" ? "bg-slate-400" :
                    fixture.type === "island" ? "bg-amber-400" : "bg-stone-400"
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{fixture.label}</p>
                    <p className="text-[11px] text-muted-foreground">{fixture.labelJp}</p>
                  </div>
                  {diff !== "same" && <DiffBadge diff={diff} />}
                </div>
              </button>

              {/* Last week */}
              <div className="px-5 py-4 border-l border-border/40 flex flex-wrap gap-1.5 items-start content-start">
                {lastBrands.length > 0 ? lastBrands.map(b => (
                  <span
                    key={b}
                    className={`text-[11px] font-bold text-white rounded px-1.5 py-0.5 opacity-60 ${BRAND_COLORS[b] || "bg-slate-400"} ${
                      !currBrands.includes(b) ? "line-through opacity-40" : ""
                    }`}
                  >
                    {b}
                  </span>
                )) : (
                  <span className="text-xs text-muted-foreground/50 italic">未割り当て</span>
                )}
              </div>

              {/* This week — editable */}
              <div className="px-5 py-4 border-l border-border/40 flex flex-wrap gap-1.5 items-start content-start group relative">
                {currBrands.length > 0 ? currBrands.map(b => {
                  const isNew = !lastBrands.includes(b);
                  return (
                    <span
                      key={b}
                      className={`text-[11px] font-bold text-white rounded px-1.5 py-0.5 ${BRAND_COLORS[b] || "bg-slate-400"} ${
                        isNew ? "ring-2 ring-offset-1 ring-emerald-400" : ""
                      }`}
                    >
                      {b}
                    </span>
                  );
                }) : (
                  <span className="text-xs text-muted-foreground/50 italic">未割り当て</span>
                )}
                <button
                  onClick={() => openEdit(fixture.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all"
                  data-testid={`edit-fixture-${fixture.id}`}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Change summary */}
      {changedCount > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">{changedCount} 件の什器で変更があります</p>
            <p className="text-xs text-amber-700 mt-0.5">変更内容を確認し、店舗に周知してください。</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground/60 italic">
        ※ 今週の計画は「店舗レイアウト」ページのフロアマップと連動しています。
      </p>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={open => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingFixture?.label} — ブランド割り付け編集
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              {editingFixture?.labelJp} に表示するブランドを選択してください（複数可）。
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ALL_BRANDS.map(brand => {
                const selected = editBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`relative h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white transition-all ${
                      BRAND_COLORS[brand] || "bg-slate-400"
                    } ${selected ? "ring-2 ring-offset-2 ring-foreground/30 scale-95" : "opacity-50 hover:opacity-80"}`}
                  >
                    {brand}
                    {selected && (
                      <Check className="absolute top-1 right-1 h-3.5 w-3.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditingId(null)}>
              <X className="h-4 w-4 mr-1" /> キャンセル
            </Button>
            <Button className="flex-1" onClick={saveEdit}>
              <Check className="h-4 w-4 mr-1" /> 保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
