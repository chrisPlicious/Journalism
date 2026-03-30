import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "./app-sidebar";
import Header from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  // const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header
        onSidebarToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Floating sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-full md:w-64 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
        aria-hidden={!isSidebarOpen}
      >
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </aside>

      {/* Main content */}
      <main className="mx-0 md:mx-60 px-4 md:px-8 min-h-screen">{children}</main>
    </div>
  );
}
