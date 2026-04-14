"use client";

import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ShoppingCart,
  LogOut,
  ListTree,
  ChevronUp,
  User2,
  Settings,
  Bell,
  Sparkles,
  FileText,
  Image,
  UserCog2,
  ShieldCheck,
  Zap,
  Gem,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AppDispatch } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/auth/authSlice";
import { logoutThunk } from "@/lib/store/auth/authThunks";
import Link from "next/link";

const NAV_ITEMS = [
  {
    group: "General Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
        badge: null,
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        exact: false,
        badge: "3",
      },
    ],
  },
  {
    group: "Product Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Gem,
        exact: false,
        badge: null,
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: Sparkles,
        exact: false,
        badge: null,
      },
      {
        label: "Attributes",
        href: "/admin/attributes",
        icon: ShieldCheck,
        exact: false,
        badge: null,
      },
      {
        label: "Consultations",
        href: "/admin/consultations",
        icon: Zap,
        exact: false,
        badge: "New",
      },
    ],
  },
  {
    group: "Customer Relations",
    items: [
      {
        label: "Customers",
        href: "/admin/customers",
        icon: User2,
        exact: false,
        badge: null,
      },
      {
        label: "Astrologer Bookings",
        href: "/admin/consultations",
        icon: Bell,
        exact: false,
        badge: "1",
      },
    ],
  },
  {
    group: "Content & Media",
    items: [
      {
        label: "Pages",
        href: "/admin/pages",
        icon: FileText,
        exact: false,
        badge: null,
      },
      {
        label: "Media Library",
        href: "/admin/media",
        icon: Image,
        exact: false,
        badge: null,
      },
      {
        label: "Global Settings",
        href: "/admin/settings",
        icon: Settings,
        exact: false,
        badge: null,
      },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    const user = await dispatch(logoutThunk());
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Sidebar variant="inset" className="border-r-0">
      {/* Header */}
      <SidebarHeader className="h-24 flex px-6 items-center justify-center bg-sidebar border-b border-sidebar-border/50">
        <div className="flex items-center gap-4 w-full">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-transform hover:scale-105 duration-300">
            <img
              src="/assets/Image/favicon.svg"
              alt="Logo"
              className="w-8 h-8 brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-heading font-bold text-white tracking-tight leading-none mb-1">
              GemsRatna
            </span>
            <span className="text-[9px] font-black text-sidebar-primary tracking-[0.3em] uppercase opacity-80">
              Premium Admin
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="bg-sidebar px-2 pt-6 gap-3">
        {NAV_ITEMS.map((group) => (
          <SidebarGroup key={group.group} className="px-2">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/40 px-4 mb-3">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {group.items.map(
                  ({ label, href, icon: Icon, exact, badge }) => {
                    const active = isActive(href, exact);
                    return (
                      <SidebarMenuItem key={`${label}-${href}`}>
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl px-4 h-11 w-full text-sm font-bold transition-all duration-300 group/item",
                            active
                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                              : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <Icon
                            size={18}
                            className={cn(
                              "shrink-0 transition-transform duration-300 group-hover/item:scale-110",
                              active
                                ? "text-sidebar-primary-foreground"
                                : "text-sidebar-foreground/40 group-hover/item:text-sidebar-primary",
                            )}
                          />
                          <span className="tracking-tight">{label}</span>
                          {badge && (
                            <span
                              className={cn(
                                "ml-auto text-[10px] px-2 py-0.5 rounded-lg font-black tracking-widest",
                                active
                                  ? "bg-sidebar-primary-foreground/10 text-sidebar-primary-foreground"
                                  : "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
                              )}
                            >
                              {badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuItem>
                    );
                  },
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 bg-sidebar border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full rounded-2xl px-3 h-16 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sidebar-primary/30 transition-all duration-300 group text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shrink-0">
                    <User2 size={20} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold text-sm text-white leading-none mb-1">
                      Admin User
                    </span>
                    <span className="text-[10px] text-sidebar-foreground/50 truncate font-medium">
                      admin@gemsratna.com
                    </span>
                  </div>
                  <ChevronUp
                    size={16}
                    className="text-sidebar-foreground/40 shrink-0 transition-transform group-hover:translate-y-[-2px]"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={12}
                className="w-64 font-sans bg-sidebar border border-sidebar-border/50 shadow-2xl rounded-3xl p-2 backdrop-blur-xl"
              >
                <DropdownMenuLabel className="px-4 py-4 bg-white/5 rounded-2xl mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                      <User2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">Admin User</p>
                      <p className="text-[10px] text-sidebar-primary font-black uppercase tracking-[0.2em]">
                        Superadmin
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-sidebar-border/50 my-2" />
                <DropdownMenuItem
                  onClick={() => router.push("/admin/account-settings")}
                  className="cursor-pointer gap-3 py-3 rounded-xl text-sidebar-foreground/70 hover:text-white focus:text-white focus:bg-sidebar-primary focus:text-sidebar-primary-foreground transition-all"
                >
                  <Settings size={16} />
                  <span className="font-bold text-sm">Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-3 py-3 rounded-xl text-sidebar-foreground/70 hover:text-white focus:text-white focus:bg-sidebar-primary focus:text-sidebar-primary-foreground transition-all">
                  <Bell size={16} />
                  <span className="font-bold text-sm">Notifications</span>
                  <span className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-[10px] px-2 py-0.5 rounded-lg font-black">
                    2
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border/50 my-2" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-all font-black"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
