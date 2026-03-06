import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layout
import { Shell } from "./components/layout/Shell";

// Pages
import Dashboard from "./pages/hq/Dashboard";
import PlanManager from "./pages/hq/Plan";
import AnalysisResult from "./pages/hq/Analysis";
import CapacityManagement from "./pages/hq/Capacity";
import StoreLayout from "./pages/store/Layout";
import ScanSubmission from "./pages/store/Scan";

function Router() {
  return (
    <Shell>
      <Switch>
        {/* Redirect root to HQ dashboard for convenience */}
        <Route path="/">
          {() => <Redirect to="/hq/dashboard" />}
        </Route>
        
        {/* HQ Routes */}
        <Route path="/hq/dashboard" component={Dashboard} />
        <Route path="/hq/plan" component={PlanManager} />
        <Route path="/hq/analysis" component={AnalysisResult} />
        <Route path="/hq/capacity" component={CapacityManagement} />
        
        {/* Store Routes */}
        <Route path="/store/layout" component={StoreLayout} />
        <Route path="/store/scan" component={ScanSubmission} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
