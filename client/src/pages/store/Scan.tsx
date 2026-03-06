import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ScanLine, Send, CheckCircle2, AlertCircle, Package, MapPin, Warehouse } from "lucide-react";

// Mock data generation for eyewear RFID scans
const generateMockScans = () => {
  const brands = ["AIR Slim", "SUN Classic", "GB Metal", "JD Bold", "ES Basic", "KM Light"];
  const fixtures = ["入口テーブル", "中央島什器A", "中央島什器B", "壁面A", "壁面B", "レジ横"];
  const statuses = ["売場に展開", "バックヤード", "不明ロケーション"];
  
  return Array.from({ length: 30 }, (_, i) => {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const fixture = status === "売場に展開" ? fixtures[Math.floor(Math.random() * fixtures.length)] : "-";
    
    return {
      id: i + 1,
      epc: `3034E4390${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
      sku: `EYE-${1000 + i}`,
      name: `${brand} ${["01", "02", "03"][Math.floor(Math.random() * 3)]}`,
      fixture: fixture,
      status: status
    };
  });
};

export default function ScanSubmission() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scanData = useMemo(() => generateMockScans(), []);

  const stats = useMemo(() => {
    const totalSKUs = new Set(scanData.map(s => s.sku)).size;
    const floorCount = scanData.filter(s => s.status === "売場に展開").length;
    const backyardCount = scanData.filter(s => s.status === "バックヤード").length;
    const unknownCount = scanData.filter(s => s.status === "不明ロケーション").length;
    
    return { totalSKUs, floorCount, backyardCount, unknownCount };
  }, [scanData]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "送信完了",
        description: "RFIDスキャン結果を本部へ送信しました。",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ScanLine className="h-8 w-8 text-primary" />
            RFIDスキャン送信
          </h1>
          <p className="mt-2 text-muted-foreground">最新の売場状況をスキャンし、本部へ報告します。</p>
        </div>
        <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">送信ステータス</span>
            <div className="flex items-center gap-2">
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
          >
            {isSubmitting ? "送信中..." : "スキャン結果を本部へ送信"}
            {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md shadow-black/5 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" /> 総検出SKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSKUs}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" /> 売場展開SKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.floorCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-blue-500" /> バックヤードSKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.backyardCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" /> 不明ロケーション数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.unknownCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b border-border/40">
          <CardTitle>スキャン結果詳細</CardTitle>
          <CardDescription>検出された全てのRFIDタグ情報（最新30件）</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/10">
                  <TableHead className="w-[200px] font-bold">EPC</TableHead>
                  <TableHead className="font-bold">SKU</TableHead>
                  <TableHead className="font-bold">商品名</TableHead>
                  <TableHead className="font-bold">検出什器</TableHead>
                  <TableHead className="font-bold">状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanData.map((scan) => (
                  <TableRow key={scan.id} className="hover:bg-secondary/5 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">{scan.epc}</TableCell>
                    <TableCell className="font-medium">{scan.sku}</TableCell>
                    <TableCell>{scan.name}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5">
                        {scan.fixture !== "-" && <MapPin className="h-3 w-3 text-primary" />}
                        {scan.fixture}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          scan.status === "売場に展開" ? "default" : 
                          scan.status === "バックヤード" ? "secondary" : "outline"
                        }
                        className={
                          scan.status === "売場に展開" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" :
                          scan.status === "不明ロケーション" ? "text-amber-600 border-amber-500/20" : ""
                        }
                      >
                        {scan.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
