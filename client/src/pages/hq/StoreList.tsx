import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight, ScanLine, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

const MOCK_STORES = [
  { id: "1", name: "渋谷店", area: "東京エリア", scanned: true, compliance: 82, overflow: 12 },
  { id: "2", name: "新宿店", area: "東京エリア", scanned: true, compliance: 65, overflow: 35 },
  { id: "3", name: "池袋店", area: "東京エリア", scanned: false, compliance: null, overflow: null },
  { id: "4", name: "横浜店", area: "神奈川エリア", scanned: true, compliance: 91, overflow: 8 },
  { id: "5", name: "川崎店", area: "神奈川エリア", scanned: false, compliance: null, overflow: null },
  { id: "6", name: "大宮店", area: "埼玉エリア", scanned: true, compliance: 73, overflow: 22 },
  { id: "7", name: "千葉店", area: "千葉エリア", scanned: false, compliance: null, overflow: null },
  { id: "8", name: "立川店", area: "東京エリア", scanned: true, compliance: 88, overflow: 15 },
];

export default function StoreList() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">店舗一覧</h1>
        <p className="mt-2 text-muted-foreground">各店舗の棚割実行状況を確認し、詳細ページへ移動できます。</p>
      </div>

      <div className="grid gap-3">
        {MOCK_STORES.map((store) => (
          <Link key={store.id} href={`/store/${store.id}/summary`}>
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
                          <div className={`font-black text-lg ${store.compliance >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {store.compliance}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground font-medium">オーバーフロー率</div>
                          <div className={`font-black text-lg ${store.overflow! > 20 ? 'text-orange-600' : 'text-blue-600'}`}>
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
      </div>
    </div>
  );
}
