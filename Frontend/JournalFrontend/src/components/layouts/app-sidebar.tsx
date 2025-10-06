import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, List, Plus, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";

type LayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = [
    { title: "Home", to: "/home", icon: Home },
    { title: "All Entries", to: "/entries", icon: List },
    { title: "New Entry", to: "/newentry", icon: Plus },
  ];

  return (
    <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar className="border-r dark:border-slate-800 border-black " >
            <SidebarContent className="bg-zinc-800">
              <SidebarGroup className="mb-6">
                <SidebarGroupLabel>
                  <div className="flex items-center gap-3 px-3 mt-9">
                    <div className="rounded-full bg-white p-2 text-black font-bold text-2xl">
                      J
                    </div>
                    <div>
                      <h1 className="text-4xl font-extrabold text-white">Journal</h1>
                      <p className="text-1xl text-white">My entries & notes</p>
                    </div>
                  </div>
                </SidebarGroupLabel>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors duration-150 hover:bg-gray-200 ` +
                              (isActive
                                ? "bg-black text-white font-medium"
                                : "bg-white text-black")
                            }
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-slate-700 bg-zinc-900">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left focus:outline-none text-white hover:bg-gray-700 px-2 py-2 rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    </SidebarProvider>
  );
}
