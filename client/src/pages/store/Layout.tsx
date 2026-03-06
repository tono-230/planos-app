import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "wouter";
import { MapPin, Tag, LayoutGrid, X, Maximize2 } from "lucide-react";

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

interface Fixture {
  id: string;
  label: string;
  labelJp: string;
  type: "wall" | "island" | "counter" | "entrance";
  description: string;
  brands: string[];
  skuCount: number;
  capacity: number;
  style: React.CSSProperties;
  labelPos?: "bottom" | "top" | "left" | "right" | "center";
}

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
  "雑貨": "bg-teal-500",
};

const FIXTURES: Fixture[] = [
  {
    id: "wall-a",
    label: "Wall A",
    labelJp: "バック壁面",
    type: "wall",
    description: "後方メイン壁面。ブランドコアアイテムを展示する最も視認性の高いエリア。",
    brands: ["AIR", "SUN", "GB"],
    skuCount: 48,
    capacity: 60,
    style: { top: "5%", left: "5%", width: "90%", height: "13%" },
    labelPos: "center",
  },
  {
    id: "wall-b",
    label: "Wall B",
    labelJp: "左壁面",
    type: "wall",
    description: "左側壁面。サブブランドおよびサングラスコレクションを展示。",
    brands: ["JD", "ES"],
    skuCount: 24,
    capacity: 32,
    style: { top: "20%", left: "5%", width: "9%", height: "58%" },
    labelPos: "center",
  },
  {
    id: "wall-c",
    label: "Wall C",
    labelJp: "右壁面",
    type: "wall",
    description: "右側壁面。プレミアムおよびニッチブランドのフォーカス展示エリア。",
    brands: ["NICHE", "KM"],
    skuCount: 20,
    capacity: 28,
    style: { top: "20%", right: "5%", width: "9%", height: "58%" },
    labelPos: "center",
  },
  {
    id: "island-1",
    label: "Island 1",
    labelJp: "センター島什器 1",
    type: "island",
    description: "中央前方島什器。新作・話題アイテムのフィーチャー展示。来店客が最初に触れるゾーン。",
    brands: ["MOVE", "JUNNI"],
    skuCount: 18,
    capacity: 24,
    style: { top: "22%", left: "22%", width: "22%", height: "26%" },
    labelPos: "center",
  },
  {
    id: "island-2",
    label: "Island 2",
    labelJp: "センター島什器 2",
    type: "island",
    description: "中央後方島什器。セレクトコレクションおよびスタッフPickアイテムを展示。",
    brands: ["HP", "The ONE"],
    skuCount: 16,
    capacity: 20,
    style: { top: "54%", left: "22%", width: "22%", height: "24%" },
    labelPos: "center",
  },
  {
    id: "end-cap",
    label: "End Cap",
    labelJp: "エンド什器",
    type: "island",
    description: "中央右エンドキャップ。プロモーション品・期間限定展示に活用するフレキシブルゾーン。",
    brands: ["BinB", "AIR"],
    skuCount: 12,
    capacity: 16,
    style: { top: "26%", left: "53%", width: "15%", height: "44%" },
    labelPos: "center",
  },
  {
    id: "cashier",
    label: "Cashier",
    labelJp: "レジカウンター",
    type: "counter",
    description: "会計・サービスカウンター。レンズオーダー受付、小物販売、顧客対応を行うエリア。",
    brands: ["雑貨"],
    skuCount: 8,
    capacity: 10,
    style: { top: "80%", left: "5%", width: "22%", height: "13%" },
    labelPos: "center",
  },
];

const TYPE_STYLES: Record<string, string> = {
  wall: "bg-slate-100 border-slate-300 hover:border-slate-500",
  island: "bg-amber-50 border-amber-300 hover:border-amber-500",
  counter: "bg-stone-100 border-stone-400 hover:border-stone-600",
  entrance: "bg-transparent border-dashed border-border",
};

const TYPE_STYLES_SELECTED: Record<string, string> = {
  wall: "bg-slate-200 border-slate-600 ring-2 ring-slate-400/50",
  island: "bg-amber-100 border-amber-500 ring-2 ring-amber-400/50",
  counter: "bg-stone-200 border-stone-600 ring-2 ring-stone-400/50",
  entrance: "",
};

function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = Math.round((used / total) * 100);
  const color = pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>使用 {used} / {total} SKU</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function StoreLayout() {
  const params = useParams<{ id: string }>();
  const storeId = params.id || "1";
  const storeName = STORE_NAMES[storeId] || "店舗";
  const [selected, setSelected] = useState<string | null>(null);

  const selectedFixture = selected ? FIXTURES.find(f => f.id === selected) ?? null : null;

  const handleFixtureClick = (id: string) => {
    setSelected(prev => prev === id ? null : id);
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
        <p className="mt-2 text-muted-foreground">什器配置とブランド割り付けの確認。什器をクリックして詳細を表示します。</p>
      </div>

      <div className="flex gap-5 items-start">
        {/* Floor Plan */}
        <div className="flex-1 min-w-0">
          <div
            className="relative w-full rounded-2xl border-2 border-slate-200 bg-[#f7f7f5] overflow-hidden shadow-inner"
            style={{ aspectRatio: "4 / 3" }}
            data-testid="floor-plan"
          >
            {/* Floor grid texture */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, #000 39px, #000 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #000 39px, #000 40px)"
            }} />

            {/* Entrance gap label at bottom center */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5" style={{ bottom: "1%" }}>
              <div className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Entrance</div>
              <div className="w-20 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Store outer wall border accents */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-300 rounded-t-2xl" />
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-slate-300 rounded-l-2xl" />
            <div className="absolute top-0 right-0 bottom-0 w-[3px] bg-slate-300 rounded-r-2xl" />
            {/* Front wall — two sides with gap in middle */}
            <div className="absolute bottom-0 left-0 w-[30%] h-[3px] bg-slate-300 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-[30%] h-[3px] bg-slate-300 rounded-br-2xl" />

            {/* Fixtures */}
            {FIXTURES.map(fixture => {
              const isSelected = selected === fixture.id;
              const baseStyle = TYPE_STYLES[fixture.type] ?? "";
              const selStyle = TYPE_STYLES_SELECTED[fixture.type] ?? "";

              return (
                <button
                  key={fixture.id}
                  style={fixture.style}
                  className={`absolute rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected ? selStyle : baseStyle
                  }`}
                  onClick={() => handleFixtureClick(fixture.id)}
                  data-testid={`fixture-${fixture.id}`}
                >
                  <span className="text-[clamp(8px,1.2vw,13px)] font-bold text-slate-600 tracking-wide leading-tight">{fixture.label}</span>
                  {/* Brand dots */}
                  <div className="flex gap-0.5 flex-wrap justify-center px-1">
                    {fixture.brands.slice(0, 3).map(b => (
                      <span
                        key={b}
                        className={`inline-block rounded-sm text-white font-bold leading-none ${BRAND_COLORS[b] || "bg-slate-400"}`}
                        style={{ fontSize: "clamp(5px,0.8vw,9px)", padding: "1px 3px" }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}

            {/* Compass-like label */}
            <div className="absolute top-[19%] left-[50%] -translate-x-1/2 text-[10px] text-slate-300 font-semibold tracking-widest select-none pointer-events-none">
              FLOOR PLAN
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-5 px-1">
            <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">凡例</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-100 border-2 border-slate-300" />
              <span className="text-xs text-muted-foreground">壁面什器</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-50 border-2 border-amber-300" />
              <span className="text-xs text-muted-foreground">島什器</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-stone-100 border-2 border-stone-400" />
              <span className="text-xs text-muted-foreground">カウンター</span>
            </div>
          </div>
        </div>

        {/* Detail Card */}
        <div className="w-72 shrink-0">
          {selectedFixture ? (
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-200">
              {/* Header */}
              <div className={`px-5 py-4 border-b border-border/40 flex items-start justify-between ${
                selectedFixture.type === "wall" ? "bg-slate-50" :
                selectedFixture.type === "island" ? "bg-amber-50" :
                "bg-stone-50"
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {selectedFixture.type === "wall" ? "壁面什器" :
                       selectedFixture.type === "island" ? "島什器" : "カウンター"}
                    </span>
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">{selectedFixture.label}</h2>
                  <p className="text-sm text-muted-foreground">{selectedFixture.labelJp}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1 rounded-md hover:bg-black/5 text-muted-foreground transition-colors"
                  data-testid="button-close-detail"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-5">
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedFixture.description}</p>

                {/* Capacity */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Maximize2 className="h-3 w-3" /> キャパシティ
                  </span>
                  <CapacityBar used={selectedFixture.skuCount} total={selectedFixture.capacity} />
                </div>

                {/* Brands */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Tag className="h-3 w-3" /> 割り当てブランド
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFixture.brands.map(b => (
                      <span
                        key={b}
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold text-white ${BRAND_COLORS[b] || "bg-slate-500"}`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/40">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-muted-foreground font-medium">SKU数</p>
                    <p className="text-xl font-black text-foreground tabular-nums">{selectedFixture.skuCount}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-muted-foreground font-medium">ステータス</p>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold mt-0.5 ${
                        selectedFixture.skuCount > 0
                          ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                          : "border-slate-300 text-slate-500 bg-slate-50"
                      }`}
                    >
                      {selectedFixture.skuCount > 0 ? "展示中" : "空き"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-secondary/20 border-t border-border/40 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{storeName} — {selectedFixture.labelJp}</span>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-2xl border-2 border-dashed border-border/40 bg-secondary/10 flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[260px]">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FIXTURES.map(fixture => {
            const isSelected = selected === fixture.id;
            const pct = Math.round((fixture.skuCount / fixture.capacity) * 100);
            return (
              <button
                key={fixture.id}
                onClick={() => handleFixtureClick(fixture.id)}
                data-testid={`list-fixture-${fixture.id}`}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 bg-card hover:border-border hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{fixture.label}</p>
                    <p className="text-xs text-muted-foreground">{fixture.labelJp}</p>
                  </div>
                  <span className={`text-xs font-bold tabular-nums ${pct >= 90 ? "text-rose-600" : pct >= 70 ? "text-amber-600" : "text-emerald-600"}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {fixture.brands.slice(0, 2).map(b => (
                    <span key={b} className={`text-[10px] font-bold text-white rounded px-1.5 py-0.5 ${BRAND_COLORS[b] || "bg-slate-400"}`}>{b}</span>
                  ))}
                  {fixture.brands.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">+{fixture.brands.length - 2}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60 italic">
        ※ レイアウトはモックデータです。実際の什器マスターとの連携は今後実装予定。
      </p>
    </div>
  );
}
