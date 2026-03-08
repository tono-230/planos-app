import { createContext, useContext, useState, ReactNode } from "react";

export interface Fixture {
  id: string;
  label: string;
  labelJp: string;
  type: "wall" | "island" | "counter";
  zone: "HOT" | "MAIN" | "SALE";
  description: string;
  capacity: number;
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
    label: "Wall Top",
    labelJp: "上部壁面什器",
    type: "wall",
    zone: "HOT",
    description: "上部壁面の主要展示エリア。最も視認性が高く、ホットブランドを配置します。",
    capacity: 48,
    style: { top: "27%", left: "38%", width: "44%", height: "9%" },
    positions: ["Hot spot A", "Hot spot B"],
  },
  {
    id: "wall-right",
    label: "Wall Right",
    labelJp: "右側壁面什器",
    type: "wall",
    zone: "HOT",
    description: "右側壁面。サブホットブランドのフォーカス展示エリア。",
    capacity: 32,
    style: { top: "27%", right: "0%", width: "9%", height: "52%" },
    positions: ["Sub hot A", "Sub hot B"],
  },
  {
    id: "island-1",
    label: "Island 1",
    labelJp: "島什器 1",
    type: "island",
    zone: "MAIN",
    description: "中央左島什器。メインブランドの展示エリア。来店客が触れやすいゾーン。",
    capacity: 24,
    style: { top: "39%", left: "21%", width: "27%", height: "30%" },
    positions: ["Main A", "Main B"],
  },
  {
    id: "island-2",
    label: "Island 2",
    labelJp: "島什器 2",
    type: "island",
    zone: "MAIN",
    description: "中央右島什器。フィーチャーブランドおよびセレクト展示エリア。",
    capacity: 24,
    style: { top: "39%", left: "55%", width: "27%", height: "30%" },
    positions: ["定番 A", "定番 B"],
  },
  {
    id: "bottom-1",
    label: "Bottom 1",
    labelJp: "下部什器 1",
    type: "island",
    zone: "SALE",
    description: "下部左什器。セール・定番ブランドの展示エリア。",
    capacity: 20,
    style: { top: "74%", left: "17%", width: "30%", height: "13%" },
    positions: ["Feature A", "Feature B", "Seasonal A", "Seasonal B"],
  },
  {
    id: "bottom-2",
    label: "Bottom 2",
    labelJp: "下部什器 2",
    type: "island",
    zone: "SALE",
    description: "下部右什器。シーズナル・セールブランドの展示エリア。",
    capacity: 20,
    style: { top: "74%", left: "55%", width: "30%", height: "13%" },
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
  "wall-right": ["GB"],
  "island-1":   ["JD", "ES"],
  "island-2":   ["KM", "NICHE"],
  "bottom-1":   ["MOVE", "JUNNI"],
  "bottom-2":   ["雑貨"],
};

export const LAST_WEEK: Record<string, string[]> = {
  "wall-top":   ["SUN", "AIR"],
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
