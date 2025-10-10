import { NavLink } from "react-router-dom";
import { Home, List, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const items = [
    { title: "Home", to: "/home", icon: Home },
    { title: "All Entries", to: "/entries", icon: List },
    { title: "New Entry", to: "/newentry", icon: Plus },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border w-full">
        <SidebarContent className="bg-background">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="py-7">
                {items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton size="xl" asChild>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          `
                      flex items-center gap-3 px-3 py-3 rounded-lg text-lg font-semibold 
                      transition-colors duration-150
                      ${
                        isActive
                          ? "bg-accent text-accent-foreground "
                          : "bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                      `
                        }
                      >
                        <item.icon className="h-12 w-12" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
