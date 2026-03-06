import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layout
import { Shell } from "./components/layout/Shell";

// Context
import { StorePlanProvider } from "./context/StorePlanContext";

// HQ Pages
import Dashboard from "./pages/hq/Dashboard";
import PlanManager from "./pages/hq/Plan";
import StoreList from "./pages/hq/StoreList";
import SVCapacity from "./pages/hq/SVCapacity";

// Store Pages
import StoreSummary from "./pages/store/StoreSummary";
import StoreAnalysis from "./pages/store/StoreAnalysis";
import StoreCapacity from "./pages/store/StoreCapacity";
import StoreLayout from "./pages/store/Layout";
import StorePlan from "./pages/store/StorePlan";
import ScanSubmission from "./pages/store/Scan";

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/">
          {() => <Redirect to="/hq/dashboard" />}
        </Route>

        {/* HQ Routes */}
        <Route path="/hq/dashboard" component={Dashboard} />
        <Route path="/hq/plan" component={PlanManager} />
        <Route path="/hq/stores" component={StoreList} />
        <Route path="/hq/sv-capacity" component={SVCapacity} />

        {/* Store Routes */}
        <Route path="/store/:id/summary" component={StoreSummary} />
        <Route path="/store/:id/analysis" component={StoreAnalysis} />
        <Route path="/store/:id/capacity" component={StoreCapacity} />
        <Route path="/store/:id/layout" component={StoreLayout} />
        <Route path="/store/:id/plan" component={StorePlan} />
        <Route path="/store/:id/scan" component={ScanSubmission} />

        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StorePlanProvider>
          <Toaster />
          <Router />
        </StorePlanProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
