import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Store, ArrowRight } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";

const MOCK_STORE_DATA: Record<string, { name: string; area: string; compliance: number; complianceSku: number; overflow: number; overflowSku: number; scanned: boolean }> = {
  "1": { name: "渋谷店", area: "東京エリア", compliance: 82, complianceSku: 820, overflow: 12, overflowSku: 148, scanned: true },
  "2": { name: "新宿店", area: "東京エリア", compliance: 65, complianceSku: 825, overflow: 35, overflowSku: 524, scanned: true },
  "3": { name: "池袋店", area: "東京エリア", compliance: 0, complianceSku: 0, overflow: 0, overflowSku: 0, scanned: false },
  "4": { name: "横浜店", area: "神奈川エリア", compliance: 91, complianceSku: 910, overflow: 8, overflowSku: 96, scanned: true },
  "5": { name: "川崎店", area: "神奈川エリア", compliance: 0, complianceSku: 0, overflow: 0, overflowSku: 0, scanned: false },
  "6": { name: "大宮店", area: "埼玉エリア", compliance: 73, complianceSku: 730, overflow: 22, overflowSku: 264, scanned: true },
  "7": { name: "千葉店", area: "千葉エリア", compliance: 0, complianceSku: 0, overflow: 0, overflowSku: 0, scanned: false },
  "8": { name: "立川店", area: "東京エリア", compliance: 88, complianceSku: 880, overflow: 15, overflowSku: 180, scanned: true },
};

export default function StoreSummary() {
  const params = useParams<{ id: string }>();
  const storeId = params.id || "1";
  const store = MOCK_STORE_DATA[storeId] || MOCK_STORE_DATA["1"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/hq/stores" className="hover:text-foreground transition-colors">店舗一覧</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{store.name}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{store.name}</h1>
        <p className="mt-1 text-muted-foreground">{store.area} · 店舗サマリー</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* スキャン状況 */}
        <Card className="border-none shadow-md shadow-black/5 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">スキャン状況</CardTitle>
            <Store className={`h-5 w-5 ${store.scanned ? 'text-emerald-500' : 'text-amber-500'}`} />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className={`text-3xl font-black font-display ${store.scanned ? 'text-emerald-600' : 'text-amber-600'}`}>
              {store.scanned ? 'スキャン済み' : '未スキャン'}
            </div>
            <p className="text-xs text-muted-foreground/70 font-medium">
              {store.scanned ? 'RFIDスキャンデータ受信済み' : 'データ未取得'}
            </p>
          </CardContent>
        </Card>

        {/* 棚割遵守率 */}
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">棚割遵守率</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            {store.scanned ? (
              <>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black font-display text-emerald-600">{store.compliance}%</div>
                  <div className="text-base font-bold text-emerald-600/80">{store.complianceSku} SKU</div>
                </div>
                {store.compliance < 80 && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                    要改善
                  </Badge>
                )}
              </>
            ) : (
              <div className="text-2xl font-black font-display text-muted-foreground">データ未取得</div>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium pt-1">
              計画通りに展開されているSKU
            </p>
          </CardContent>
        </Card>

        {/* オーバーフロー率 */}
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">オーバーフロー率</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            {store.scanned ? (
              <>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black font-display text-orange-600">{store.overflow}%</div>
                  <div className="text-base font-bold text-orange-600/80">{store.overflowSku} SKU</div>
                </div>
                {store.overflow > 20 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px] py-0 px-2 h-5 font-bold">
                    キャパ超過
                  </Badge>
                )}
              </>
            ) : (
              <div className="text-2xl font-black font-display text-muted-foreground">データ未取得</div>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium pt-1">
              売場キャパを超えているSKU
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">クイックアクセス</CardTitle>
            <CardDescription>この店舗の詳細ページへ移動します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link href={`/store/${storeId}/analysis`} className="flex items-center justify-between w-full">
                実行分析を確認 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link href={`/store/${storeId}/capacity`} className="flex items-center justify-between w-full">
                キャパシティ管理 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link href={`/store/${storeId}/layout`} className="flex items-center justify-between w-full">
                店舗レイアウト <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link href={`/store/${storeId}/scan`} className="flex items-center justify-between w-full">
                スキャン送信 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
