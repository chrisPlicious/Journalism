import { NavLink, useNavigate } from "react-router-dom";
import { Home, List, Plus, LogOut, ChevronsUpDown } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";

export default function AppSidebar() {
  const navigate = useNavigate();
  const { logout, username, email } = useAuth();

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
    <Sidebar className="border-r dark:border-slate-800 border-black">
      <SidebarContent className="bg-zinc-800">
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel>
            <div className="flex justify-center items-center gap-4 mt-15">
              <div className="flex items-center justify-center ">
                <img
                  src="/MindNestLogoLight.png"
                  alt="MindNest Logo"
                  className="h-20 w-auto"
                />
              </div>
              <div className="flex flex-col ">
                <h1 className="text-[36px] font-extrabold text-white">
                  MindNest
                </h1>
                {/* <p className="text-1xl text-white">My entries & notes</p> */}
              </div>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="py-7">
              {items.map((item) => (
                <SidebarMenuItem key={item.to} className="">
                  <SidebarMenuButton size="xl" asChild>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 hover:bg-gray-200 ` +
                        (isActive
                          ? "bg-black text-white font-lg"
                          : "bg-white text-black")
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
      <SidebarFooter className="bg-black text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="xl"
                  className="bg-black text-white hover:bg-black hover:text-white"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg" alt={username || ""} />
                    <AvatarFallback className="rounded-lg text-black ">
                      {username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{username}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 " />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={username || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{username}</span>
                      <span className="truncate text-xs">{email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
