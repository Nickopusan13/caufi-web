import ProductAdminAdd from "@/components/admin/product/add-product/ProductAdminAdd";
import AdminSidebar from "@/components/admin/Navbar/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AddProductPage() {
  return (
    <div data-lenis-prevent className="flex h-screen">
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 overflow-auto scrollbar-thin p-2">
          <SidebarTrigger />
          <ProductAdminAdd />
        </main>
      </SidebarProvider>
    </div>
  );
}
