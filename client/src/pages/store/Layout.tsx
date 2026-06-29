import { useState } from "react";
import { Link, useParams } from "wouter";
import { Tag, LayoutGrid, X, Check, Ruler, ClipboardList, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStorePlan, FIXTURES, BRAND_COLORS, ZONE_STYLES, FIXTURE_SHAPE_CONFIG } from "@/context/StorePlanContext";

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

const ALL_BRANDS = [
  "AIR", "SUN", "GB", "JD", "ES", "KM", "NICHE", "MOVE",
  "JUNNI", "HP", "The ONE", "BinB", "AIR PLA", "AIR METAL", "雑貨",
];

const RFID_SCAN_RESULTS: Record<string, string[]> = {
  "wall-top":   ["AIR", "SUN", "BinB"],
  "wall-top-2": ["GB"],
  "wall-right": ["KM"],
  "island-1":   ["JD"],
  "island-2":   ["NICHE", "HP"],
  "bottom-1":   ["MOVE", "JUNNI"],
  "bottom-2":   ["ES", "雑貨"],
};

type BrandStatus = "correct" | "extra" | "missing";

function getBrandStatus(brand: string, plan: string[], scan: string[]): BrandStatus {
  const inPlan = plan.includes(brand);
  const inScan = scan.includes(brand);
  if (inPlan && inScan) return "correct";
  if (!inPlan && inScan) return "extra";
  return "missing";
}

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

function fixtureStyle(fixture: typeof FIXTURES[0], isSelected: boolean) {
  if (fixture.type === "wall") {
    return isSelected
      ? "bg-slate-200 border-slate-600 text-slate-700 ring-2 ring-slate-400/50"
      : "bg-slate-100 border-slate-400 text-slate-600 hover:border-slate-600";
  }
  return isSelected
    ? "bg-amber-100 border-amber-500 text-amber-700 ring-2 ring-amber-400/50"
    : "bg-amber-50 border-amber-300 text-amber-700 hover:border-amber-500";
}

function FloorPlanCanvas({
  brands,
  planBrands,
  mode,
  selectedFixtureId,
  onSelect,
}: {
  brands: Record<string, string[]>;
  planBrands?: Record<string, string[]>;
  mode: "plan" | "scan";
  selectedFixtureId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="relative w-full rounded-2xl border-2 border-slate-300 bg-[#f7f6f2] overflow-hidden shadow-inner"
      style={{ aspectRatio: "14 / 10" }}
      data-testid={`floor-plan-${mode}`}
    >
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 29px, #333 29px, #333 30px), repeating-linear-gradient(90deg, transparent, transparent 29px, #333 29px, #333 30px)"
      }} />

      <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-400 rounded-t-2xl" />
      <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-slate-400 rounded-r-2xl" />
      <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-slate-400 rounded-l-2xl" />

      <div
        className="absolute rounded-lg border-2 border-[#b09070]/60 bg-[#d8c8a8]/70 flex flex-col items-center justify-center gap-1"
        style={{ top: "3%", left: "1%", width: "16%", height: "78%" }}
      >
        <ClipboardList className="h-[clamp(8px,1.4vw,14px)] w-[clamp(8px,1.4vw,14px)] text-[#8a6c4a] opacity-70" />
        <span className="text-[clamp(5px,0.7vw,8px)] font-bold text-[#8a6c4a] text-center leading-tight tracking-wide px-1">
          受付<br />加工
        </span>
      </div>

      <div
        className="absolute rounded-xl border-2 border-teal-300/60 bg-teal-100/60 flex flex-col items-center justify-center gap-1"
        style={{ top: "3%", left: "17%", width: "13%", height: "26%" }}
      >
        <Ruler className="h-[clamp(6px,1vw,10px)] w-[clamp(6px,1vw,10px)] text-teal-600 opacity-80" />
        <span className="text-[clamp(4px,0.7vw,7px)] font-bold text-teal-700 text-center leading-tight tracking-wide">
          測定<br />エリア
        </span>
      </div>

      <div className="absolute bottom-0 left-[38%] right-[38%] flex flex-col items-center gap-0.5 pb-1">
        <div className="text-[clamp(5px,0.6vw,7px)] font-semibold text-slate-400 tracking-widest uppercase">Entrance</div>
        <div className="w-full h-0.5 rounded-full bg-slate-200" />
      </div>

      {FIXTURES.map(fixture => {
        const isSelected = selectedFixtureId === fixture.id;
        const fixtureBrands = brands[fixture.id] ?? [];
        const plan = planBrands?.[fixture.id] ?? [];

        return (
          <button
            key={fixture.id}
            style={fixture.style}
            className={`absolute rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer overflow-hidden ${fixtureStyle(fixture, isSelected)}`}
            onClick={() => onSelect(fixture.id)}
            data-testid={`fixture-${mode}-${fixture.id}`}
          >
            <GridOverlay
              cols={FIXTURE_SHAPE_CONFIG[fixture.shapeKey].innerCols}
              rows={FIXTURE_SHAPE_CONFIG[fixture.shapeKey].innerRows}
            />

            <span className="relative z-10 text-[clamp(5px,0.75vw,9px)] font-bold tracking-wide leading-tight">{fixture.label}</span>

            <div className="relative z-10 flex gap-0.5 flex-wrap justify-center px-0.5">
              {mode === "plan" ? (
                fixtureBrands.slice(0, 3).map(b => (
                  <span
                    key={b}
                    className={`inline-block rounded-sm text-white font-bold leading-none ${BRAND_COLORS[b] || "bg-slate-400"}`}
                    style={{ fontSize: "clamp(4px,0.6vw,7px)", padding: "1px 3px" }}
                  >
                    {b}
                  </span>
                ))
              ) : (
                <>
                  {fixtureBrands.slice(0, 4).map(b => {
                    const status = getBrandStatus(b, plan, fixtureBrands);
                    return (
                      <span
                        key={b}
                        className={`inline-block rounded-sm font-bold leading-none ${
                          status === "correct"
                            ? `text-white ${BRAND_COLORS[b] || "bg-slate-400"}`
                            : "text-amber-900 bg-amber-300 ring-1 ring-amber-500"
                        }`}
                        style={{ fontSize: "clamp(4px,0.6vw,7px)", padding: "1px 3px" }}
                      >
                        {b}
                      </span>
                    );
                  })}
                  {plan.filter(b => !fixtureBrands.includes(b)).slice(0, 2).map(b => (
                    <span
                      key={`missing-${b}`}
                      className="inline-block rounded-sm font-bold leading-none text-slate-400 bg-slate-100 ring-1 ring-slate-300"
                      style={{ fontSize: "clamp(4px,0.6vw,7px)", padding: "1px 3px" }}
                    >
                      {b}
                    </span>
                  ))}
                </>
              )}
            </div>
          </button>
        );
      })}
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
  const selectedPlanBrands = selectedFixtureId ? (assignments[selectedFixtureId] ?? []) : [];
  const selectedScanBrands = selectedFixtureId ? (RFID_SCAN_RESULTS[selectedFixtureId] ?? []) : [];

  const correctCount = selectedScanBrands.filter(b => selectedPlanBrands.includes(b)).length;
  const extraBrands = selectedScanBrands.filter(b => !selectedPlanBrands.includes(b));
  const missingBrands = selectedPlanBrands.filter(b => !selectedScanBrands.includes(b));

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
        <p className="mt-2 text-muted-foreground">左: VMD計画 の配置  ／  右: RFIDスキャン結果。什器をクリックして詳細を表示します。</p>
      </div>

      {/* Dual floor plan */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Left: VMD計画 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">VMD計画</span>
            <span className="text-xs text-muted-foreground">— 今週の割り付け計画</span>
          </div>
          <FloorPlanCanvas
            brands={assignments}
            mode="plan"
            selectedFixtureId={selectedFixtureId}
            onSelect={id => setSelectedFixtureId(selectedFixtureId === id ? null : id)}
          />
          <div className="flex flex-wrap items-center gap-3 px-1 mt-1">
            <span className="text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">凡例</span>
            {Object.entries(ZONE_STYLES).map(([zone, style]) => (
              <div key={zone} className="flex items-center gap-1">
                <span className={`text-[9px] font-black border rounded px-1.5 py-0.5 ${style.bg} ${style.text} ${style.border}`}>{zone}</span>
                <span className="text-[10px] text-muted-foreground">
                  {zone === "HOT" ? "壁面什器" : zone === "MAIN" ? "島什器" : "下部什器"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: RFIDスキャン */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">RFIDスキャン結果</span>
            <span className="text-xs text-muted-foreground">— 2026-03-08 10:25</span>
          </div>
          <FloorPlanCanvas
            brands={RFID_SCAN_RESULTS}
            planBrands={assignments}
            mode="scan"
            selectedFixtureId={selectedFixtureId}
            onSelect={id => setSelectedFixtureId(selectedFixtureId === id ? null : id)}
          />
          <div className="flex flex-wrap items-center gap-3 px-1 mt-1">
            <span className="text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">凡例</span>
            <div className="flex items-center gap-1">
              <span className="inline-block rounded-sm text-white bg-blue-500 font-bold" style={{ fontSize: "9px", padding: "1px 5px" }}>ブランド</span>
              <span className="text-[10px] text-muted-foreground">正常</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block rounded-sm text-amber-900 bg-amber-300 ring-1 ring-amber-500 font-bold" style={{ fontSize: "9px", padding: "1px 5px" }}>ブランド</span>
              <span className="text-[10px] text-muted-foreground">過剰</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block rounded-sm text-slate-400 bg-slate-100 ring-1 ring-slate-300 font-bold" style={{ fontSize: "9px", padding: "1px 5px" }}>ブランド</span>
              <span className="text-[10px] text-muted-foreground">欠品</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail panel — shown when a fixture is selected */}
      {selectedFixture && (
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden animate-in fade-in duration-200" data-testid="fixture-detail-panel">
          <div className={`px-5 py-4 border-b border-border/40 flex items-start justify-between ${
            selectedFixture.type === "wall" ? "bg-slate-50" : "bg-amber-50"
          }`}>
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <span className={`text-[10px] font-black border rounded px-1.5 py-0.5 ${ZONE_STYLES[selectedFixture.zone].bg} ${ZONE_STYLES[selectedFixture.zone].text} ${ZONE_STYLES[selectedFixture.zone].border}`}>
                {selectedFixture.zone}
              </span>
              <h2 className="text-lg font-black tracking-tight text-foreground">{selectedFixture.label}</h2>
              <span className="text-sm text-muted-foreground">{selectedFixture.labelJp}</span>
            </div>
            <button
              onClick={() => setSelectedFixtureId(null)}
              className="p-1 rounded-md hover:bg-black/5 text-muted-foreground transition-colors"
              data-testid="button-close-detail"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
            {/* 説明 */}
            <div className="px-5 py-4 space-y-2">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">什器説明</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedFixture.description}</p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-[11px] text-muted-foreground">キャパシティ</p>
                  <p className="text-lg font-black tabular-nums">{selectedFixture.capacity} SKU</p>
                </div>
              </div>
            </div>

            {/* VMD計画 */}
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-3.5 w-3.5 text-primary" />
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider">VMD計画</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPlanBrands.length > 0 ? selectedPlanBrands.map(b => (
                  <span key={b} className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold text-white ${BRAND_COLORS[b] || "bg-slate-500"}`}>{b}</span>
                )) : (
                  <span className="text-sm text-muted-foreground">未割り当て</span>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => openEdit(selectedFixture.id)} data-testid="button-edit-brands">
                ブランド割り付けを編集
              </Button>
            </div>

            {/* RFIDスキャン */}
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <ScanLine className="h-3.5 w-3.5 text-emerald-600" />
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">RFIDスキャン結果</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedScanBrands.map(b => {
                  const status = getBrandStatus(b, selectedPlanBrands, selectedScanBrands);
                  return (
                    <span key={b} className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                      status === "correct"
                        ? `text-white ${BRAND_COLORS[b] || "bg-slate-500"}`
                        : "text-amber-900 bg-amber-200 border border-amber-400"
                    }`} data-testid={`scan-brand-${b}`}>
                      {b}
                      {status === "extra" && <span className="ml-1 text-[9px]">過剰</span>}
                    </span>
                  );
                })}
                {missingBrands.map(b => (
                  <span key={`miss-${b}`} className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-300 line-through" data-testid={`missing-brand-${b}`}>
                    {b}
                    <span className="ml-1 text-[9px] no-underline">欠品</span>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-600 font-semibold">正常 {correctCount}</span>
                {extraBrands.length > 0 && <span className="text-amber-600 font-semibold">過剰 {extraBrands.length}</span>}
                {missingBrands.length > 0 && <span className="text-slate-500 font-semibold">欠品 {missingBrands.length}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixtures list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">什器一覧</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {FIXTURES.map(fixture => {
            const isSelected = selectedFixtureId === fixture.id;
            const planBrands = assignments[fixture.id] ?? [];
            const scanBrands = RFID_SCAN_RESULTS[fixture.id] ?? [];
            const hasExtra = scanBrands.some(b => !planBrands.includes(b));
            const hasMissing = planBrands.some(b => !scanBrands.includes(b));
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
                  {planBrands.slice(0, 2).map(b => (
                    <span key={b} className={`text-[10px] font-bold text-white rounded px-1.5 py-0.5 ${BRAND_COLORS[b] || "bg-slate-400"}`}>{b}</span>
                  ))}
                  {planBrands.length === 0 && (
                    <span className="text-[10px] text-muted-foreground/50 italic">未割り当て</span>
                  )}
                </div>
                {(hasExtra || hasMissing) && (
                  <div className="mt-1.5 flex gap-1">
                    {hasExtra && <span className="text-[9px] font-semibold text-amber-700 bg-amber-100 rounded px-1">過剰</span>}
                    {hasMissing && <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 rounded px-1">欠品</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

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
                    {selected && <Check className="absolute top-1 right-1 h-3.5 w-3.5" />}
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
