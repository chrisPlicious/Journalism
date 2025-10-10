import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Search,
  Menu,
  Sun,
  Moon,
  LogOut,
  UserCircle,
  ChevronsUpDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/themeContext";
import React from "react";

interface HeaderProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout, username, email, avatarUrl } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isOnEntriesPage = location.pathname === "/entries";

  // Sync local search state with ?q= when on Entries page
  React.useEffect(() => {
    if (!isOnEntriesPage) return;
    const q = searchParams.get("q") || searchParams.get("search") || "";
    setSearchQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnEntriesPage, location.search]);

  // Debounce URL updates when typing on Entries page
  React.useEffect(() => {
    if (!isOnEntriesPage) return;
    const handle = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const q = searchQuery.trim();
      if (q) {
        next.set("q", q);
      } else {
        next.delete("q");
      }
      setSearchParams(next, { replace: true });
    }, 200);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnEntriesPage, searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOnEntriesPage) {
      // On Entries page, typing already updates the query via debounce
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/entries?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (isOnEntriesPage) {
      const next = new URLSearchParams(searchParams);
      next.delete("q");
      setSearchParams(next, { replace: true });
    } else {
      navigate("/entries");
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Left: Sidebar toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSidebarToggle}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Center: Global search bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

          <Input
            type="text"
            placeholder="Search journal titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <RotateCcw
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            onClick={handleClearSearch}
          />
        </div>
      </form>

      {/* Right: Theme toggle and user menu */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={avatarUrl || "/MindNestLogoDark.png"}
                  alt={username || "User Avatar"}
                />
                <AvatarFallback>
                  <img
                    src="/MindNestLogoDark.png"
                    alt="Default Logo"
                    className="w-full h-full object-cover"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{username}</span>
                <span className="text-xs text-gray-500">{email}</span>
              </div>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={avatarUrl || "/MindNestLogoDark.png"}
                    alt={username || "User Avatar"}
                  />
                  <AvatarFallback>
                    <img
                      src="/MindNestLogoDark.png"
                      alt="Default Logo"
                      className="w-full h-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{username}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
