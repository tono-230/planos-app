import { useState } from "react";
import { Link, useParams } from "wouter";
import { Tag, LayoutGrid, X, Check, Ruler, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStorePlan, FIXTURES, BRAND_COLORS, ZONE_STYLES } from "@/context/StorePlanContext";

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

const ALL_BRANDS = [
  "AIR", "SUN", "GB", "JD", "ES", "KM", "NICHE", "MOVE",
  "JUNNI", "HP", "The ONE", "BinB", "AIR PLA", "AIR METAL", "雑貨",
];

function GridOverlay({ cols = 3, rows = 2 }: { cols?: number; rows?: number }) {
  return (
    <div className="absolute inset-1 grid gap-0.5 pointer-events-none opacity-30"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="rounded-sm bg-current" />
      ))}
    </div>
  );
}

function WallCellsH({ count = 5 }: { count?: number }) {
  return (
    <div className="absolute inset-1 flex gap-0.5 pointer-events-none opacity-30">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 rounded-sm bg-current" />
      ))}
    </div>
  );
}

function WallCellsV({ count = 4 }: { count?: number }) {
  return (
    <div className="absolute inset-1 flex flex-col gap-0.5 pointer-events-none opacity-30">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 rounded-sm bg-current" />
      ))}
    </div>
  );
}

export default function StoreLayout() {
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
  const selectedFixture = selectedFixtureId ? FIXTURES.find(f => f.id === selectedFixtureId) ?? null : null;
  const selectedBrands = selectedFixtureId ? (assignments[selectedFixtureId] ?? []) : [];

  const fixtureStyle = (fixture: typeof FIXTURES[0], isSelected: boolean) => {
    if (fixture.type === "wall") {
      return isSelected
        ? "bg-slate-200 border-slate-600 text-slate-700 ring-2 ring-slate-400/50"
        : "bg-slate-100 border-slate-400 text-slate-600 hover:border-slate-600";
    }
    return isSelected
      ? "bg-amber-100 border-amber-500 text-amber-700 ring-2 ring-amber-400/50"
      : "bg-amber-50 border-amber-300 text-amber-700 hover:border-amber-500";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/hq/stores" className="hover:text-foreground transition-colors">店舗一覧</Link>
          <span>/</span>
          <Link href={`/store/${storeId}/summary`} className="hover:text-foreground transition-colors">{storeName}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">店舗レイアウト</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">店舗レイアウト</h1>
        <p className="mt-2 text-muted-foreground">什器配置とブランド割り付けの確認・編集。什器をクリックして詳細表示または編集します。</p>
      </div>

      <div className="flex gap-5 items-start">
        {/* Floor Plan */}
        <div className="flex-1 min-w-0">
          <div
            className="relative w-full rounded-2xl border-2 border-slate-300 bg-[#f7f6f2] overflow-hidden shadow-inner"
            style={{ aspectRatio: "14 / 10" }}
            data-testid="floor-plan"
          >
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.035]" style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 29px, #333 29px, #333 30px), repeating-linear-gradient(90deg, transparent, transparent 29px, #333 29px, #333 30px)"
            }} />

            {/* Outer walls */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-400 rounded-t-2xl" />
            <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-slate-400 rounded-r-2xl" />
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-slate-400 rounded-l-2xl" />

            {/* 受付加工エリア — left column, decorative (not assignable) */}
            <div
              className="absolute rounded-lg border-2 border-[#b09070]/60 bg-[#d8c8a8]/70 flex flex-col items-center justify-center gap-1"
              style={{ top: "3%", left: "1%", width: "16%", height: "78%" }}
            >
              <ClipboardList className="h-[clamp(10px,1.8vw,18px)] w-[clamp(10px,1.8vw,18px)] text-[#8a6c4a] opacity-70" />
              <span className="text-[clamp(7px,1vw,10px)] font-bold text-[#8a6c4a] text-center leading-tight tracking-wide px-1">
                受付<br />加工
              </span>
            </div>

            {/* 測定エリア — top center, decorative (not assignable) */}
            <div
              className="absolute rounded-lg border-2 border-teal-300/60 bg-teal-100/60 flex flex-col items-center justify-center gap-1"
              style={{ top: "3%", left: "21%", width: "15%", height: "28%" }}
            >
              <Ruler className="h-[clamp(8px,1.4vw,14px)] w-[clamp(8px,1.4vw,14px)] text-teal-600 opacity-80" />
              <span className="text-[clamp(6px,0.9vw,9px)] font-bold text-teal-700 text-center leading-tight tracking-wide">
                測定<br />エリア
              </span>
            </div>

            {/* Entrance */}
            <div className="absolute bottom-0 left-[38%] right-[38%] flex flex-col items-center gap-0.5 pb-1">
              <div className="text-[clamp(6px,0.8vw,9px)] font-semibold text-slate-400 tracking-widest uppercase">Entrance</div>
              <div className="w-full h-1 rounded-full bg-slate-200" />
            </div>

            {/* Assignable fixtures */}
            {FIXTURES.map(fixture => {
              const isSelected = selectedFixtureId === fixture.id;
              const brands = assignments[fixture.id] ?? [];

              return (
                <button
                  key={fixture.id}
                  style={fixture.style}
                  className={`absolute rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer overflow-hidden ${fixtureStyle(fixture, isSelected)}`}
                  onClick={() => setSelectedFixtureId(isSelected ? null : fixture.id)}
                  data-testid={`fixture-${fixture.id}`}
                >
                  {fixture.id === "wall-top" && <WallCellsH count={6} />}
                  {fixture.id === "wall-right" && <WallCellsV count={5} />}
                  {fixture.id.startsWith("island") && <GridOverlay cols={3} rows={2} />}
                  {fixture.id.startsWith("bottom") && <GridOverlay cols={4} rows={1} />}

                  <span className="relative z-10 text-[clamp(7px,1vw,11px)] font-bold tracking-wide leading-tight">{fixture.label}</span>
                  <div className="relative z-10 flex gap-0.5 flex-wrap justify-center px-1">
                    {brands.slice(0, 3).map(b => (
                      <span
                        key={b}
                        className={`inline-block rounded-sm text-white font-bold leading-none ${BRAND_COLORS[b] || "bg-slate-400"}`}
                        style={{ fontSize: "clamp(5px,0.75vw,8px)", padding: "1px 3px" }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-4 px-1">
            <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">凡例</span>
            {Object.entries(ZONE_STYLES).map(([zone, style]) => (
              <div key={zone} className="flex items-center gap-1.5">
                <span className={`text-[10px] font-black border rounded px-1.5 py-0.5 ${style.bg} ${style.text} ${style.border}`}>{zone}</span>
                <span className="text-xs text-muted-foreground">
                  {zone === "HOT" ? "壁面什器" : zone === "MAIN" ? "島什器" : "下部什器"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail / Edit Card */}
        <div className="w-72 shrink-0">
          {selectedFixture ? (
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-200">
              <div className={`px-5 py-4 border-b border-border/40 flex items-start justify-between ${
                selectedFixture.type === "wall" ? "bg-slate-50" : "bg-amber-50"
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-[10px] font-black border rounded px-1.5 py-0.5 ${ZONE_STYLES[selectedFixture.zone].bg} ${ZONE_STYLES[selectedFixture.zone].text} ${ZONE_STYLES[selectedFixture.zone].border}`}>
                      {selectedFixture.zone}
                    </span>
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">{selectedFixture.label}</h2>
                  <p className="text-sm text-muted-foreground">{selectedFixture.labelJp}</p>
                </div>
                <button
                  onClick={() => setSelectedFixtureId(null)}
                  className="p-1 rounded-md hover:bg-black/5 text-muted-foreground transition-colors"
                  data-testid="button-close-detail"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedFixture.description}</p>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Tag className="h-3 w-3" /> 割り当てブランド
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBrands.length > 0 ? selectedBrands.map(b => (
                      <span
                        key={b}
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold text-white ${BRAND_COLORS[b] || "bg-slate-500"}`}
                      >
                        {b}
                      </span>
                    )) : (
                      <span className="text-sm text-muted-foreground">未割り当て</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-muted-foreground font-medium">ブランド数</p>
                    <p className="text-xl font-black text-foreground tabular-nums">{selectedBrands.length}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-muted-foreground font-medium">ステータス</p>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold mt-0.5 ${
                        selectedBrands.length > 0
                          ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                          : "border-slate-300 text-slate-500 bg-slate-50"
                      }`}
                    >
                      {selectedBrands.length > 0 ? "展示中" : "空き"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-border/40">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => openEdit(selectedFixture.id)}
                  data-testid="button-edit-brands"
                >
                  ブランド割り付けを編集
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/10 flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[260px]">
              <LayoutGrid className="h-8 w-8 text-border" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground">什器を選択</p>
                <p className="text-xs text-muted-foreground/70 mt-1">フロアマップ上の什器をクリックして詳細を表示します</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixtures List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">什器一覧</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {FIXTURES.map(fixture => {
            const isSelected = selectedFixtureId === fixture.id;
            const brands = assignments[fixture.id] ?? [];
            const zoneStyle = ZONE_STYLES[fixture.zone];
            return (
              <button
                key={fixture.id}
                onClick={() => setSelectedFixtureId(isSelected ? null : fixture.id)}
                data-testid={`list-fixture-${fixture.id}`}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 bg-card hover:border-border hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-2 gap-1">
                  <p className="text-xs font-bold text-foreground leading-tight">{fixture.labelJp}</p>
                  <span className={`text-[9px] font-black border rounded px-1 py-0 shrink-0 ${zoneStyle.bg} ${zoneStyle.text} ${zoneStyle.border}`}>
                    {fixture.zone}
                  </span>
                </div>
                <div className="mt-1 flex gap-1 flex-wrap">
                  {brands.slice(0, 2).map(b => (
                    <span key={b} className={`text-[10px] font-bold text-white rounded px-1.5 py-0.5 ${BRAND_COLORS[b] || "bg-slate-400"}`}>{b}</span>
                  ))}
                  {brands.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">+{brands.length - 2}</span>
                  )}
                  {brands.length === 0 && (
                    <span className="text-[10px] text-muted-foreground/50 italic">未割り当て</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60 italic">
        ※ レイアウトは「今週の売場計画」ページとリアルタイムで連動しています。
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
                    data-testid={`brand-toggle-${brand}`}
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
            <Button className="flex-1" onClick={saveEdit} data-testid="button-save-brands">
              <Check className="h-4 w-4 mr-1" /> 保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
