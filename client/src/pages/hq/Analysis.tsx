import { useAnalysis } from "@/hooks/use-analysis";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Info, BoxSelect } from "lucide-react";

export default function AnalysisResult() {
  const { data: analysis, isLoading } = useAnalysis();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'correct':
        return <Badge className="bg-[hsl(var(--status-correct))] hover:bg-[hsl(var(--status-correct))]/90 border-transparent shadow-sm gap-1"><CheckCircle2 className="h-3 w-3"/> Correct</Badge>;
      case 'wrong_location':
        return <Badge className="bg-[hsl(var(--status-wrong))] text-amber-950 hover:bg-[hsl(var(--status-wrong))]/90 border-transparent shadow-sm gap-1"><AlertTriangle className="h-3 w-3"/> Wrong Location</Badge>;
      case 'missing':
        return <Badge className="bg-[hsl(var(--status-missing))] hover:bg-[hsl(var(--status-missing))]/90 border-transparent shadow-sm gap-1"><XCircle className="h-3 w-3"/> Missing</Badge>;
      case 'extra':
        return <Badge className="bg-[hsl(var(--status-extra))] hover:bg-[hsl(var(--status-extra))]/90 border-transparent shadow-sm gap-1"><Info className="h-3 w-3"/> Extra (Unplanned)</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusDescription = (item: any) => {
    switch (item.status) {
      case 'correct':
        return <span className="text-muted-foreground text-sm">Found in assigned zone: <strong className="text-foreground">{item.actualLocation?.name}</strong></span>;
      case 'wrong_location':
        return <span className="text-muted-foreground text-sm">Found in <strong className="text-foreground">{item.actualLocation?.name}</strong>, but planned for <strong className="text-foreground">{item.expectedLocation?.name}</strong></span>;
      case 'missing':
        return <span className="text-muted-foreground text-sm">Expected in <strong className="text-foreground">{item.expectedLocation?.name}</strong>, but not detected anywhere.</span>;
      case 'extra':
        return <span className="text-muted-foreground text-sm">Detected in <strong className="text-foreground">{item.actualLocation?.name}</strong>, but not in weekly plan.</span>;
      default:
        return null;
    }
  };

  const sortedAnalysis = analysis ? [...analysis].sort((a, b) => {
    // Sort to show errors first
    const order = { 'missing': 0, 'wrong_location': 1, 'extra': 2, 'correct': 3 };
    return order[a.status] - order[b.status];
  }) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Analysis</h1>
        <p className="mt-2 text-muted-foreground">Automated comparison between HQ plan and physical store scans.</p>
      </div>

      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b border-border/40 pb-4">
          <CardTitle className="text-xl">Detection Results</CardTitle>
          <CardDescription>Based on the latest RFID scan data</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!sortedAnalysis || sortedAnalysis.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <BoxSelect className="h-12 w-12 text-border mb-4" />
              <p className="text-lg font-medium text-foreground">No data available</p>
              <p className="text-sm mt-1">Ensure a plan exists and stores have submitted scans.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {sortedAnalysis.map((item, idx) => (
                <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary/10 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {renderStatusBadge(item.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        {item.product.name}
                        <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground uppercase tracking-widest font-bold">
                          {item.product.productGroup}
                        </span>
                      </h4>
                      <div className="mt-1.5">
                        {getStatusDescription(item)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
