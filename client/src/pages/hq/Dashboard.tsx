import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, CheckCircle2, AlertCircle, Store, AlertTriangle, ArrowRight, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_STORES } from "@/data/stores";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [svFilter, setSvFilter] = useState("all");

  const allCountries = useMemo(() => {
    const set = new Set(DASHBOARD_STORES.map(s => s.country).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const availableAreas = useMemo(() => {
    const base = countryFilter === "all"
      ? DASHBOARD_STORES
      : DASHBOARD_STORES.filter(s => s.country === countryFilter);
    const set = new Set(base.map(s => s.area).filter(Boolean));
    return Array.from(set).sort();
  }, [countryFilter]);

  const availableSVs = useMemo(() => {
    let base = countryFilter === "all"
      ? DASHBOARD_STORES
      : DASHBOARD_STORES.filter(s => s.country === countryFilter);
    if (areaFilter !== "all") base = base.filter(s => s.area === areaFilter);
    const set = new Set(base.map(s => s.sv).filter(Boolean));
    return Array.from(set).sort();
  }, [countryFilter, areaFilter]);

  const filteredStores = useMemo(() => {
    return DASHBOARD_STORES.filter(s => {
      const matchSearch = !searchQuery || s.store_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCountry = countryFilter === "all" || s.country === countryFilter;
      const matchArea = areaFilter === "all" || s.area === areaFilter;
      const matchSV = svFilter === "all" || s.sv === svFilter;
      return matchSearch && matchCountry && matchArea && matchSV;
    });
  }, [searchQuery, countryFilter, areaFilter, svFilter]);

  const kpi = useMemo(() => {
    const total = filteredStores.length;
    if (total === 0) return { scanned: 0, total: 0, complianceRate: 0, overflowRate: 0, complianceSku: 0, overflowSku: 0 };
    const scanned = filteredStores.filter(s => s.scanned);
    const scannedCount = scanned.length;
    const avgCompliance = scannedCount > 0
      ? Math.round(scanned.reduce((sum, s) => sum + s.complianceRate, 0) / scannedCount)
      : 0;
    const avgOverflow = scannedCount > 0
      ? Math.round(scanned.reduce((sum, s) => sum + s.overflowRate, 0) / scannedCount)
      : 0;
    const avgCapacity = scannedCount > 0
      ? Math.round(scanned.reduce((sum, s) => sum + s.max_capacity, 0) / scannedCount)
      : 0;
    const complianceSku = Math.round(avgCapacity * avgCompliance / 100);
    const overflowSku = Math.round(avgCapacity * avgOverflow / 100);
    return { scanned: scannedCount, total, complianceRate: avgCompliance, overflowRate: avgOverflow, complianceSku, overflowSku };
  }, [filteredStores]);

  const handleCountryChange = (val: string) => {
    setCountryFilter(val);
    setAreaFilter("all");
    setSvFilter("all");
  };

  const handleAreaChange = (val: string) => {
    setAreaFilter(val);
    setSvFilter("all");
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">ダッシュボード</h1>
      </div>

      {/* Global Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-secondary/20 rounded-xl border border-border/40">
        <div className="relative flex-1 min-w-44">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="店舗名で検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-background h-9 text-sm"
            data-testid="input-store-search"
          />
        </div>

        <Select value={countryFilter} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-32 h-9 bg-background text-sm" data-testid="select-country">
            <SelectValue placeholder="全国" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全国</SelectItem>
            {allCountries.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={areaFilter} onValueChange={handleAreaChange}>
          <SelectTrigger className="w-36 h-9 bg-background text-sm" data-testid="select-area">
            <SelectValue placeholder="全エリア" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全エリア</SelectItem>
            {availableAreas.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={svFilter} onValueChange={setSvFilter}>
          <SelectTrigger className="w-36 h-9 bg-background text-sm" data-testid="select-sv">
            <SelectValue placeholder="全SV" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全SV</SelectItem>
            {availableSVs.map(sv => (
              <SelectItem key={sv} value={sv}>{sv}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm font-semibold text-foreground tabular-nums whitespace-nowrap" data-testid="text-store-count">
          <span className="text-primary">{filteredStores.length.toLocaleString()}</span>
          <span className="text-muted-foreground"> / {DASHBOARD_STORES.length.toLocaleString()} 店舗</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. スキャン店舗数 */}
        <Card
          className="border-none shadow-md shadow-black/5 overflow-hidden relative group cursor-pointer hover:bg-blue-500/[0.02] transition-colors"
          onClick={() => setLocation("/hq/stores")}
          data-testid="kpi-scanned-stores"
        >
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">スキャン店舗数</CardTitle>
            <Store className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black leading-none tabular-nums text-blue-600" data-testid="value-scanned-stores">
                {kpi.scanned}
              </span>
              <span className="text-xl font-semibold text-blue-400 leading-none">
                / {kpi.total}
              </span>
            </div>
            {kpi.scanned < kpi.total && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                未完了
              </Badge>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium">
              スキャン済み店舗 / 対象店舗数
            </p>
          </CardContent>
        </Card>

        {/* 2. 棚割遵守率 */}
        <Card
          className="border-none shadow-md shadow-black/5 cursor-pointer hover:bg-emerald-500/[0.02] transition-colors"
          onClick={() => setLocation("/hq/stores")}
          data-testid="kpi-compliance"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">棚割遵守率</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-4xl font-black leading-none tabular-nums text-emerald-600" data-testid="value-compliance-rate">
                {kpi.complianceRate}
              </span>
              <span className="text-2xl font-bold leading-none text-emerald-500 opacity-70">%</span>
              <span className="text-sm font-semibold text-emerald-700 opacity-50 ml-0.5">
                {kpi.complianceSku.toLocaleString()} SKU
              </span>
            </div>
            {kpi.complianceRate < 80 && kpi.total > 0 && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                要改善
              </Badge>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium">
              計画通りに展開されているSKU
            </p>
          </CardContent>
        </Card>

        {/* 3. キャパ超過率 */}
        <Card
          className="border-none shadow-md shadow-black/5 cursor-pointer hover:bg-orange-500/[0.02] transition-colors"
          onClick={() => setLocation("/hq/stores")}
          data-testid="kpi-overflow"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">キャパ超過率</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-4xl font-black leading-none tabular-nums text-orange-600" data-testid="value-overflow-rate">
                {kpi.overflowRate}
              </span>
              <span className="text-2xl font-bold leading-none text-orange-500 opacity-70">%</span>
              <span className="text-sm font-semibold text-orange-700 opacity-50 ml-0.5">
                {kpi.overflowSku.toLocaleString()} SKU
              </span>
            </div>
            {kpi.overflowRate > 20 && kpi.total > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                キャパ超過
              </Badge>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium">
              売場キャパを超えているSKU
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">次のアクション</h2>
        {kpi.total === 0 ? (
          <p className="text-sm text-muted-foreground py-4">フィルター条件に一致する店舗がありません。</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {kpi.scanned < kpi.total && (
              <Card className="border-border/50 shadow-sm" data-testid="action-scan-pending">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Store className="h-5 w-5" />
                    <CardTitle className="text-base">店舗スキャン待ち</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-blue-600">{kpi.total - kpi.scanned}</span> 店舗が未スキャンです。RFIDスキャンデータを送信してください。
                  </p>
                  <Button asChild size="sm" variant="outline" className="w-full justify-between">
                    <Link href="/hq/stores" className="flex items-center justify-between w-full">
                      店舗一覧へ <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {kpi.overflowRate > 20 && (
              <Card className="border-border/50 shadow-sm" data-testid="action-overflow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle className="text-base">売場キャパ超過</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    平均キャパ超過率 <span className="font-bold text-orange-600">{kpi.overflowRate}%</span>。SKU削減または売場再配置を検討してください。
                  </p>
                  <Button asChild size="sm" variant="outline" className="w-full justify-between">
                    <Link href="/hq/stores" className="flex items-center justify-between w-full">
                      店舗一覧へ <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {kpi.complianceRate < 100 && kpi.scanned > 0 && (
              <Card className="border-border/50 shadow-sm" data-testid="action-compliance">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <CardTitle className="text-base">棚割差異確認</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    遵守率 <span className="font-bold text-destructive">{kpi.complianceRate}%</span>。計画と異なる配置が検出されています。
                  </p>
                  <Button asChild size="sm" variant="outline" className="w-full justify-between">
                    <Link href="/hq/stores" className="flex items-center justify-between w-full">
                      店舗一覧へ <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
