import BlogAdmin from "@/components/admin/blog/BlogAdmin";
import AdminSidebar from "@/components/admin/Navbar/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function BlogPage() {
  return (
    <div data-lenis-prevent className="flex h-screen">
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 overflow-auto scrollbar-thin">
          <SidebarTrigger />
          <BlogAdmin />
        </main>
      </SidebarProvider>
    </div>
  );
}
