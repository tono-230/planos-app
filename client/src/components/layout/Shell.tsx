import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { BarChart3, LayoutGrid, ScanLine } from "lucide-react";

function MobileStoreNav() {
  const [location] = useLocation();
  const storeMatch = location.match(/^\/store\/([^/]+)/);
  if (!storeMatch) return null;
  const storeId = storeMatch[1];

  const tabs = [
    { href: `/store/${storeId}/plan`,   icon: BarChart3,  label: "売場計画"    },
    { href: `/store/${storeId}/layout`, icon: LayoutGrid, label: "レイアウト"  },
    { href: `/store/${storeId}/scan`,   icon: ScanLine,   label: "RFIDスキャン" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border/60 bg-background/97 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex">
        {tabs.map(tab => {
          const active = location.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 transition-colors active:bg-secondary/50 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`h-6 w-6 transition-colors ${active ? "text-primary" : ""}`} />
              <span className={`text-[12px] font-bold leading-none transition-colors ${active ? "text-primary" : ""}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute -top-[1px] left-0 right-0 mx-auto h-[3px] w-8 rounded-full bg-primary" style={{ position: "relative" }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function ShellContent({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isStorePage = /^\/store\//.test(location);

  return (
    <>
      <main className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 ${isStorePage ? "pb-24 md:pb-8" : ""}`}>
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
      <MobileStoreNav />
    </>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-40 flex h-14 md:h-16 shrink-0 items-center gap-4 border-b border-border/40 bg-background/80 px-4 md:px-6 backdrop-blur-md">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground h-8 w-8" />
            <div className="flex-1" />
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              システム稼働中
            </div>
          </header>
          <ShellContent>{children}</ShellContent>
        </div>
      </div>
    </SidebarProvider>
  );
}
