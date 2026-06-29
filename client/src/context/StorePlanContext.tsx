import { createContext, useContext, useState, ReactNode } from "react";

export type FixtureShapeKey = "wall-h" | "wall-v" | "island";

export const FIXTURE_SHAPE_CONFIG: Record<FixtureShapeKey, { innerCols: number; innerRows: number }> = {
  "wall-h": { innerCols: 3, innerRows: 1 },
  "wall-v": { innerCols: 1, innerRows: 3 },
  "island": { innerCols: 2, innerRows: 2 },
};

export interface Fixture {
  id: string;
  label: string;
  labelJp: string;
  type: "wall" | "island" | "counter";
  zone: "HOT" | "MAIN" | "SALE";
  description: string;
  capacity: number;
  shapeKey: FixtureShapeKey;
  style: React.CSSProperties;
  positions: string[];
}

export const HQ_GROUPS = ["Hot spot", "Sub hot", "Main", "定番", "Feature", "Seasonal", "Sale"] as const;
export const HQ_VARIANTS = ["A", "B"] as const;
export type HqGroup = typeof HQ_GROUPS[number];

export const HQ_THIS_WEEK: Record<string, string> = {
  "Hot spot A": "AIR",   "Hot spot B": "SUN",
  "Sub hot A":  "GB",    "Sub hot B":  "",
  "Main A":     "JD",    "Main B":     "ES",
  "定番 A":     "KM",    "定番 B":     "NICHE",
  "Feature A":  "MOVE",  "Feature B":  "JUNNI",
  "Seasonal A": "",      "Seasonal B": "",
  "Sale A":     "雑貨",  "Sale B":     "",
};

export const HQ_LAST_WEEK: Record<string, string> = {
  "Hot spot A": "SUN",   "Hot spot B": "AIR",
  "Sub hot A":  "GB",    "Sub hot B":  "KM",
  "Main A":     "JD",    "Main B":     "ES",
  "定番 A":     "NICHE", "定番 B":     "",
  "Feature A":  "MOVE",  "Feature B":  "",
  "Seasonal A": "",      "Seasonal B": "",
  "Sale A":     "雑貨",  "Sale B":     "JUNNI",
};

export const FIXTURES: Fixture[] = [
  {
    id: "wall-top",
    label: "Wall Top 1",
    labelJp: "上部壁面什器 1",
    type: "wall",
    zone: "HOT",
    shapeKey: "wall-h",
    description: "上部壁面左の主要展示エリア。最も視認性が高く、ホットブランドを配置します。",
    capacity: 48,
    // canvas 14:10 → pixel ratio = (width% / height%) × 1.4 = (29/12) × 1.4 ≈ 3.4:1
    style: { top: "3%", left: "31%", width: "29%", height: "12%" },
    positions: ["Hot spot A", "Hot spot B"],
  },
  {
    id: "wall-top-2",
    label: "Wall Top 2",
    labelJp: "上部壁面什器 2",
    type: "wall",
    zone: "HOT",
    shapeKey: "wall-h",
    description: "上部壁面右の展示エリア。サブホットブランドを配置します。",
    capacity: 40,
    // pixel ratio = (27/12) × 1.4 ≈ 3.15:1
    style: { top: "3%", left: "62%", width: "27%", height: "12%" },
    positions: ["Sub hot A", "Sub hot B"],
  },
  {
    id: "wall-right",
    label: "Wall Right",
    labelJp: "右側壁面什器",
    type: "wall",
    zone: "HOT",
    shapeKey: "wall-v",
    description: "右側壁面。サブホットブランドのフォーカス展示エリア。",
    capacity: 32,
    // pixel ratio = (10/50) × 1.4 ≈ 0.28 → 1:3.5
    style: { top: "17%", right: "1%", width: "10%", height: "50%" },
    positions: ["定番 A", "定番 B"],
  },
  {
    id: "island-1",
    label: "Island 1",
    labelJp: "島什器 1",
    type: "island",
    zone: "MAIN",
    shapeKey: "island",
    description: "中央左上島什器。メインブランドの展示エリア。来店客が触れやすいゾーン。",
    capacity: 24,
    // pixel ratio = (29/24) × 1.4 ≈ 1.69:1
    style: { top: "17%", left: "17%", width: "29%", height: "24%" },
    positions: ["Main A", "Main B"],
  },
  {
    id: "island-2",
    label: "Island 2",
    labelJp: "島什器 2",
    type: "island",
    zone: "MAIN",
    shapeKey: "island",
    description: "中央右上島什器。フィーチャーブランドおよびセレクト展示エリア。",
    capacity: 24,
    style: { top: "17%", left: "49%", width: "29%", height: "24%" },
    positions: ["Feature A", "Feature B"],
  },
  {
    id: "bottom-1",
    label: "Island 3",
    labelJp: "島什器 3",
    type: "island",
    zone: "SALE",
    shapeKey: "island",
    description: "中央左下島什器。セール・定番ブランドの展示エリア。",
    capacity: 20,
    style: { top: "45%", left: "17%", width: "29%", height: "24%" },
    positions: ["Seasonal A", "Seasonal B"],
  },
  {
    id: "bottom-2",
    label: "Island 4",
    labelJp: "島什器 4",
    type: "island",
    zone: "SALE",
    shapeKey: "island",
    description: "中央右下島什器。シーズナル・セールブランドの展示エリア。",
    capacity: 20,
    style: { top: "45%", left: "49%", width: "29%", height: "24%" },
    positions: ["Sale A", "Sale B"],
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
  "wall-top":   ["AIR", "SUN"],
  "wall-top-2": ["GB"],
  "wall-right": ["KM"],
  "island-1":   ["JD", "ES"],
  "island-2":   ["NICHE", "MOVE"],
  "bottom-1":   ["JUNNI", "HP"],
  "bottom-2":   ["雑貨"],
};

export const LAST_WEEK: Record<string, string[]> = {
  "wall-top":   ["SUN", "AIR"],
  "wall-top-2": ["KM"],
  "wall-right": ["GB", "KM"],
  "island-1":   ["JD", "ES"],
  "island-2":   ["NICHE"],
  "bottom-1":   ["MOVE"],
  "bottom-2":   ["雑貨", "JUNNI"],
};

export const ZONE_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  HOT:  { label: "HOT",  bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200" },
  MAIN: { label: "MAIN", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  SALE: { label: "SALE", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
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
