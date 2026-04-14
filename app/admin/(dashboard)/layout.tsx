import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell, Shield } from "lucide-react";
import StoreProvider from "@/app/StoreProvider";
import GetAllCategories from "@/lib/GetAllDetails/GetAllCategories";
import GetAllProducts from "@/lib/GetAllDetails/GetAllProducts";
import GetAllAttributes from "@/lib/GetAllDetails/GetAllAttributes";
import GetUser from "@/lib/GetAllDetails/GetUser";
import GetAllPages from "@/lib/GetAllDetails/GetAllPages";
import { GetAllAdminUsers } from "@/lib/GetAllDetails/GetAllAdminUsers";

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let isAuthenticated = false;
  let user: any = null;

  if (token) {
    try {
      let check = jwt.verify(token, JWT_SECRET);
      if (check) {
        isAuthenticated = true;
        user = jwt.decode(token);
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <StoreProvider>
      <GetUser user={user} />
      <GetAllAttributes />
      <GetAllCategories />
      <GetAllProducts />
      <GetAllPages />
      <GetAllAdminUsers />

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-ink flex flex-col min-w-0 min-h-screen">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-gold/20 bg-charcoal px-6 sticky top-0 z-[9999] shadow-2xl shadow-black/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2 text-white/40 hover:text-gold transition-colors" />
              <Separator orientation="vertical" className="h-4 bg-white/10" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/admin"
                      className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-gold transition-colors italic"
                    >
                      Admin Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/10" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[10px] font-black text-gold uppercase tracking-[0.2em] italic">
                      System Insights
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-olive/20 border border-olive/30 px-3 py-1.5 rounded-sm ring-1 ring-gold/5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/40" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">
                  System Online
                </span>
              </div>
              <div className="h-9 w-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all cursor-pointer">
                <Bell size={16} />
              </div>
              <div className="h-9 w-9 rounded-sm bg-olive border border-olive/40 ring-1 ring-gold/10 flex items-center justify-center text-white shadow-xl shadow-olive/20">
                <Shield size={18} strokeWidth={2.5} />
              </div>
            </div>
          </header>
          <div className="flex-1 flex flex-col p-6 md:p-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-1000 overflow-x-hidden relative">
            {/* Subtle Carbon Fiber Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.015] pointer-events-none" />
            <div className="relative z-10 flex-1 flex flex-col">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  );
}
