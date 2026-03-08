import { Link, useLocation } from "wouter";
import {
  Gauge, Map, ScanLine, LayoutGrid,
  Building2, FileBarChart2, BarChart3, Layers,
} from "lucide-react";
import { PlanoSIcon } from "@/components/ui/PlanoSIcon";
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

const STORE_NAMES: Record<string, string> = {
  "1": "渋谷店", "2": "新宿店", "3": "池袋店", "4": "横浜店",
  "5": "川崎店", "6": "大宮店", "7": "千葉店", "8": "立川店",
};

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  accent = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  accent?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={`transition-all duration-150 rounded-lg ${
          isActive
            ? accent
              ? "bg-accent/10 text-accent font-semibold"
              : "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        }`}
      >
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5">
          <Icon className={`h-4 w-4 shrink-0 ${isActive ? (accent ? "text-accent" : "text-primary") : ""}`} />
          <span className="text-[13px]">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const [location] = useLocation();

  const storeMatch = location.match(/^\/store\/([^/]+)/);
  const currentStoreId = storeMatch ? storeMatch[1] : null;
  const currentStoreName = currentStoreId ? (STORE_NAMES[currentStoreId] || "店舗") : null;

  const hq = (path: string) => location === path || (path === "/hq/dashboard" && location === "/");

  const storeHref = (path: string) =>
    currentStoreId ? `/store/${currentStoreId}/${path}` : "#";

  const storeActive = (path: string) =>
    currentStoreId ? location === `/store/${currentStoreId}/${path}` : false;

  return (
    <Sidebar variant="inset" className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <PlanoSIcon size={40} className="shrink-0 shadow-lg shadow-primary/25 rounded-[10px]" />
          <div className="flex flex-col">
            <span className="font-display text-lg font-black leading-tight tracking-tight">PlanoS</span>
            <span className="text-[11px] font-medium text-muted-foreground leading-tight">Planogram Simulation</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 space-y-1">
        {/* 本部 section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-widest text-primary/60 uppercase px-3 mb-1">
            本部
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/hq/dashboard" icon={Gauge} label="ダッシュボード" isActive={hq("/hq/dashboard")} />
              <NavItem href="/hq/plan" icon={Map} label="今週の売場計画" isActive={hq("/hq/plan")} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-3 py-1">
          <SidebarSeparator className="bg-border/40" />
        </div>

        {/* 店舗 section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-widest text-accent/70 uppercase px-3 mb-1 flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            {currentStoreName ? `店舗 — ${currentStoreName}` : "店舗"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem
                href={currentStoreId ? `/store/${currentStoreId}/summary` : "/hq/stores"}
                icon={Gauge}
                label="ダッシュボード"
                isActive={currentStoreId ? storeActive("summary") : location === "/hq/stores"}
                accent
              />
              <NavItem
                href={currentStoreId ? `/store/${currentStoreId}/capacity` : "/hq/sv-capacity"}
                icon={Layers}
                label="店舗のキャパシティ管理"
                isActive={currentStoreId ? storeActive("capacity") : location === "/hq/sv-capacity"}
                accent
              />
              <NavItem
                href={currentStoreId ? `/store/${currentStoreId}/analysis` : "/hq/stores"}
                icon={FileBarChart2}
                label="スキャン結果"
                isActive={currentStoreId ? storeActive("analysis") : false}
                accent
              />
              <NavItem
                href={currentStoreId ? `/store/${currentStoreId}/scan` : "/hq/stores"}
                icon={ScanLine}
                label="スキャン送信"
                isActive={currentStoreId ? storeActive("scan") : false}
                accent
              />
              <NavItem
                href={currentStoreId ? `/store/${currentStoreId}/plan` : "/hq/stores"}
                icon={BarChart3}
                label="今週の売場計画"
                isActive={currentStoreId ? storeActive("plan") : false}
                accent
              />
              <NavItem
                href={currentStoreId ? `/store/${currentStoreId}/layout` : "/hq/stores"}
                icon={LayoutGrid}
                label="店舗レイアウト"
                isActive={currentStoreId ? storeActive("layout") : false}
                accent
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Store context hint when not in a store */}
        {!currentStoreId && (
          <div className="mx-3 mt-2 rounded-lg bg-secondary/30 border border-border/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              店舗一覧から店舗を選択すると、店舗メニューが有効になります。
            </p>
            <Link
              href="/hq/stores"
              className="text-[11px] text-primary font-semibold mt-1 inline-block hover:underline"
            >
              店舗一覧へ →
            </Link>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
