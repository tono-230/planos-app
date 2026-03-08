import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ScanLine, Send, CheckCircle2, AlertCircle, Package, MapPin,
  Warehouse, ArrowRight, AlertTriangle, X,
} from "lucide-react";
import { Link, useParams } from "wouter";

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

const generateMockScans = () => {
  const brands = ["AIR Slim", "SUN Classic", "GB Metal", "JD Bold", "ES Basic", "KM Light"];
  const fixtures = ["上部壁面什器", "右側壁面什器", "島什器 1", "島什器 2", "下部什器 1", "下部什器 2"];
  const statuses = ["売場に展開", "バックヤード"];

  return Array.from({ length: 30 }, (_, i) => {
    const brand = brands[Math.floor((i * 7 + 3) % brands.length)];
    const status = statuses[i % 3 === 0 ? 1 : 0];
    const plannedFixture = fixtures[Math.floor((i * 5 + 1) % fixtures.length)];

    let fixture = "-";
    let comparison = "要確認";

    if (status === "売場に展開") {
      if (i % 5 !== 0) {
        fixture = fixtures[Math.floor((i * 3 + 2) % fixtures.length)];
        comparison = fixture === plannedFixture ? "計画通り" : "誤配置";
      } else {
        fixture = "未特定";
        comparison = "要確認";
      }
    } else {
      comparison = "未展開";
    }

    return {
      id: i + 1,
      epc: `3034E4390${(i * 0x1a3c5f + 0xdeadbeef).toString(16).toUpperCase().padStart(8, "0").slice(0, 8)}`,
      sku: `EYE-${1000 + i}`,
      name: `${brand} ${["01", "02", "03"][i % 3]}`,
      fixture,
      status,
      plannedBlock: brand.split(" ")[0],
      comparison,
    };
  });
};

export default function ScanSubmission() {
  const params = useParams<{ id: string }>();
  const storeId = params.id || "1";
  const storeName = STORE_NAMES[storeId] || "店舗";
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const scanData = useMemo(() => generateMockScans(), []);

  const stats = useMemo(() => {
    const totalSKUs = new Set(scanData.map(s => s.sku)).size;
    const floorCount = scanData.filter(s => s.status === "売場に展開").length;
    const backyardCount = scanData.filter(s => s.status === "バックヤード").length;
    const unknownCount = scanData.filter(s => s.comparison === "要確認").length;
    return { totalSKUs, floorCount, backyardCount, unknownCount };
  }, [scanData]);

  const unknownItems = useMemo(
    () => scanData.filter(s => s.comparison === "要確認"),
    [scanData],
  );

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({ title: "送信完了", description: "RFIDスキャン結果を本部へ送信しました。" });
    }, 1500);
  };

  const getComparisonBadge = (comparison: string) => {
    switch (comparison) {
      case "計画通り":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">計画通り</Badge>;
      case "未展開":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">未展開</Badge>;
      case "誤配置":
        return <Badge className="bg-orange-500 hover:bg-orange-600">誤配置</Badge>;
      case "要確認":
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">要確認</Badge>;
      default:
        return <Badge variant="outline">{comparison}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/hq/stores" className="hover:text-foreground transition-colors">店舗一覧</Link>
            <span>/</span>
            <Link href={`/store/${storeId}/summary`} className="hover:text-foreground transition-colors">{storeName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">RFIDスキャン</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ScanLine className="h-8 w-8 text-primary" />
            RFIDスキャン
          </h1>
          <p className="mt-2 text-muted-foreground">最新の売場状況をスキャンし、本部へ報告します。</p>
        </div>
        <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">送信ステータス</span>
            <div className="flex items-center gap-2 mt-1">
              {isSubmitted ? (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1">
                  <CheckCircle2 className="h-3 w-3" /> 送信済み
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground gap-1">
                  <AlertCircle className="h-3 w-3" /> 未送信
                </Badge>
              )}
            </div>
          </div>
          <Button
            disabled={isSubmitted || isSubmitting}
            onClick={handleSubmit}
            className="shadow-lg shadow-primary/20"
            data-testid="button-submit-scan"
          >
            {isSubmitting ? "送信中..." : "本部へ送信"}
            {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md shadow-black/5 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" /> 総検出SKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-sku">{stats.totalSKUs}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" /> 売場展開SKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-floor-sku">{stats.floorCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-blue-500" /> バックヤードSKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-backyard-sku">{stats.backyardCount}</div>
          </CardContent>
        </Card>

        {/* 要確認 card — opens lightbox */}
        <Card className="border border-amber-200/80 shadow-md shadow-black/5 bg-amber-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> 要確認SKU数
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between gap-2">
            <div className="text-2xl font-bold text-amber-600" data-testid="stat-unknown-sku">
              {stats.unknownCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0"
              onClick={() => setAnalysisOpen(true)}
              data-testid="button-goto-analysis"
            >
              詳細確認 <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scan results table */}
      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b border-border/40">
          <CardTitle>スキャン結果詳細（棚割比較）</CardTitle>
          <CardDescription>検出された全てのRFIDタグ情報と本部計画との照合結果</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/10">
                  <TableHead className="w-[160px] font-bold">EPC</TableHead>
                  <TableHead className="font-bold">商品名</TableHead>
                  <TableHead className="font-bold text-primary">計画ブロック</TableHead>
                  <TableHead className="font-bold">検出什器</TableHead>
                  <TableHead className="font-bold">検出状態</TableHead>
                  <TableHead className="font-bold text-primary">判定結果</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanData.map((scan) => (
                  <TableRow key={scan.id} className="hover:bg-secondary/5 transition-colors">
                    <TableCell className="font-mono text-[10px] text-muted-foreground">{scan.epc}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{scan.name}</span>
                        <span className="text-[10px] text-muted-foreground">{scan.sku}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                        {scan.plannedBlock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-xs">
                        {scan.fixture !== "-" && <MapPin className="h-3 w-3 text-primary" />}
                        {scan.fixture}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{scan.status}</span>
                    </TableCell>
                    <TableCell>{getComparisonBadge(scan.comparison)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 要確認 SKU lightbox dialog */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              要確認SKU — スキャン結果詳細
            </DialogTitle>
            <DialogDescription>
              位置が特定できなかったSKUの一覧です。売場確認または在庫確認が必要です。
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 px-1 py-2 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              {unknownItems.length} 件の要確認SKUが見つかりました。早急な対応を推奨します。
            </p>
          </div>

          <div className="overflow-auto flex-1 rounded-lg border border-border/50">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary/80 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="font-bold">商品名</TableHead>
                  <TableHead className="font-bold w-[130px]">SKU</TableHead>
                  <TableHead className="font-bold text-primary">計画ブロック</TableHead>
                  <TableHead className="font-bold">検出什器</TableHead>
                  <TableHead className="font-bold">検出状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unknownItems.map((scan) => (
                  <TableRow key={scan.id} className="hover:bg-amber-50/50 transition-colors">
                    <TableCell>
                      <span className="font-semibold text-sm">{scan.name}</span>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {scan.sku}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold border-primary/20 text-primary text-[11px]">
                        {scan.plannedBlock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-500" />
                        {scan.fixture}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{scan.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-1">
            <Button variant="outline" onClick={() => setAnalysisOpen(false)} data-testid="button-close-analysis">
              <X className="h-4 w-4 mr-1.5" /> 閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
