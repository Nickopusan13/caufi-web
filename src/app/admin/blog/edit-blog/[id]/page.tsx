"use client";

import { useParams } from "next/navigation";
import AddBlog from "@/components/admin/blog/add-blog/AddBlog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/Navbar/AdminSidebar";

export default function EditBlogPage() {
  const { id } = useParams();
  return (
    <div data-lenis-prevent className="flex h-screen">
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 overflow-auto scrollbar-thin p-2">
          <SidebarTrigger />
          <AddBlog id={Number(id)} />
        </main>
      </SidebarProvider>
    </div>
  );
}
