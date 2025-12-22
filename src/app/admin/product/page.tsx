import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/Navbar/AdminSidebar";
import ProductAdmin from "@/components/admin/product/ProductAdmin";

export default function AdminProductPage() {
  return (
    <div data-lenis-prevent className="flex h-screen">
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 overflow-auto scrollbar-thin">
          <SidebarTrigger />
          <ProductAdmin />
        </main>
      </SidebarProvider>
    </div>
  );
}
