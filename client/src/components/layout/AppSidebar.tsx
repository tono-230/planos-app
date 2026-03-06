import { Link, useLocation, useParams } from "wouter";
import { LayoutDashboard, Map, BarChart3, Store, ScanLine, LayoutGrid, Building2, FileBarChart2, ChevronLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const hqItems = [
  { title: "ダッシュボード", url: "/hq/dashboard", icon: LayoutDashboard },
  { title: "週間売場計画", url: "/hq/plan", icon: Map },
  { title: "店舗一覧", url: "/hq/stores", icon: Building2 },
];

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

function getStoreSubItems(storeId: string) {
  return [
    { title: "店舗サマリー", url: `/store/${storeId}/summary`, icon: Store },
    { title: "実行分析", url: `/store/${storeId}/analysis`, icon: FileBarChart2 },
    { title: "キャパシティ管理", url: `/store/${storeId}/capacity`, icon: BarChart3 },
    { title: "店舗レイアウト", url: `/store/${storeId}/layout`, icon: LayoutGrid },
    { title: "スキャン送信", url: `/store/${storeId}/scan`, icon: ScanLine },
  ];
}

export function AppSidebar() {
  const [location] = useLocation();

  // Detect if we're inside a store-level route (e.g. /store/1/summary)
  const storeMatch = location.match(/^\/store\/([^/]+)/);
  const currentStoreId = storeMatch ? storeMatch[1] : null;
  const currentStoreName = currentStoreId ? (STORE_NAMES[currentStoreId] || "店舗") : null;
  const storeSubItems = currentStoreId ? getStoreSubItems(currentStoreId) : null;

  return (
    <Sidebar variant="inset" className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold leading-tight">PlanoSense</span>
            <span className="text-xs font-medium text-muted-foreground">店舗オペレーション</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* HQ Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold tracking-wider text-primary/70 uppercase mb-2">本部 (HQ)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hqItems.map((item) => {
                const isActive = location === item.url || (location === "/" && item.url === "/hq/dashboard");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`transition-all duration-200 rounded-lg ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Store Sub-nav: shown only when inside a store route */}
        {currentStoreId && storeSubItems && (
          <>
            <div className="py-2">
              <SidebarSeparator className="bg-border/50" />
            </div>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold tracking-wider text-accent uppercase mb-2 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {currentStoreName}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="transition-all duration-200 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    >
                      <Link href="/hq/stores" className="flex items-center gap-3 px-3 py-2.5">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-xs">店舗一覧に戻る</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {storeSubItems.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`transition-all duration-200 rounded-lg ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
                        >
                          <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className={`h-4 w-4 ${isActive ? 'text-accent' : ''}`} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
