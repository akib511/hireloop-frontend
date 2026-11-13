
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/dashboardSidebar";

const DashboardLayout = ({ children }) => {
     return (
    <SidebarProvider>
      <DashboardSidebar />
      {/* flex-1 + min-w-0: main always fills the space the sidebar leaves
          (entire screen when the sidebar is closed) without touching any page design */}
      <main className="min-w-0 flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
};

export default DashboardLayout;