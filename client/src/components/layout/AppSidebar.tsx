import { Link, useLocation } from "wouter";
import { LayoutDashboard, Map, BarChart3, Store, Settings, ScanLine, LayoutGrid } from "lucide-react";
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
  { title: "分析結果", url: "/hq/analysis", icon: BarChart3 },
  { title: "キャパシティ管理", url: "/hq/capacity", icon: BarChart3 },
];

const storeItems = [
  { title: "店舗レイアウト", url: "/store/layout", icon: LayoutGrid },
  { title: "スキャン送信", url: "/store/scan", icon: ScanLine },
];

export function AppSidebar() {
  const [location] = useLocation();

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

        <div className="py-2">
          <SidebarSeparator className="bg-border/50" />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold tracking-wider text-accent uppercase mb-2">店舗 (Store)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {storeItems.map((item) => {
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
      </SidebarContent>
    </Sidebar>
  );
}
