import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X, Building2 } from "lucide-react";
import { BASE_STORES as STORES, type StoreBase as Store } from "@/data/stores";

type SortDirection = "asc" | "desc" | null;

function getCapacityColor(cap: number) {
  if (cap >= 1500) return "text-emerald-600 font-bold";
  if (cap >= 1000) return "text-blue-600 font-bold";
  if (cap >= 700) return "text-amber-600 font-bold";
  return "text-rose-600 font-bold";
}

function getLeagueBadge(league: string) {
  const colors: Record<string, string> = {
    J1: "bg-yellow-100 text-yellow-800 border-yellow-200",
    J2: "bg-blue-100 text-blue-800 border-blue-200",
    J3: "bg-green-100 text-green-800 border-green-200",
    J4: "bg-purple-100 text-purple-800 border-purple-200",
    J5: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colors[league] || "bg-gray-100 text-gray-700 border-gray-200";
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between py-3 border-b border-border/40 last:border-0">
    <span className="text-sm font-medium text-muted-foreground w-32 shrink-0">{label}</span>
    <span className="text-sm font-semibold text-foreground text-right flex-1">{value || "—"}</span>
  </div>
);

export default function SVCapacity() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [svFilter, setSvFilter] = useState("all");
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [selected, setSelected] = useState<Store | null>(null);

  const areas = useMemo(() => {
    const set = new Set(STORES.map(s => s.area).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const svs = useMemo(() => {
    const set = new Set(STORES.map(s => s.sv).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = STORES.filter(s => {
      const matchSearch = !search || s.store_name.toLowerCase().includes(search.toLowerCase()) || String(s.store_code).includes(search);
      const matchArea = areaFilter === "all" || s.area === areaFilter;
      const matchSv = svFilter === "all" || s.sv === svFilter;
      return matchSearch && matchArea && matchSv;
    });

    if (sortDir === "asc") result = [...result].sort((a, b) => a.max_capacity - b.max_capacity);
    else if (sortDir === "desc") result = [...result].sort((a, b) => b.max_capacity - a.max_capacity);

    return result;
  }, [search, areaFilter, svFilter, sortDir]);

  const toggleSort = () => {
    setSortDir(prev => prev === "desc" ? "asc" : prev === "asc" ? null : "desc");
  };

  const clearFilters = () => {
    setSearch("");
    setAreaFilter("all");
    setSvFilter("all");
    setSortDir(null);
  };

  const hasFilters = search || areaFilter !== "all" || svFilter !== "all" || sortDir;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">店舗キャパシティ管理</h1>
        <p className="mt-2 text-muted-foreground">全店舗のMax Capacityをエリア・SV別に確認・管理します。</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/20 rounded-xl border border-border/40">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="店舗名で検索..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-background h-9"
            data-testid="input-search"
          />
        </div>

        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-40 h-9 bg-background" data-testid="select-area">
            <SelectValue placeholder="エリア" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全エリア</SelectItem>
            {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={svFilter} onValueChange={setSvFilter}>
          <SelectTrigger className="w-40 h-9 bg-background" data-testid="select-sv">
            <SelectValue placeholder="SV" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全SV</SelectItem>
            {svs.map(sv => <SelectItem key={sv} value={sv}>{sv}</SelectItem>)}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-muted-foreground hover:text-foreground gap-1">
            <X className="h-3.5 w-3.5" /> クリア
          </Button>
        )}

        <span className="text-sm text-muted-foreground ml-auto font-medium">
          {filtered.length} / {STORES.length} 店舗
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="font-bold text-foreground w-24">店舗コード</TableHead>
              <TableHead className="font-bold text-foreground">店舗名</TableHead>
              <TableHead className="font-bold text-foreground w-28">エリア</TableHead>
              <TableHead className="font-bold text-foreground w-28">SV</TableHead>
              <TableHead className="font-bold text-foreground w-36">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  data-testid="button-sort-capacity"
                >
                  Max Capacity
                  {sortDir === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5 text-primary" />
                  ) : sortDir === "desc" ? (
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-border" />
                  <p className="font-medium">該当する店舗が見つかりません</p>
                  <p className="text-sm mt-1">検索条件を変更してください</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(store => (
                <TableRow
                  key={store.store_code}
                  className="cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setSelected(store)}
                  data-testid={`row-store-${store.store_code}`}
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">{store.store_code}</TableCell>
                  <TableCell className="font-medium">{store.store_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-medium">{store.area}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{store.sv}</TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm ${getCapacityColor(store.max_capacity)}`}>
                      {store.max_capacity.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Panel */}
      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent className="w-[400px] sm:w-[480px]">
          <SheetHeader className="pb-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg">{selected?.store_name}</SheetTitle>
                <SheetDescription className="text-xs font-mono">
                  店舗コード: {selected?.store_code}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selected && (
            <div className="py-4 space-y-0">
              <div className="mb-4 p-3 rounded-lg bg-secondary/30 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">Max Capacity</span>
                <span className={`text-2xl font-black font-mono ${getCapacityColor(selected.max_capacity)}`}>
                  {selected.max_capacity.toLocaleString()}
                </span>
              </div>

              {selected.league && (
                <div className="mb-4">
                  <Badge className={`border text-xs font-bold px-3 py-1 ${getLeagueBadge(selected.league)}`}>
                    {selected.league}
                  </Badge>
                </div>
              )}

              <DetailRow label="店舗名" value={selected.store_name} />
              <DetailRow label="都道府県" value={selected.prefecture} />
              <DetailRow label="エリア" value={selected.area} />
              <DetailRow label="SV" value={selected.sv} />
              <DetailRow label="AM" value={selected.am} />
              <DetailRow label="店長" value={selected.store_manager} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
