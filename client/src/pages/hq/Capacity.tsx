import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  LayoutGrid,
  ArrowRightLeft,
  MinusCircle
} from "lucide-react";

const MOCK_OPTIMIZATION_DATA = [
  { sku: "EYE-2001", name: "AIR Slim 01", block: "AIR", status: "売場展開中", sales: "高", action: "展開継続" },
  { sku: "EYE-2002", name: "SUN Classic 02", block: "SUN", status: "バックヤード", sales: "低", action: "削減候補" },
  { sku: "EYE-2003", name: "GB Metal 01", block: "GB", status: "売場展開中", sales: "中", action: "展開継続" },
  { sku: "EYE-2004", name: "JD Bold 03", block: "JD", status: "誤配置", sales: "中", action: "要確認" },
  { sku: "EYE-2005", name: "ES Basic 02", block: "ES", status: "未展開", sales: "高", action: "入替候補" },
  { sku: "EYE-2006", name: "KM Light 01", block: "KM", status: "売場展開中", sales: "低", action: "入替候補" },
  { sku: "EYE-2007", name: "AIR Slim 02", block: "AIR", status: "バックヤード", sales: "低", action: "削減候補" },
  { sku: "EYE-2008", name: "SUN Classic 01", block: "SUN", status: "売場展開中", sales: "高", action: "展開継続" },
];

export default function CapacityManagement() {
  const stats = {
    totalSkus: 1542,
    capacity: 1000,
    planned: 985,
    notDisplayed: 557,
    needsReview: 42
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "展開継続":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1"><CheckCircle2 className="h-3 w-3" /> 展開継続</Badge>;
      case "入替候補":
        return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1"><ArrowRightLeft className="h-3 w-3" /> 入替候補</Badge>;
      case "削減候補":
        return <Badge className="bg-orange-500 hover:bg-orange-600 gap-1"><MinusCircle className="h-3 w-3" /> 削減候補</Badge>;
      case "要確認":
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> 要確認</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getSalesIcon = (sales: string) => {
    switch (sales) {
      case "高":
        return <div className="flex items-center text-emerald-600 font-bold"><TrendingUp className="h-4 w-4 mr-1" /> 高</div>;
      case "中":
        return <div className="flex items-center text-blue-600 font-bold">中</div>;
      case "低":
        return <div className="flex items-center text-rose-600 font-bold"><TrendingDown className="h-4 w-4 mr-1" /> 低</div>;
      default:
        return sales;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          売場キャパシティ管理
        </h1>
        <p className="mt-2 text-muted-foreground">商品数と陳列スペースの最適化を行い、効率的な売場構成を支援します。</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="border-none shadow-md shadow-black/5 bg-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Package className="h-3 w-3" /> 総SKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black">{stats.totalSkus.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md shadow-black/5 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <LayoutGrid className="h-3 w-3" /> 売場キャパ数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black">{stats.capacity.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="h-3 w-3" /> 展開予定SKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black">{stats.planned.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-1 text-orange-600">
              <MinusCircle className="h-3 w-3" /> 未展開SKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black">{stats.notDisplayed.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md shadow-black/5 bg-rose-50 dark:bg-rose-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> 要見直しSKU数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-rose-600">{stats.needsReview}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b border-border/40">
          <CardTitle>最適化候補リスト</CardTitle>
          <CardDescription>売上実績と現在の展開状況に基づいた推奨アクション</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/10">
                  <TableHead className="font-bold">SKU</TableHead>
                  <TableHead className="font-bold">商品名</TableHead>
                  <TableHead className="font-bold">計画ブロック</TableHead>
                  <TableHead className="font-bold">現在状態</TableHead>
                  <TableHead className="font-bold">直近売上</TableHead>
                  <TableHead className="font-bold text-primary">推奨アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_OPTIMIZATION_DATA.map((item) => (
                  <TableRow key={item.sku} className="hover:bg-secondary/5 transition-colors">
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="font-bold">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                        {item.block}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.status}</span>
                    </TableCell>
                    <TableCell>
                      {getSalesIcon(item.sales)}
                    </TableCell>
                    <TableCell>
                      {getActionBadge(item.action)}
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
