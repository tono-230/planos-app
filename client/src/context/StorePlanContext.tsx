import { createContext, useContext, useState, ReactNode } from "react";

export interface Fixture {
  id: string;
  label: string;
  labelJp: string;
  type: "wall" | "island" | "counter";
  description: string;
  capacity: number;
  style: React.CSSProperties;
}

export const FIXTURES: Fixture[] = [
  {
    id: "wall-a",
    label: "Wall A",
    labelJp: "バック壁面",
    type: "wall",
    description: "後方メイン壁面。ブランドコアアイテムを展示する最も視認性の高いエリア。",
    capacity: 60,
    style: { top: "5%", left: "5%", width: "90%", height: "13%" },
  },
  {
    id: "wall-b",
    label: "Wall B",
    labelJp: "左壁面",
    type: "wall",
    description: "左側壁面。サブブランドおよびサングラスコレクションを展示。",
    capacity: 32,
    style: { top: "20%", left: "5%", width: "9%", height: "58%" },
  },
  {
    id: "wall-c",
    label: "Wall C",
    labelJp: "右壁面",
    type: "wall",
    description: "右側壁面。プレミアムおよびニッチブランドのフォーカス展示エリア。",
    capacity: 28,
    style: { top: "20%", right: "5%", width: "9%", height: "58%" },
  },
  {
    id: "island-1",
    label: "Island 1",
    labelJp: "センター島什器 1",
    type: "island",
    description: "中央前方島什器。新作・話題アイテムのフィーチャー展示。来店客が最初に触れるゾーン。",
    capacity: 24,
    style: { top: "22%", left: "22%", width: "22%", height: "26%" },
  },
  {
    id: "island-2",
    label: "Island 2",
    labelJp: "センター島什器 2",
    type: "island",
    description: "中央後方島什器。セレクトコレクションおよびスタッフPickアイテムを展示。",
    capacity: 20,
    style: { top: "54%", left: "22%", width: "22%", height: "24%" },
  },
  {
    id: "end-cap",
    label: "End Cap",
    labelJp: "エンド什器",
    type: "island",
    description: "中央右エンドキャップ。プロモーション品・期間限定展示に活用するフレキシブルゾーン。",
    capacity: 16,
    style: { top: "26%", left: "53%", width: "15%", height: "44%" },
  },
  {
    id: "cashier",
    label: "Cashier",
    labelJp: "レジカウンター",
    type: "counter",
    description: "会計・サービスカウンター。レンズオーダー受付、小物販売、顧客対応を行うエリア。",
    capacity: 10,
    style: { top: "80%", left: "5%", width: "22%", height: "13%" },
  },
];

export const BRAND_COLORS: Record<string, string> = {
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
  "雑貨": "bg-teal-500",
};

const THIS_WEEK_INITIAL: Record<string, string[]> = {
  "wall-a": ["AIR", "SUN", "GB"],
  "wall-b": ["JD", "ES"],
  "wall-c": ["NICHE", "KM"],
  "island-1": ["MOVE", "JUNNI"],
  "island-2": ["HP", "The ONE"],
  "end-cap": ["BinB", "AIR"],
  "cashier": ["雑貨"],
};

export const LAST_WEEK: Record<string, string[]> = {
  "wall-a": ["AIR", "SUN"],
  "wall-b": ["JD", "ES", "KM"],
  "wall-c": ["NICHE", "GB"],
  "island-1": ["MOVE"],
  "island-2": ["HP", "JUNNI"],
  "end-cap": ["AIR PLA", "AIR"],
  "cashier": ["雑貨"],
};

interface StorePlanContextType {
  assignments: Record<string, string[]>;
  lastWeek: Record<string, string[]>;
  updateAssignment: (fixtureId: string, brands: string[]) => void;
  selectedFixtureId: string | null;
  setSelectedFixtureId: (id: string | null) => void;
}

const StorePlanContext = createContext<StorePlanContextType | null>(null);

export function StorePlanProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Record<string, string[]>>(THIS_WEEK_INITIAL);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(null);

  const updateAssignment = (fixtureId: string, brands: string[]) => {
    setAssignments(prev => ({ ...prev, [fixtureId]: brands }));
  };

  return (
    <StorePlanContext.Provider value={{
      assignments,
      lastWeek: LAST_WEEK,
      updateAssignment,
      selectedFixtureId,
      setSelectedFixtureId,
    }}>
      {children}
    </StorePlanContext.Provider>
  );
}

export function useStorePlan() {
  const ctx = useContext(StorePlanContext);
  if (!ctx) throw new Error("useStorePlan must be used within StorePlanProvider");
  return ctx;
}
