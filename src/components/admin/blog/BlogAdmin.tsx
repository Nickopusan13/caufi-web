"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Search } from "lucide-react";
import { useDeleteBlog, useGetAllBlog } from "@/hooks/useBlog";
import ToasterProvider from "@/components/ToasterProvider";
import CardHeaderAdmin from "../CardHeaderAdmin";
import { useRouter } from "next/navigation";

export default function BlogAdmin() {
  const { data: dataBlog = [], isLoading } = useGetAllBlog({
    limit: 24,
    page: 1,
  });
  const router = useRouter();
  const removeMutation = useDeleteBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleDelete = (blogId: number) => {
    removeMutation.mutate(blogId);
  };
  const filteredBlogs = dataBlog.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleEdit = (id: number) => {
    router.push(`/admin/blog/edit-blog/${id}`);
  };
  return (
    <div className="container mx-auto p-6 space-y-8">
      <ToasterProvider />
      <CardHeaderAdmin
        headTitle="Blog Management"
        href="/admin/blog/add-blog"
        hrefTitle="New Blog"
      />
      <Card className="border-none shadow-xl bg-zinc-900/80 backdrop-blur-sm">
        <CardHeader className="pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-12 text-zinc-500">
              Loading blogs...
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-300">Title</TableHead>
                    <TableHead className="text-zinc-300">Description</TableHead>
                    <TableHead className="text-right text-zinc-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredBlogs.map((blog) => (
                      <motion.tr
                        key={blog.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                      >
                        <TableCell className="font-medium text-white">
                          {blog.title}
                        </TableCell>
                        <TableCell className="text-zinc-400 max-w-md truncate">
                          {blog.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(blog.id)}
                              className="hover:bg-zinc-700/50 hover:text-blue-400"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-zinc-700/50 hover:text-red-400"
                              onClick={() => setDeleteId(blog.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
              {filteredBlogs.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  {searchTerm
                    ? "No blogs found matching your search."
                    : "No blogs yet."}
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId !== null) {
                  handleDelete(deleteId);
                }
              }}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
