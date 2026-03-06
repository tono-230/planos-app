import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, CheckCircle2, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FIXTURES = [
  "入口テーブル",
  "中央島什器A",
  "中央島什器B",
  "壁面A",
  "壁面B",
  "レジ横",
  "エンド什器A",
  "エンド什器B",
  "小物ラック"
];

const BLOCKS = [
  "AIR", "SUN", "GB", "JD", "ES", "KM", "NICHE", "MOVE", "JUNNI", "HP"
];

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
};

export default function StoreLayout() {
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFixtureIdx, setActiveFixtureIdx] = useState<number | null>(null);

  const handleAssign = (block: string) => {
    if (activeFixtureIdx === null) return;
    setAssignments(prev => ({ ...prev, [activeFixtureIdx]: block }));
    setIsDialogOpen(false);
  };

  const handleClear = () => {
    if (activeFixtureIdx === null) return;
    setAssignments(prev => {
      const next = { ...prev };
      delete next[activeFixtureIdx];
      return next;
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">店舗レイアウト設定</h1>
        <p className="mt-2 text-muted-foreground">実際の什器に本部のマーチャンダイジングブロックを紐付けます。</p>
      </div>

      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b border-border/40 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            什器配置グリッド (3x3)
          </CardTitle>
          <CardDescription>各什器をクリックしてブロックを選択してください</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FIXTURES.map((fixture, idx) => {
              const assignedBlock = assignments[idx];
              const isAssigned = !!assignedBlock;

              return (
                <Dialog key={idx} open={isDialogOpen && activeFixtureIdx === idx} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (open) setActiveFixtureIdx(idx);
                }}>
                  <DialogTrigger asChild>
                    <button
                      className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left h-32 ${
                        isAssigned 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-dashed border-border hover:border-primary/50 hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full mb-2">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{fixture}</span>
                        {isAssigned ? (
                          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> 割り当て済み
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                            <Circle className="h-3 w-3 mr-1" /> 未設定
                          </Badge>
                        )}
                      </div>
                      
                      {isAssigned && (
                        <div className={`mt-auto px-3 py-1.5 rounded-md ${BRAND_COLORS[assignedBlock]} text-white text-lg font-black tracking-tighter w-full text-center`}>
                          {assignedBlock}
                        </div>
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{fixture} に割り当てるブロック</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-4">
                      {BLOCKS.map((block) => (
                        <Button
                          key={block}
                          variant="outline"
                          className={`h-16 flex flex-col items-center justify-center relative overflow-hidden group ${BRAND_COLORS[block] || 'bg-primary'} text-white border-none hover:opacity-90`}
                          onClick={() => handleAssign(block)}
                        >
                          <span className="text-lg font-black tracking-tighter">{block}</span>
                        </Button>
                      ))}
                    </div>
                    {isAssigned && (
                      <Button
                        variant="destructive"
                        className="w-full mt-2"
                        onClick={handleClear}
                      >
                        割り当てを解除
                      </Button>
                    )}
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <p className="text-sm text-muted-foreground italic">
          ※ この設定は店舗ごとの什器構成を定義するためのものです（モックUI）。
        </p>
      </div>
    </div>
  );
}
