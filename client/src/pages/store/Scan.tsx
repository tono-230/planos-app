import { useState } from "react";
import { useLocations } from "@/hooks/use-locations";
import { useProducts } from "@/hooks/use-products";
import { useScans, useSubmitScans, useClearScans } from "@/hooks/use-scans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScanFace, RefreshCw, Trash2, Smartphone, CheckCircle2 } from "lucide-react";

export default function ScanSubmission() {
  const { toast } = useToast();
  const { data: locations, isLoading: loadingLocs } = useLocations();
  const { data: products, isLoading: loadingProds } = useProducts();
  const { data: scans, isLoading: loadingScans } = useScans();
  
  const submitScans = useSubmitScans();
  const clearScans = useClearScans();
  
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    if (!locations || !products || locations.length === 0 || products.length === 0) {
      toast({ title: "Error", description: "System data not loaded.", variant: "destructive" });
      return;
    }

    setIsScanning(true);

    // Simulate network delay and scan process
    setTimeout(() => {
      const mockScans = [];
      const numScans = Math.floor(Math.random() * 5) + 3; // 3 to 7 scans

      for (let i = 0; i < numScans; i++) {
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const prod = products[Math.floor(Math.random() * products.length)];
        mockScans.push({ locationId: loc.id, productId: prod.id });
      }

      submitScans.mutate({ scans: mockScans }, {
        onSuccess: (data) => {
          setIsScanning(false);
          toast({ 
            title: "Scan Complete", 
            description: `Successfully captured and transmitted ${data.count} RFID tags to HQ.` 
          });
        },
        onError: () => {
          setIsScanning(false);
        }
      });
    }, 1500);
  };

  const handleClear = () => {
    clearScans.mutate(undefined, {
      onSuccess: () => toast({ title: "Cleared", description: "All previous scan data removed." })
    });
  };

  const isLoading = loadingLocs || loadingProds || loadingScans;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <div className="text-center space-y-2">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
          <Smartphone className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Store Operations</h1>
        <p className="text-muted-foreground text-lg">Mobile RFID Scan Simulator</p>
      </div>

      <Card className="border-border/50 shadow-2xl shadow-accent/5 overflow-hidden">
        <div className="h-2 w-full bg-accent" />
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-2xl">Capture Display Data</CardTitle>
          <CardDescription className="text-base mt-2">
            Simulate walking the store floor and capturing RFID tags from shelves and products automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-12 space-y-8">
          
          <div className="relative group">
            <div className={`absolute -inset-4 rounded-full bg-accent/20 blur-xl transition-all duration-1000 ${isScanning ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
            <Button
              onClick={handleSimulateScan}
              disabled={isScanning || isLoading}
              className={`relative h-48 w-48 rounded-full shadow-xl text-lg flex flex-col gap-4 transition-all duration-300 ${
                isScanning 
                  ? 'bg-accent border-4 border-accent-foreground text-accent-foreground scale-95' 
                  : 'bg-gradient-to-br from-card to-secondary text-foreground hover:scale-105 border border-border hover:border-accent/50'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-12 w-12 animate-spin" />
                  <span className="font-bold">Scanning...</span>
                </>
              ) : (
                <>
                  <ScanFace className="h-16 w-16 text-accent" />
                  <span className="font-bold font-display">START SCAN</span>
                </>
              )}
            </Button>
          </div>

          <div className="w-full max-w-md bg-secondary/50 rounded-xl p-4 border border-border/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Device Status</span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Connected to HQ
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Previous Scans in DB:</span>
              <span className="font-bold text-foreground text-lg">{scans?.length || 0} items</span>
            </div>
          </div>

          {scans && scans.length > 0 && (
             <Button 
               variant="outline" 
               onClick={handleClear}
               disabled={clearScans.isPending || isScanning}
               className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground mt-4"
             >
               <Trash2 className="h-4 w-4 mr-2" />
               Reset Device Data (Testing)
             </Button>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
