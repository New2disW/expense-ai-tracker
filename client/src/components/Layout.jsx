
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Plus, 
  Receipt, 
  PieChart,
  Wallet,
  TrendingUp,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Add Expense",
    url: createPageUrl("AddExpense"),
    icon: Plus,
  },
  {
    title: "All Expenses",
    url: createPageUrl("Expenses"),
    icon: Receipt,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        @keyframes bg-slideshow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .slideshow-bg {
          background: linear-gradient(-45deg, #312e81, #3730a3, #4338ca, #4f46e5);
          background-size: 400% 400%;
          animation: bg-slideshow 20s ease infinite;
        }

        .sidebar-gradient {
          background: rgba(15, 23, 42, 0.8);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
        }
        
        .accent-gradient-gold {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }
        
        .accent-gradient-indigo {
          background: linear-gradient(135deg, #818cf8 0%, #4f46e5 100%);
        }
        
        .accent-gradient-indigo {
          background: linear-gradient(135deg, #818cf8 0%, #4f46e5 100%);
        }
        
        .hover-lift {
          transition: all 0.3s ease-in-out;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25), 0 7px 10px rgba(0, 0, 0, 0.22);
        }

        .indigo-shadow {
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        }
      `}</style>
      
      <div className="min-h-screen flex w-full slideshow-bg">
        <Sidebar className="border-r-0 sidebar-gradient">
          <SidebarHeader className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 accent-gradient-indigo rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">ExpenseAI</h2>
                <p className="text-xs text-slate-300 font-medium">Smart Expense Tracker</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group hover:bg-white/10 transition-all duration-300 rounded-lg ${
                          location.pathname === item.url 
                            ? 'bg-indigo-500/20 text-indigo-300' 
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="md:hidden bg-slate-900/70 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10 p-4 flex items-center justify-between">
            <SidebarTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </Button>
            </SidebarTrigger>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 accent-gradient-indigo rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-white text-lg">ExpenseAI</h2>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
