import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight, ScanLine, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOCK_STORES = [
  { id: "1", name: "渋谷店",   area: "関東A", sv: "梅津直貴", scanned: true,  compliance: 82, overflow: 12 },
  { id: "2", name: "新宿店",   area: "関東A", sv: "梅津直貴", scanned: true,  compliance: 65, overflow: 35 },
  { id: "3", name: "池袋店",   area: "関東A", sv: "慶田盛音夢", scanned: false, compliance: null, overflow: null },
  { id: "4", name: "横浜店",   area: "関東A", sv: "市村翔太",  scanned: true,  compliance: 91, overflow: 8  },
  { id: "5", name: "川崎店",   area: "関東A", sv: "市村翔太",  scanned: false, compliance: null, overflow: null },
  { id: "6", name: "大宮店",   area: "関東B", sv: "慶田盛音夢", scanned: true,  compliance: 73, overflow: 22 },
  { id: "7", name: "千葉店",   area: "関東B", sv: "大野翔悟",  scanned: false, compliance: null, overflow: null },
  { id: "8", name: "立川店",   area: "関東B", sv: "大野翔悟",  scanned: true,  compliance: 88, overflow: 15 },
  { id: "9", name: "北千住店", area: "関東B", sv: "大野翔悟",  scanned: true,  compliance: 76, overflow: 19 },
  { id: "10", name: "梅田店",  area: "西日本A", sv: "那須未雪", scanned: true,  compliance: 84, overflow: 11 },
  { id: "11", name: "難波店",  area: "西日本A", sv: "那須未雪", scanned: false, compliance: null, overflow: null },
  { id: "12", name: "神戸店",  area: "西日本A", sv: "石橋萌花", scanned: true,  compliance: 79, overflow: 24 },
];

const ALL_AREAS = Array.from(new Set(MOCK_STORES.map(s => s.area))).sort();
const ALL_SVS   = Array.from(new Set(MOCK_STORES.map(s => s.sv))).sort();

export default function StoreList() {
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [svFilter,   setSvFilter]   = useState<string>("all");

  const filtered = useMemo(() => {
    return MOCK_STORES.filter(s => {
      if (areaFilter !== "all" && s.area !== areaFilter) return false;
      if (svFilter   !== "all" && s.sv   !== svFilter)   return false;
      return true;
    });
  }, [areaFilter, svFilter]);

  const scannedCount = filtered.filter(s => s.scanned).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">店舗ダッシュボード</h1>
        <p className="mt-2 text-muted-foreground">
          各店舗の棚割実行状況を確認します。店舗をクリックすると詳細ページへ移動します。
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">エリア</span>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="h-8 w-36 text-xs" data-testid="filter-area">
              <SelectValue placeholder="全エリア" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全エリア</SelectItem>
              {ALL_AREAS.map(a => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SV</span>
          <Select value={svFilter} onValueChange={setSvFilter}>
            <SelectTrigger className="h-8 w-36 text-xs" data-testid="filter-sv">
              <SelectValue placeholder="全SV" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全SV</SelectItem>
              {ALL_SVS.map(sv => (
                <SelectItem key={sv} value={sv}>{sv}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> 店舗
          <span className="mx-1">|</span>
          スキャン済み <span className="font-semibold text-emerald-600">{scannedCount}</span>
          <span className="mx-1">/</span>
          <span>{filtered.length}</span>
        </div>
      </div>

      <div className="grid gap-2.5">
        {filtered.map((store) => (
          <Link key={store.id} href={`/store/${store.id}/summary`} data-testid={`store-card-${store.id}`}>
            <Card className="border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                      <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{store.name}</span>
                        <span className="text-xs text-muted-foreground">{store.area}</span>
                        <span className="text-xs text-muted-foreground/60">SV: {store.sv}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {store.scanned ? (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-emerald-100 text-emerald-700 border-none font-bold gap-1">
                            <ScanLine className="h-2.5 w-2.5" /> スキャン済み
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-amber-100 text-amber-700 border-none font-bold gap-1">
                            <ScanLine className="h-2.5 w-2.5" /> 未スキャン
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {store.scanned && store.compliance !== null ? (
                      <>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground font-medium">棚割遵守率</div>
                          <div className={`font-black text-lg ${store.compliance >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                            {store.compliance}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground font-medium">オーバーフロー率</div>
                          <div className={`font-black text-lg ${store.overflow! > 20 ? "text-orange-600" : "text-blue-600"}`}>
                            {store.overflow}%
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">データ未取得</div>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">
            条件に一致する店舗がありません。
          </div>
        )}
      </div>
    </div>
  );
}
