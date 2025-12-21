import AddBlog from "@/components/admin/blog/add-blog/AddBlog";
import AdminSidebar from "@/components/admin/Navbar/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AddBlogPage() {
  return (
    <div data-lenis-prevent className="flex h-screen">
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 overflow-auto scrollbar-thin p-2">
          <SidebarTrigger />
          <AddBlog />
        </main>
      </SidebarProvider>
    </div>
  );
}
