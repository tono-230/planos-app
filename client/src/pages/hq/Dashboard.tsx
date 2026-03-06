import { useScans } from "@/hooks/use-scans";
import { useAnalysis } from "@/hooks/use-analysis";
import { usePlans } from "@/hooks/use-plans";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, AlertCircle, ShoppingCart, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: scans, isLoading: isLoadingScans } = useScans();
  const { data: analysis, isLoading: isLoadingAnalysis } = useAnalysis();
  const { data: plans, isLoading: isLoadingPlans } = usePlans();

  const isLoading = isLoadingScans || isLoadingAnalysis || isLoadingPlans;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const totalScans = scans?.length || 0;
  const totalPlanned = plans?.length || 0;
  
  const correctCount = analysis?.filter(a => a.status === 'correct').length || 0;
  const errorCount = analysis?.filter(a => a.status !== 'correct').length || 0;
  
  const accuracyRate = totalScans > 0 ? Math.round((correctCount / totalScans) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
        <p className="mt-2 text-muted-foreground">Monitor real-time planogram compliance across all locations.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md shadow-black/5 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Store Scan Status</CardTitle>
            <Activity className={`h-5 w-5 ${totalScans > 0 ? 'text-emerald-500' : 'text-amber-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{totalScans > 0 ? 'Received' : 'Pending'}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalScans} data points collected
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Implementation Accuracy</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{accuracyRate}%</div>
            <div className="w-full bg-secondary h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${accuracyRate}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Planograms</CardTitle>
            <MapPin className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{totalPlanned}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Products mapped to locations
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/10 rounded-bl-full -z-10" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Identified Mismatches</CardTitle>
            <AlertCircle className={`h-5 w-5 ${errorCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{errorCount}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Requires store intervention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 shadow-lg shadow-black/5 col-span-1">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Recommended actions based on current data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {totalPlanned === 0 ? (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-500">Create a Weekly Plan</h4>
                  <p className="text-sm text-amber-800/80 dark:text-amber-400/80 mt-1 mb-3">No plans exist for the current week. Start by mapping products to display locations.</p>
                  <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href="/hq/plan">Go to Plan Builder</Link>
                  </Button>
                </div>
              </div>
            ) : totalScans === 0 ? (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50 flex items-start gap-3">
                <Store className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-500">Awaiting Store Scans</h4>
                  <p className="text-sm text-blue-800/80 dark:text-blue-400/80 mt-1 mb-3">The weekly plan is ready, but stores have not submitted their RFID scan data yet.</p>
                  <Button asChild size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <Link href="/store/scan">Simulate Store Scan</Link>
                  </Button>
                </div>
              </div>
            ) : errorCount > 0 ? (
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-semibold text-destructive">Review Mismatches</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">Analysis detected {errorCount} discrepancies between the plan and actual store displays.</p>
                  <Button asChild size="sm" variant="destructive">
                    <Link href="/hq/analysis">View Analysis</Link>
                  </Button>
                </div>
              </div>
            ) : (
               <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/50 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-500">All Clear</h4>
                  <p className="text-sm text-emerald-800/80 dark:text-emerald-400/80 mt-1">Store displays match the planogram perfectly. No action required.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
