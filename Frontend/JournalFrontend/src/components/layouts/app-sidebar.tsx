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
        <SidebarContent className="bg-white dark:bg-gray-900">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="py-4 md:py-6 lg:py-7">
                {items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton size="default" asChild className="md:h-12 md:px-6 lg:h-14 lg:px-8">
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          `
                      flex items-center gap-3 px-3 py-3 rounded-lg text-sm md:text-base lg:text-lg font-semibold
                      transition-colors duration-150 min-h-[44px]
                      ${
                        isActive
                          ? "bg-accent text-accent-foreground "
                          : "bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                      `
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" aria-hidden="true" />
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
