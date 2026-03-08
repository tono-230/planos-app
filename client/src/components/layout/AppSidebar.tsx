import { Link, useLocation } from "wouter";
import {
  Gauge, Map, ScanLine, LayoutGrid, Building2, BarChart3,
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

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  accent = false,
  disabled = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  accent?: boolean;
  disabled?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild={!disabled}
        isActive={isActive}
        className={`transition-all duration-150 rounded-lg ${
          disabled
            ? "opacity-40 cursor-not-allowed pointer-events-none"
            : isActive
            ? accent
              ? "bg-accent/10 text-accent font-semibold"
              : "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        }`}
      >
        {disabled ? (
          <span className="flex items-center gap-3 px-3 py-2.5">
            <Icon className="h-4 w-4 shrink-0" />
            <span className="text-[13px]">{label}</span>
          </span>
        ) : (
          <Link href={href} className="flex items-center gap-3 px-3 py-2.5">
            <Icon className={`h-4 w-4 shrink-0 ${isActive ? (accent ? "text-accent" : "text-primary") : ""}`} />
            <span className="text-[13px]">{label}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const [location] = useLocation();

  const storeMatch = location.match(/^\/store\/([^/]+)/);
  const currentStoreId = storeMatch ? storeMatch[1] : null;

  const hq = (path: string) => location === path || (path === "/hq/dashboard" && location === "/");

  const storeActive = (path: string) =>
    currentStoreId ? location === `/store/${currentStoreId}/${path}` : false;

  const isStoreDashActive =
    location === "/hq/stores" ||
    (!!currentStoreId && storeActive("summary"));

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
            店舗
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 店舗ダッシュボード = 店舗一覧 (常に表示) */}
              <NavItem
                href="/hq/stores"
                icon={Gauge}
                label="店舗ダッシュボード"
                isActive={isStoreDashActive}
                accent
              />

              {/* 店舗選択後のみ表示 */}
              {currentStoreId && (
                <>
                  <NavItem
                    href={`/store/${currentStoreId}/plan`}
                    icon={BarChart3}
                    label="今週の売場計画"
                    isActive={storeActive("plan")}
                    accent
                  />
                  <NavItem
                    href={`/store/${currentStoreId}/layout`}
                    icon={LayoutGrid}
                    label="店舗レイアウト"
                    isActive={storeActive("layout")}
                    accent
                  />
                  <NavItem
                    href={`/store/${currentStoreId}/scan`}
                    icon={ScanLine}
                    label="RFIDスキャン"
                    isActive={storeActive("scan")}
                    accent
                  />
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 店舗未選択時のヒント */}
        {!currentStoreId && (
          <div className="mx-3 mt-2 rounded-lg bg-secondary/30 border border-border/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              店舗一覧から店舗を選択すると、店舗メニューが表示されます。
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
