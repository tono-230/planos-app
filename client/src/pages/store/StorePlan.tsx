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
import { ArrowRight, Pencil, Check, X, MessageSquare } from "lucide-react";
import { useStorePlan, FIXTURES, BRAND_COLORS, LAST_WEEK, ZONE_STYLES, HQ_THIS_WEEK } from "@/context/StorePlanContext";
import type { Fixture } from "@/context/StorePlanContext";

function HqInstructionCell({ fixture }: { fixture: Fixture }) {
  const entries = fixture.positions.map(pos => ({
    pos,
    brand: HQ_THIS_WEEK[pos] || "",
  }));
  return (
    <div className="space-y-1.5">
      {entries.map(({ pos, brand }) => (
        <div key={pos} className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground/70 font-medium whitespace-nowrap">{pos}</span>
          {brand ? (
            <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-black text-white ${BRAND_COLORS[brand] || "bg-slate-400"}`}>
              {brand}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground/40 italic">未割当</span>
          )}
        </div>
      ))}
    </div>
  );
}

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

  const allAssigned = new Set(Object.values(assignments).flat());
  const unassignedBrands = ALL_BRANDS.filter(b => !allAssigned.has(b));

  const changedCount = FIXTURES.filter(f => {
    const diff = getDiff(LAST_WEEK[f.id] ?? [], assignments[f.id] ?? []);
    return diff !== "same";
  }).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/hq/stores" className="hover:text-foreground transition-colors">店舗一覧</Link>
          <span>/</span>
          <Link href={`/store/${storeId}/summary`} className="hover:text-foreground transition-colors">{storeName}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">今週のVMD計画</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">今週のVMD計画</h1>
            <p className="mt-1.5 text-sm text-muted-foreground hidden md:block">先週と今週の什器ブランド割り付けを確認・編集します。</p>
          </div>
          {changedCount > 0 && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs font-semibold px-3 py-1.5 shrink-0">
              {changedCount} 件の変更
            </Badge>
          )}
        </div>
      </div>

      {/* Unassigned brands strip */}
      {unassignedBrands.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-secondary/20 px-4 py-3">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">未割り当てブランド</p>
          <div className="flex flex-wrap gap-1.5">
            {unassignedBrands.map(b => (
              <span
                key={b}
                className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-bold text-white opacity-50 ${BRAND_COLORS[b] || "bg-slate-400"}`}
                data-testid={`unassigned-brand-${b}`}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile: card list ── */}
      <div className="md:hidden space-y-3">
        {FIXTURES.map(fixture => {
          const lastBrands = LAST_WEEK[fixture.id] ?? [];
          const currBrands = assignments[fixture.id] ?? [];
          const diff = getDiff(lastBrands, currBrands);
          const zoneStyle = ZONE_STYLES[fixture.zone];

          return (
            <div
              key={fixture.id}
              className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden"
              data-testid={`plan-card-${fixture.id}`}
            >
              {/* Card header */}
              <div className={`px-4 py-3 flex items-center justify-between border-b border-border/40 ${zoneStyle.bg}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`text-[11px] font-black border rounded px-2 py-0.5 ${zoneStyle.bg} ${zoneStyle.text} ${zoneStyle.border}`}>
                    {fixture.zone}
                  </span>
                  <div>
                    <p className="text-base font-bold text-foreground leading-tight">{fixture.label}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{fixture.labelJp}</p>
                  </div>
                  {diff !== "same" && <DiffBadge diff={diff} />}
                </div>
                <button
                  onClick={() => openEdit(fixture.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-white/60 border border-border/40 px-3 py-2 text-sm font-semibold text-foreground active:bg-white/90 transition-colors"
                  data-testid={`edit-fixture-${fixture.id}`}
                >
                  <Pencil className="h-4 w-4" />
                  編集
                </button>
              </div>

              {/* 本部指示 */}
              <div className="px-4 py-3 border-b border-border/30 bg-primary/[0.02]" data-testid={`hq-instruction-mobile-${fixture.id}`}>
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">本部指示</p>
                    <HqInstructionCell fixture={fixture} />
                  </div>
                </div>
              </div>

              {/* Current brands */}
              <div className="px-4 py-3.5">
                <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">今週</p>
                <div className="flex flex-wrap gap-2">
                  {currBrands.length > 0 ? currBrands.map(b => {
                    const isNew = !lastBrands.includes(b);
                    return (
                      <span
                        key={b}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-bold text-white ${BRAND_COLORS[b] || "bg-slate-400"} ${isNew ? "ring-2 ring-offset-1 ring-emerald-400" : ""}`}
                      >
                        {b}
                      </span>
                    );
                  }) : (
                    <span className="text-sm text-muted-foreground/60 italic">未割り当て</span>
                  )}
                </div>

                {/* Changed brands from last week */}
                {lastBrands.length > 0 && diff !== "same" && (
                  <div className="mt-2.5 pt-2.5 border-t border-border/30">
                    <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">先週</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lastBrands.map(b => (
                        <span
                          key={b}
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold text-white opacity-50 ${BRAND_COLORS[b] || "bg-slate-400"} ${!currBrands.includes(b) ? "line-through opacity-30" : ""}`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden md:block rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[90px_1.4fr_0.7fr_0.8fr_0.9fr] bg-secondary/30 border-b border-border/40">
          <div className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">ZONE</div>
          <div className="px-5 py-3 text-xs font-bold text-primary uppercase tracking-wider border-l border-border/40 flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            本部指示
          </div>
          <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-l border-border/40">什器</div>
          <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-l border-border/40">先週</div>
          <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-l border-border/40 flex items-center justify-between">
            <span>今週</span>
            <span className="text-muted-foreground normal-case font-normal text-[11px]">クリックで編集</span>
          </div>
        </div>

        {FIXTURES.map(fixture => {
          const lastBrands = LAST_WEEK[fixture.id] ?? [];
          const currBrands = assignments[fixture.id] ?? [];
          const diff = getDiff(lastBrands, currBrands);
          const isSelected = selectedFixtureId === fixture.id;
          const zoneStyle = ZONE_STYLES[fixture.zone];

          return (
            <div
              key={fixture.id}
              className={`grid grid-cols-[90px_1.4fr_0.7fr_0.8fr_0.9fr] border-b border-border/40 last:border-0 transition-colors ${
                isSelected ? "bg-primary/5" : "hover:bg-secondary/10"
              }`}
            >
              {/* ZONE */}
              <div className="px-4 py-4 flex items-start pt-5">
                <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-black border ${zoneStyle.bg} ${zoneStyle.text} ${zoneStyle.border}`} data-testid={`zone-badge-${fixture.id}`}>
                  {fixture.zone}
                </span>
              </div>

              {/* 本部指示 */}
              <div className="px-5 py-4 border-l border-border/40" data-testid={`hq-instruction-${fixture.id}`}>
                <HqInstructionCell fixture={fixture} />
              </div>

              {/* 什器 */}
              <button
                className="px-5 py-4 text-left border-l border-border/40"
                onClick={() => setSelectedFixtureId(isSelected ? null : fixture.id)}
                data-testid={`plan-row-${fixture.id}`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${fixture.type === "wall" ? "bg-slate-400" : "bg-amber-400"} mb-1`} />
                  <p className="text-sm font-semibold text-foreground leading-tight">{fixture.label}</p>
                  <p className="text-[11px] text-muted-foreground">{fixture.labelJp}</p>
                  {diff !== "same" && <DiffBadge diff={diff} />}
                </div>
              </button>

              {/* 先週 */}
              <div className="px-5 py-4 border-l border-border/40 flex flex-wrap gap-1.5 items-start content-start">
                {lastBrands.length > 0 ? lastBrands.map(b => (
                  <span key={b} className={`text-[11px] font-bold text-white rounded px-1.5 py-0.5 opacity-60 ${BRAND_COLORS[b] || "bg-slate-400"} ${!currBrands.includes(b) ? "line-through opacity-40" : ""}`}>{b}</span>
                )) : <span className="text-xs text-muted-foreground/50 italic">未割り当て</span>}
              </div>

              {/* 今週 */}
              <div className="px-5 py-4 border-l border-border/40 flex flex-wrap gap-1.5 items-start content-start group relative">
                {currBrands.length > 0 ? currBrands.map(b => {
                  const isNew = !lastBrands.includes(b);
                  return (
                    <span key={b} className={`text-[11px] font-bold text-white rounded px-1.5 py-0.5 ${BRAND_COLORS[b] || "bg-slate-400"} ${isNew ? "ring-2 ring-offset-1 ring-emerald-400" : ""}`}>{b}</span>
                  );
                }) : <span className="text-xs text-muted-foreground/50 italic">未割り当て</span>}
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

      {/* Change notice */}
      {changedCount > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">{changedCount} 件の什器で変更があります</p>
            <p className="text-xs text-amber-700 mt-0.5">変更内容を確認し、店舗に周知してください。</p>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={open => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">
              {editingFixture?.label} — ブランド割り付け編集
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 overflow-y-auto flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              {editingFixture?.labelJp} に表示するブランドを選択してください。
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {ALL_BRANDS.map(brand => {
                const selected = editBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    data-testid={`brand-toggle-${brand}`}
                    className={`relative h-14 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all touch-manipulation ${
                      BRAND_COLORS[brand] || "bg-slate-400"
                    } ${selected ? "ring-2 ring-offset-2 ring-foreground/30 scale-95" : "opacity-50 hover:opacity-80 active:opacity-70"}`}
                  >
                    {brand}
                    {selected && <Check className="absolute top-1.5 right-1.5 h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2.5 pt-3 border-t border-border/40">
            <Button variant="outline" className="flex-1 h-12 text-base" onClick={() => setEditingId(null)}>
              <X className="h-4 w-4 mr-1.5" /> キャンセル
            </Button>
            <Button className="flex-1 h-12 text-base" onClick={saveEdit} data-testid="button-save-brands">
              <Check className="h-4 w-4 mr-1.5" /> 保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
