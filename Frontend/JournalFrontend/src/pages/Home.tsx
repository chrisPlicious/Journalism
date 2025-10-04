import AppLayout from "@/components/layouts/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppLayout>
        <SidebarTrigger />
      
      </AppLayout>
    </SidebarProvider>
  );
}
