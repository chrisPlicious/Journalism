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
      <Sidebar className="border-r border-[var(--sidebar-border)] w-full">
        <SidebarContent className="bg-[var(--sidebar)]">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="py-4 space-y-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.to} className="mx-2">
                    <SidebarMenuButton size="default" asChild>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          `
                      flex items-center gap-3 py-2.5 px-4 rounded-[10px] text-[15px] font-medium
                      transition-colors duration-150 min-h-[44px]
                      ${
                        isActive
                          ? "bg-[var(--sage-100)] text-[var(--sage-700)]"
                          : "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--sage-50)] hover:text-[var(--foreground)]"
                      }
                      `
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={`h-5 w-5 flex-shrink-0 ${
                                isActive
                                  ? "text-[var(--sage-400)]"
                                  : "text-[var(--muted-foreground)]"
                              }`}
                              aria-hidden="true"
                            />
                            <span>{item.title}</span>
                            {isActive && <span className="sr-only">(current page)</span>}
                          </>
                        )}
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
