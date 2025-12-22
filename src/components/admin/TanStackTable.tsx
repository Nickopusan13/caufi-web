"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  flexRender,
  ColumnDef,
  Row,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FilterConfig {
  column: string;
  placeholder: string;
  options?: string[]; // For static options
  useFaceted?: boolean; // If true, use dynamic faceted values
}

interface BulkAction {
  value: string;
  label: string;
}

interface DataTableProps<TData> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  searchColumn?: string;
  filters?: FilterConfig[];
  bulkActions?: BulkAction[];
  onBulkApply?: (
    action: string,
    selectedRows: Row<TData>[]
  ) => void | Promise<void>;
  pageSize?: number;
  headerExtra?: React.ReactNode;
  isLoading?: boolean;
}

export function TanStackTable<TData>({
  title,
  data,
  columns,
  searchColumn = "name",
  filters = [],
  bulkActions = [],
  onBulkApply,
  pageSize = 15,
  headerExtra,
  isLoading = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [bulkAction, setBulkAction] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: { pageSize },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;
  const handleBulkApply = async () => {
    if (!bulkAction || !hasSelection || !onBulkApply) return;
    await onBulkApply(bulkAction, selectedRows);
    setBulkAction("");
    table.resetRowSelection();
  };
  const renderPaginationItems = () => {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    if (pageCount <= 1) return null;

    const items: React.ReactNode[] = [];
    items.push(
      <PaginationItem key={0}>
        <PaginationLink
          isActive={pageIndex === 0}
          onClick={() => table.setPageIndex(0)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    if (pageIndex > 2) {
      items.push(<PaginationEllipsis key="ellipsis-start" />);
    }
    const start = Math.max(1, pageIndex - 1);
    const end = Math.min(pageCount - 2, pageIndex + 1);
    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={pageIndex === i}
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (pageIndex < pageCount - 3) {
      items.push(<PaginationEllipsis key="ellipsis-end" />);
    }
    if (pageCount > 1) {
      items.push(
        <PaginationItem key={pageCount - 1}>
          <PaginationLink
            isActive={pageIndex === pageCount - 1}
            onClick={() => table.setPageIndex(pageCount - 1)}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          {headerExtra}
          {searchColumn && (
            <Input
              placeholder={`Search by ${searchColumn}...`}
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn(searchColumn)?.setFilterValue(e.target.value)
              }
              className="w-full sm:w-64"
            />
          )}
          {hasSelection && bulkActions.length > 0 ? (
            <div className="flex items-center gap-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Bulk action" />
                </SelectTrigger>
                <SelectContent>
                  {bulkActions.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleBulkApply}
                disabled={!bulkAction}
              >
                Apply
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Select
                  key={filter.column}
                  onValueChange={(value) =>
                    table
                      .getColumn(filter.column)
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All {filter.placeholder}
                    </SelectItem>
                    {filter.useFaceted
                      ? Array.from(
                          table
                            .getColumn(filter.column)
                            ?.getFacetedUniqueValues() ?? new Map()
                        ).map(([value]) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))
                      : filter.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-sm text-muted-foreground font-medium">
          {table.getFilteredRowModel().rows.length > 0 ? (
            <>
              <span className="text-foreground font-semibold">
                {table.getState().pagination.pageIndex * pageSize + 1}–
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>
              {" of "}
              <span className="text-foreground font-semibold">
                {table.getFilteredRowModel().rows.length}
              </span>
            </>
          ) : (
            "No results found"
          )}
        </div>
        <Pagination className="justify-center sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
